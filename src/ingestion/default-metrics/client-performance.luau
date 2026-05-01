local SAMPLE_INTERVAL = 30 -- seconds

return function(handler, _services)
	local RunService = (_services and _services.RunService) or game:GetService("RunService")
	local getTime    = (_services and _services.getTime)    or os.clock

	local totalTime  = 0
	local frameCount = 0
	local lastSample = getTime()

	RunService.Heartbeat:Connect(function(dt)
		totalTime  += dt
		frameCount += 1

		if getTime() - lastSample >= SAMPLE_INTERVAL then
			local fps = frameCount / totalTime
			handler:addClientEvent({
				tag      = "FpsSample",
				quantity = math.floor(fps),
			})
			totalTime   = 0
			frameCount  = 0
			lastSample  = getTime()
		end
	end)
end
