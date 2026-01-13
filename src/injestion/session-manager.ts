import { HttpService, Players } from "@rbxts/services"

export class SessionManager {
  private playerUUIDStore = new Map<Player, string>

  constructor() {
    Players.PlayerRemoving.Connect((player) => {
      this.playerUUIDStore.delete(player)
    })
  }

  private generateUUID(): string {
    return HttpService.GenerateGUID(false)
  }

  public getSessionId(player: Player) {
    let session = this.playerUUIDStore.get(player)
    if (!session) {
      session = this.generateUUID()
      this.playerUUIDStore.set(player, session)
    }
    return session
  }
}
