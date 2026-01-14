

export type UserConfig = {
	--[[
		Get the position of the player, defaults to the player's character
		@default Player:DistanceFromCharacter(Vector3.new(0, 0, 0))
		@returns Vector3 -- the position of the player
	]]
	getPosition: ((player: Player) -> Vector3)?,

	--[[
		Get the version of the game
		@default game.Version
		@returns string -- the version number
	]]
	getVersion: (() -> string)?,

	--[[
		Get team of the player (not required)
		@returns string -- the team name of the player
	]]
	getTeamName: ((player: Player) -> string)?,

	--[[
		Get current map, useful on games where the map changes,
		or you have multiple areas
		@returns string -- the current map
	]]
	getMapName: ((player: Player) -> string)?,

	clientEvents: {
		enabled: boolean,
		whitelistedEventTags: { string }?,
	},
}

local DEFAULT_CONFIG: UserConfig = {
	clientEvents = {
		enabled = false
	},
}
