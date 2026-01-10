import { BatchHandler } from "./egress-pipeline/components/batch-event-handler"

export const createBatch = () => {
  return new BatchHandler()
}
