return function(handler, _services)
	local Players = (_services and _services.Players) or game:GetService("Players")

	local function onCharacterAdded(player: Player, character: Model)
		local humanoid = character:WaitForChild("Humanoid") :: Humanoid
		local lastHealth = humanoid.Health

		humanoid.HealthChanged:Connect(function(newHealth)
			local delta = lastHealth - newHealth
			if delta >= 0.5 then
				handler:addServerEvent(player, {
					tag      = "DamageTaken",
					quantity = math.floor(delta),
					custom   = { healthPct = math.floor(newHealth / humanoid.MaxHealth * 100) },
				})
			end
			lastHealth = newHealth
		end)
	end

	Players.PlayerAdded:Connect(function(player)
		player.CharacterAdded:Connect(function(character)
			onCharacterAdded(player, character)
		end)
	end)

	for _, player in Players:GetPlayers() do
		player.CharacterAdded:Connect(function(character)
			onCharacterAdded(player, character)
		end)
		if player.Character then
			task.spawn(onCharacterAdded, player, player.Character)
		end
	end
end
