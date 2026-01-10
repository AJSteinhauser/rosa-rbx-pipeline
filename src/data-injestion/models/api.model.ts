
export type Headers = Record<string, any> & {
  'api-secret': Secret
}

export enum RetryableHttpStatusCode {
  RequestTimeout = 408,
  TooManyRequests = 429,
  InternalServerError = 500,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
}

export const RETRYABLE_HTTP_STATUS_CODES: ReadonlyArray<number> = [
  RetryableHttpStatusCode.RequestTimeout,
  RetryableHttpStatusCode.TooManyRequests,
  RetryableHttpStatusCode.InternalServerError,
  RetryableHttpStatusCode.BadGateway,
  RetryableHttpStatusCode.ServiceUnavailable,
  RetryableHttpStatusCode.GatewayTimeout,
] as const;
