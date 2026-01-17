import { HttpService } from "@rbxts/services";
import { Event } from "../models/event.model";

export class RunTimeTypeEnforcement {
  private constructor() {
    throw 'This class cannot be instantiated';
  }

  public static enforce(value: Event) {
    const rawEvent = HttpService.JSONEncode(value)

    if (typeOf(value) !== "table") {
      throw `Event is not a table: ${rawEvent}`
    }

    if (typeOf(value.tag) !== "string") {
      throw `Event.tag is not a string: ${rawEvent}`
    }

    if (typeOf(value.position) !== "table") {
      throw `Event.position is not a table: ${rawEvent}`
    }

    if (typeOf(value.position.x) !== "number") {
      throw `Event.position.x is not a number: ${rawEvent}`
    }

    if (typeOf(value.position.y) !== "number") {
      throw `Event.position.x is not a number: ${rawEvent}`
    }

    if (typeOf(value.position.z) !== "number") {
      throw `Event.position.x is not a number: ${rawEvent}`
    }

    if (typeOf(value.eventTimeStamp) !== "number") {
      throw `Event.eventTimeStamp is not a number: ${rawEvent}`
    }

    if (typeOf(value.sessionID) !== "string") {
      throw `Event.sessionID is not a string: ${rawEvent}`
    }

    if (typeOf(value.platform) !== "string") {
      throw `Event.platform is not a string: ${rawEvent}`
    }

    if (value.quantity && typeOf(value.quantity) !== "number") {
      throw `Event.quantity is not a number: ${rawEvent}`
    }

    if (value.teamId && typeOf(value.teamId) !== "string") {
      throw `Event.teamId is not a string: ${rawEvent}`
    }

    if (value.mapName && typeOf(value.mapName) !== "string") {
      throw `Event.mapName is not a string: ${rawEvent}`
    }

    if (value.version && typeOf(value.version) !== "string") {
      throw `Event.version is not a string: ${rawEvent}`
    }

    if (value.custom){ 
      if (typeOf(value.custom) !== "table") {
        throw `Event.custom is not a table: ${rawEvent}`
      }
      const stringifed = HttpService.JSONEncode(value.custom)
      if (stringifed.size() > 500) {
        throw `Event.custom is too large: ${rawEvent}`
      }
      for (const [key, entry] of pairs(value.custom)) {
        const valueType = typeOf(entry)
        if (valueType !== "string" && valueType !== "number") {
          throw `Event.custom.${key} is not a string nor a number: ${rawEvent}`
        }
      }
    }
  }
}
