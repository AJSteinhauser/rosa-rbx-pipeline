import { Event } from "./event.model";

export const ACCUMULATOR_BUCKET_SIZE = 20
export const ACCUMULATOR_LEAK_PER_SECOND = 20

export const HTTPS_BODY_LIMIT = 1024 * 1000 - 1 // 1024Kb - 2

export interface PlayerEventBucket { 
  events: Event
  insertTime: number
}
