
export interface UserConfig {
  /** 
   * Get the position of the player, defaults to the player's character
   * @default to Player.DistanceFromCharacter(new Vector3(0, 0, 0))
   * @returns the position of the player
  */
  getPosition?: (player: Player) => Vector3

  /** 
   * Get the version of the game
   * @default to game.Version
   * @returns the version number
  */
  getVersion?: () => string

  /** 
   * Get team of the player not required
   * @returns the position of the player
  */
  getTeamName?: (player: Player) => string

  /** 
   * Get current map, useful on games where the map changes, or you have multiple areas
   * @returns the current map   
  */
  getMapName?: (player: Player) => string
}
