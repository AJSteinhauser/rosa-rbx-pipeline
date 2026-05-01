return function(handler, _services)
	local ProximityPromptService = (_services and _services.ProximityPromptService) or game:GetService("ProximityPromptService")

	ProximityPromptService.PromptTriggered:Connect(function(prompt, player)
		handler:addServerEvent(player, {
			tag    = "PromptTriggered",
			custom = { action = prompt.ActionText, object = prompt.ObjectText },
		})
	end)
end
