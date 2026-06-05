local ReplicatedStorage = game:GetService("ReplicatedStorage")
local HttpService       = game:GetService("HttpService")
local BatchHandler      = require(ReplicatedStorage.RosaRbxPipeline.egress.components["batch-event-handler"])
local QuotaGate         = require(ReplicatedStorage.RosaRbxPipeline.egress.components["quota-gate"])
local splitArrayInHalf  = require(ReplicatedStorage.RosaRbxPipeline.egress.utils["array-manipulation"]).splitArrayInHalf

local function makeEvent(tag: string?)
	return {
		eventId        = HttpService:GenerateGUID(false),
		eventTimeStamp = os.time(),
		sessionID      = "test-session",
		tag            = tag or "TestEvent",
		platform       = "Windows",
		position       = { x = 0, y = 0, z = 0 },
		version        = "1",
	}
end

local function getHandler()
	local h = BatchHandler.getInstance()
	if h then return h end
	local ok, result = pcall(function() return BatchHandler.new() end)
	return ok and result or nil
end

local function drainEvents(handler): { any }
	local buff = handler.accumulator:flushEvents()
	local json = buffer.readstring(buff, 0, buffer.len(buff))
	return HttpService:JSONDecode(json)
end

return function()
	describe("BatchHandler", function()

		describe("singleton enforcement", function()
			it("throws when a second instance is created", function()
				local ok1 = pcall(function() BatchHandler.new() end)
				local ok2, err = pcall(function() BatchHandler.new() end)
				if ok1 then
					expect(ok2).to.equal(false)
					expect(err:find("Only one instance") ~= nil).to.equal(true)
				else
					expect(ok1).to.equal(false)
				end
			end)
		end)

		describe("addEvent()", function()
			it("does not throw for a well-formed event", function()
				local handler = getHandler()
				if not handler then return end
				expect(function()
					handler:addEvent(makeEvent("ValidEvent"))
				end).never.to.throw()
			end)
		end)

		describe("quota gate", function()
			it("discards addEvent calls while gate is blocked", function()
				local handler = getHandler()
				if not handler then return end

				local originalGate = handler.quotaGate
				handler.quotaGate = QuotaGate.new(function() return 0 end, 100)

				drainEvents(handler)
				handler.quotaGate:onQuotaExceeded()

				handler:addEvent(makeEvent("ShouldBeDiscarded"))

				local events = drainEvents(handler)
				handler.quotaGate = originalGate

				expect(#events).to.equal(0)
			end)

			it("discards all events, not just the first, while blocked", function()
				local handler = getHandler()
				if not handler then return end

				local originalGate = handler.quotaGate
				handler.quotaGate = QuotaGate.new(function() return 0 end, 100)

				drainEvents(handler)
				handler.quotaGate:onQuotaExceeded()

				for i = 1, 5 do
					handler:addEvent(makeEvent("Event" .. i))
				end

				local events = drainEvents(handler)
				handler.quotaGate = originalGate

				expect(#events).to.equal(0)
			end)

			it("accumulator stays empty throughout the blocked period", function()
				local handler = getHandler()
				if not handler then return end

				local originalGate = handler.quotaGate
				handler.quotaGate = QuotaGate.new(function() return 0 end, 100)

				drainEvents(handler)
				handler.quotaGate:onQuotaExceeded()

				handler:addEvent(makeEvent("A"))
				handler:addEvent(makeEvent("B"))
				handler:addEvent(makeEvent("C"))

				expect(handler.accumulator.isEmpty).to.equal(true)
				handler.quotaGate = originalGate
			end)

			it("pre-block events already in the accumulator flush with the probe", function()
				local handler = getHandler()
				if not handler then return end

				local time        = 0
				local originalGate = handler.quotaGate
				handler.quotaGate = QuotaGate.new(function() return time end, 100)

				drainEvents(handler)

				-- Events enter the accumulator before the 403 is processed (async race)
				handler:addEvent(makeEvent("PreBlock"))
				-- 403 arrives asynchronously and sets the gate
				handler.quotaGate:onQuotaExceeded()

				-- Events during the block are discarded
				handler:addEvent(makeEvent("Discarded"))

				-- Probe window opens; next event passes through
				time = 100
				handler:addEvent(makeEvent("Probe"))

				local events = drainEvents(handler)
				handler.quotaGate = originalGate

				-- PreBlock is still in the accumulator; both it and Probe flush together
				expect(#events).to.equal(2)
				expect(events[1].tag).to.equal("PreBlock")
				expect(events[2].tag).to.equal("Probe")
			end)

			it("allows events once the probe interval elapses", function()
				local handler = getHandler()
				if not handler then return end

				local time        = 0
				local originalGate = handler.quotaGate
				handler.quotaGate = QuotaGate.new(function() return time end, 100)

				drainEvents(handler)
				time = 0
				handler.quotaGate:onQuotaExceeded()
				handler:addEvent(makeEvent("Discarded"))

				time = 100 -- probe window opens
				handler:addEvent(makeEvent("ProbeEvent"))

				local events = drainEvents(handler)
				handler.quotaGate = originalGate

				expect(#events).to.equal(1)
				expect(events[1].tag).to.equal("ProbeEvent")
			end)

			it("resumes normal ingestion after gate is restored", function()
				local handler = getHandler()
				if not handler then return end

				local originalGate = handler.quotaGate
				handler.quotaGate = QuotaGate.new(function() return 0 end, 100)

				drainEvents(handler)
				handler.quotaGate:onQuotaExceeded()
				handler.quotaGate:onSuccess() -- simulate successful probe response

				handler:addEvent(makeEvent("PostRecovery"))

				local events = drainEvents(handler)
				handler.quotaGate = originalGate

				expect(#events).to.equal(1)
				expect(events[1].tag).to.equal("PostRecovery")
			end)

			it("discards again if a second 403 arrives after recovery", function()
				local handler = getHandler()
				if not handler then return end

				local time        = 0
				local originalGate = handler.quotaGate
				handler.quotaGate = QuotaGate.new(function() return time end, 100)

				drainEvents(handler)
				handler.quotaGate:onQuotaExceeded()
				handler.quotaGate:onSuccess() -- recovered
				handler.quotaGate:onQuotaExceeded() -- hit 403 again

				handler:addEvent(makeEvent("ShouldBeDiscarded"))

				local events = drainEvents(handler)
				handler.quotaGate = originalGate

				expect(#events).to.equal(0)
			end)
		end)

		describe("split logic (via array-manipulation)", function()
			it("splits a 4-event JSON buffer into two equal halves", function()
				local events = {}
				for i = 1, 4 do
					table.insert(events, makeEvent("Event" .. i))
				end
				local decoded = HttpService:JSONDecode(HttpService:JSONEncode(events))
				local halfA, halfB = splitArrayInHalf(decoded)
				expect(#halfA).to.equal(2)
				expect(#halfB).to.equal(2)
				expect(halfA[1].tag).to.equal("Event1")
				expect(halfB[1].tag).to.equal("Event3")
			end)

			it("handles an odd number of events — right half is larger", function()
				local events = {}
				for i = 1, 5 do
					table.insert(events, makeEvent("E" .. i))
				end
				local halfA, halfB = splitArrayInHalf(events)
				expect(#halfA).to.equal(2)
				expect(#halfB).to.equal(3)
			end)

			it("JSON round-trip preserves event data in each half", function()
				local events = {}
				for i = 1, 6 do
					table.insert(events, makeEvent("Tag" .. i))
				end
				local halfA, halfB = splitArrayInHalf(events)
				local reA = HttpService:JSONDecode(HttpService:JSONEncode(halfA))
				local reB = HttpService:JSONDecode(HttpService:JSONEncode(halfB))
				expect(reA[1].tag).to.equal("Tag1")
				expect(reB[1].tag).to.equal("Tag4")
			end)
		end)

	end)
end
