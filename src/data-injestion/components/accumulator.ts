import { HttpService } from "@rbxts/services";
import { LeakyBucket } from "../../utils/leaky-bucket";
import { Event } from "../models/event.model";
import { ACCUMULATOR_BUCKET_SIZE, ACCUMULATOR_LEAK_PER_SECOND } from "../models/accumulator.model";

export class Accumulator {
  private eventsEncoded = ""
  private playerBuckets = new Map<string, LeakyBucket>(); 

  constructor() {
    this.intializeEventEncoded()
  }

  public addEvent(event: Event) {
    const playerBucket = this.getOrInitializePlayerBucket(event.playerId);
    const isAllowed = playerBucket.allow();
    if (!isAllowed) {
      warn(`Player ${event.playerId} is rate limited.`);
      return
    }
    this.appendEvent(event)
  }

  public flushEvents() {
    this.eventsEncoded += "]";
    const buff = buffer.fromstring(this.eventsEncoded)
    this.intializeEventEncoded()
  }

  private intializeEventEncoded() {
    this.eventsEncoded = "[";
  }

  private appendEvent(event: Event) {
    const encoded = this.encodeEvent(event);
    this.eventsEncoded += encoded
  }


  private encodeEvent(event: Event): string {
    return `,${HttpService.JSONEncode(event)}`
  }

  private getOrInitializePlayerBucket(playerId: string): LeakyBucket {
    const playerBucket = this.playerBuckets.get(playerId)
    if (playerBucket) {
      return playerBucket
    }
    const newBucket = new LeakyBucket(ACCUMULATOR_BUCKET_SIZE, ACCUMULATOR_LEAK_PER_SECOND);
    this.playerBuckets.set(playerId, newBucket);
    return newBucket
  }

}

