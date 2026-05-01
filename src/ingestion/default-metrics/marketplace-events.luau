return function(handler, _services)
	local MarketplaceService = (_services and _services.MarketplaceService) or game:GetService("MarketplaceService")
	local Players            = (_services and _services.Players)            or game:GetService("Players")

	MarketplaceService.PromptProductPurchaseFinished:Connect(function(userId, productId, isPurchased)
		local player = Players:GetPlayerByUserId(userId)
		if not player then return end
		handler:addServerEvent(player, {
			tag    = isPurchased and "ProductPurchased" or "ProductDeclined",
			custom = { productId = productId },
		})
	end)

	MarketplaceService.PromptGamePassPurchaseFinished:Connect(function(player, gamePassId, wasPurchased)
		handler:addServerEvent(player, {
			tag    = wasPurchased and "GamePassPurchased" or "GamePassDeclined",
			custom = { gamePassId = gamePassId },
		})
	end)
end
