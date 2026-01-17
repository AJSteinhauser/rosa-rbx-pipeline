import { Players } from "@rbxts/services"

export class PlayerPlatformManager {
  private playerPlatformStore = new Map<Player, Enum.Platform>
  private remoteEvent: RemoteEvent | undefined 
  private requestedPlatformResolves = new Map<Player, (value: Enum.Platform | Promise<Enum.Platform>) => void>

  constructor() {
    Players.PlayerRemoving.Connect((player) => {
      this.playerPlatformStore.delete(player)
    })
    const event = this.createRemoteEvent()
    event.OnServerEvent.Connect((player: Player, ...args: unknown[]) => {
      const platform = args[0] as Enum.Platform
      this.playerPlatformStore.set(player, platform)
      const resolve = this.requestedPlatformResolves.get(player)
      if (resolve) {
        resolve(platform)
      }
    })
  }

  private createRemoteEvent(): RemoteEvent {
    const remoteEvent = new Instance("RemoteEvent")
    remoteEvent.Name = "PlatformManager"
    remoteEvent.Parent = script
    this.remoteEvent = remoteEvent
    return remoteEvent
  }

  private requestPlayerPlatform(player: Player) {
    const promise = new Promise<Enum.Platform>((resolve, reject) => {
      this.requestedPlatformResolves.set(player, resolve)
      task.delay(10, () => {
        if (this.requestedPlatformResolves.has(player)) {
          reject("Request timed out")
          this.requestedPlatformResolves.delete(player)
        }
      })
    })
    this.remoteEvent?.FireClient(player, "getPlatform")
    return promise
  }

  public async getPlatform(player: Player): Promise<Enum.Platform> {
    let platform = this.playerPlatformStore.get(player)
    if (!platform) {
      return this.requestPlayerPlatform(player)
    }
    return platform
  }
}
