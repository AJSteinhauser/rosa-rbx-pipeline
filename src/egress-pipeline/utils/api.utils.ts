import { HttpService } from "@rbxts/services"
import { MAX_HTTP_RETRY_ATTEMPTS } from "../models/constants.model"
import { RETRYABLE_HTTP_STATUS_CODES } from "../models/signature.model"

export const sendRetryHandler = (request: RequestAsyncRequest, retryCount = 0): [RequestAsyncResponse, number] => {
  if (retryCount > MAX_HTTP_RETRY_ATTEMPTS) {
    throw "ROSA API request failed, exceeded retry count"
  }
  const response = HttpService.RequestAsync(
    request,
  )
  if (!response.Success) {
    const allowRetry = RETRYABLE_HTTP_STATUS_CODES.includes(response.StatusCode)
    if (!allowRetry) {
      return [response, retryCount]
    }
    const exponentialBackoff = 2 ** retryCount 
    task.wait(exponentialBackoff)
    return sendRetryHandler(request, retryCount + 1)
  }
  return [response, retryCount+1]
}
