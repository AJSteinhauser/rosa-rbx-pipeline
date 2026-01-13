import { HttpService } from "@rbxts/services";
import { Event, EventRequest, Position } from "../models/event.model";
import { UserConfig } from "../models/user-config.model";
import { SessionManager } from "./session-manager";
import { vector3ToPosition } from "../utils/helpers";
import { PlayerPlatformManager } from "./player-platform-manager";



// export interface Event {
//   eventId: string
//   eventTimeStamp: number;
//   sessionID: string;
//
//   tag: string;
//   platform: string
//   position: Position;
//   version: string;
//
//   quantity?: number;
//   teamId?: string;
//   mapName?: string;
//
//   custom?: Record<string, string | number>;
// };

export class EventBuilder {
  sessionManager = new SessionManager()
  platformManager = new PlayerPlatformManager()
  config: UserConfig

  constructor(config: UserConfig) {
    this.config = config
  }

  async buildEvent(event: EventRequest, player: Player): Promise<Event> {
    const userDefinedPlayerPosition = this.config.getPosition?.(player)
    const userPosition = userDefinedPlayerPosition ? 
      vector3ToPosition(userDefinedPlayerPosition) : 
      this.getPlayerPosition(player)
    const platform = await this.platformManager.getPlatform(player)

    const output: Event = {
      tag: event.tag,
      eventId: HttpService.GenerateGUID(false),
      sessionID: this.sessionManager.getSessionId(player),
      platform: platform.Name,
      eventTimeStamp: os.time(),
      position: userPosition,
      version: this.config.getVersion?.() || this.getVersion(),
      teamId: this.config.getTeamName?.(player),
      mapName: this.config.getMapName?.(player),
      quantity: event.quantity,
      custom: event.custom,
    }

    return output
  }

  getVersion(): string {
    return tostring(game.PlaceVersion)
  }

  getPlayerPosition(player: Player): Position {
    const character = player.Character
    if (!character) {
      throw "Player has no character"
    }
    const humanoidRootPart = character.FindFirstChild("HumanoidRootPart")
    if (!humanoidRootPart) {
      throw "Character has no HumanoidRootPart"
    }
    const position = (humanoidRootPart as BasePart).Position
    return vector3ToPosition(position)
  }
}
