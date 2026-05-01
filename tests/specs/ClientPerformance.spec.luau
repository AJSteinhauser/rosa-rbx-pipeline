local ReplicatedStorage    = game:GetService("ReplicatedStorage")
local setupClientPerf      = require(ReplicatedStorage.RosaRbxPipeline.ingestion["default-metrics"]["client-performance"])

local function makeSignal()
	local cbs = {}
	return {
		Connect = function(_, fn) table.insert(cbs, fn) end,
		Fire    = function(_, ...) for _, fn in cbs do fn(...) end end,
	}
end

local function makeHandler()
	local calls = {}
	return {
		calls = calls,
		addClientEvent = function(_, event)
			table.insert(calls, { event = event })
		end,
	}
end

return function()
	describe("ClientPerformance", function()

		it("fires FpsSample after the sample interval elapses", function()
			local heartbeat = makeSignal()
			local handler   = makeHandler()
			local time      = 0
			local svc = {
				RunService = { Heartbeat = heartbeat },
				getTime    = function() return time end,
			}

			setupClientPerf(handler, svc)
			-- Simulate 60fps for 30 seconds: 1800 frames of ~0.0167s each
			local dt = 1 / 60
			for _ = 1, 1800 do
				heartbeat:Fire(dt)
			end
			time = 31 -- advance clock past sample interval
			heartbeat:Fire(dt) -- triggers sample

			expect(#handler.calls).to.equal(1)
			expect(handler.calls[1].event.tag).to.equal("FpsSample")
			expect(handler.calls[1].event.quantity).to.be.near(60, 1)
		end)

		it("does not fire before the sample interval elapses", function()
			local heartbeat = makeSignal()
			local handler   = makeHandler()
			local time      = 0
			local svc = {
				RunService = { Heartbeat = heartbeat },
				getTime    = function() return time end,
			}

			setupClientPerf(handler, svc)
			heartbeat:Fire(1 / 60)
			time = 10 -- only 10 seconds, below 30s interval

			expect(#handler.calls).to.equal(0)
		end)

		it("resets counters after a sample so next sample is independent", function()
			local heartbeat = makeSignal()
			local handler   = makeHandler()
			local time      = 0
			local svc = {
				RunService = { Heartbeat = heartbeat },
				getTime    = function() return time end,
			}

			setupClientPerf(handler, svc)

			-- First sample at 30fps for 31s
			local dt30 = 1 / 30
			for _ = 1, 930 do heartbeat:Fire(dt30) end
			time = 31
			heartbeat:Fire(dt30)

			-- Second sample at 60fps for another 31s
			local dt60 = 1 / 60
			for _ = 1, 1860 do heartbeat:Fire(dt60) end
			time = 62
			heartbeat:Fire(dt60)

			expect(#handler.calls).to.equal(2)
			expect(handler.calls[1].event.quantity).to.be.near(30, 1)
			expect(handler.calls[2].event.quantity).to.be.near(60, 1)
		end)

	end)
end
