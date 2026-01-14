import { ReplicatedStorage } from "@rbxts/services"
import { UserConfig } from "../models/user-config.model"
import { EventRequest } from "../models/event.model"
import { EventBuilder } from "./event-builder"
import { RunTimeTypeEnforcement } from "./type-enforcement"
import { BatchHandler } from "../egress-pipeline/components/batch-event-handler"


export class EventIngestionHandler {
  private serverEventStream = this.createServerEventStream()
  private clientEventStream = this.createClientEventStream()
  private userConfig: UserConfig
  private eventBuilder: EventBuilder
  private batchHandler = new BatchHandler()

  constructor(userConfig: UserConfig) {
    this.userConfig = userConfig
    this.eventBuilder = new EventBuilder(userConfig)
    this.eventConnections()
  }

  private eventConnections() {
    if (this.userConfig.clientEvents.enabled) {
      this.clientEventStream.OnServerEvent.Connect((
        player: Player, ...args: unknown[]
      ) => {
          if (!this.userConfig.clientEvents.enabled) {
            return
          }
          const event = args[0] as EventRequest
          if (this.userConfig.clientEvents.whitelistedEventTags) {
            if (!this.userConfig.clientEvents.whitelistedEventTags.includes(event.tag)) {
              return
            }
          }
          this.registerEvent(player, event)
      })
    }

    this.serverEventStream.Event.Connect((player: Player, ...args: unknown[]) => {
      const event = args[0] as EventRequest
      this.registerEvent(player, event)
    })
  }

  private registerEvent(player: Player, event: EventRequest): void {
    this.eventBuilder.buildEvent(player, event).then((fullEvent) => {
      RunTimeTypeEnforcement.enforce(fullEvent)
      this.batchHandler.addEvent(fullEvent)
    })
  }

  private createServerEventStream() {
    const bindable = new Instance("BindableEvent")
    bindable.Name = "ServerEventStream"
    return bindable
  }

  private createClientEventStream() {
    const remote = new Instance("RemoteEvent")
    remote.Name = "ClientEventStream"
    if (!script.IsDescendantOf(ReplicatedStorage)){
      remote.Parent = ReplicatedStorage
    }
    return remote
  }
}
