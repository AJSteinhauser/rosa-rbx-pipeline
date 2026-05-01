return function(handler, _services)
	local Players = (_services and _services.Players) or game:GetService("Players")
	local getTime = (_services and _services.getTime) or os.time

	local joinTimes = {} -- [Player] = time at join

	Players.PlayerAdded:Connect(function(player)
		joinTimes[player] = getTime()
		handler:addServerEvent(player, { tag = "PlayerJoin" })
	end)

	Players.PlayerRemoving:Connect(function(player)
		local duration = joinTimes[player] and (getTime() - joinTimes[player]) or nil
		joinTimes[player] = nil
		handler:addServerEvent(player, {
			tag      = "PlayerLeave",
			quantity = duration,
		})
	end)
end
