import { HttpService } from "@rbxts/services";
import { LeakyBucket } from "../../utils/leaky-bucket";
import { ScalingBuffer } from "../../utils/scaling-buffer";
import { ACCUMULATOR_BUCKET_SIZE, ACCUMULATOR_LEAK_PER_SECOND, BODY_OVERSHOOT_TARGET } from "../models/constants.model";
import { Event } from "../../models/event.model";

export class Accumulator {
  private playerBuckets = new Map<string, LeakyBucket>(); 
  private dataBuffer: ScalingBuffer = new ScalingBuffer();

  constructor() {
    this.intializeEventEncoded()
  }

  public addEvent(event: Event): boolean {
    const playerBucket = this.getOrInitializeSessionBucket(event.sessionID);
    const isAllowed = playerBucket.allow();
    if (!isAllowed) {
      warn(`Player ${event.sessionID} is rate limited.`);
      return false
    }
    this.appendEvent(event)
    return this.dataBuffer.size() >= BODY_OVERSHOOT_TARGET
  }

  public flushEvents() {
    this.dataBuffer.push_string("]")
    const finalBuffer = this.dataBuffer.getBuffer();
    this.intializeEventEncoded()
    return finalBuffer
  }

  private intializeEventEncoded() {
    this.dataBuffer = new ScalingBuffer();
    this.dataBuffer.push_string("[")
  }

  private appendEvent(event: Event) {
    const encoded = this.encodeEvent(event);
    this.dataBuffer.push_string(encoded);
  }

  private encodeEvent(event: Event): string {
    return `,${HttpService.JSONEncode(event)}`
  }

  private getOrInitializeSessionBucket(sessionId: string): LeakyBucket {
    const playerBucket = this.playerBuckets.get(sessionId)
    if (playerBucket) {
      return playerBucket
    }
    const newBucket = new LeakyBucket(ACCUMULATOR_BUCKET_SIZE, ACCUMULATOR_LEAK_PER_SECOND);
    this.playerBuckets.set(sessionId, newBucket);
    return newBucket
  }
}

