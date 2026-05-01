return function(handler, _services)
	local Players = (_services and _services.Players) or game:GetService("Players")

	local function watchPlayer(player: Player)
		player.Chatted:Connect(function()
			handler:addServerEvent(player, { tag = "ChatMessage" })
		end)
	end

	Players.PlayerAdded:Connect(watchPlayer)
	for _, player in Players:GetPlayers() do
		watchPlayer(player)
	end
end
