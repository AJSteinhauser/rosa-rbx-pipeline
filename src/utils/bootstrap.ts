import { EventIngestionHandler } from "../injestion/event-injestion-handler";
import { UserConfig } from "../models/user-config.model";

let intialized = false

export const bootStrapRosa = (userConfig: UserConfig) => {
  if (intialized) {
    throw "Rosa is already intialized"
  }
  const ingestion = new EventIngestionHandler(userConfig)
  intialized = true
}
