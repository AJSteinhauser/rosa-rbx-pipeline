import { Event } from "./event.model";

export const ACCUMULATOR_BUCKET_SIZE = 20
export const ACCUMULATOR_LEAK_PER_SECOND = 20

export const HTTPS_BODY_LIMIT = 1024 * 1000 - 1 // 1024Kb - 2
export const BODY_OVERSHOOT_TARGET = 1.25 * HTTPS_BODY_LIMIT

export interface PlayerEventBucket { 
  events: Event
  insertTime: number
}
