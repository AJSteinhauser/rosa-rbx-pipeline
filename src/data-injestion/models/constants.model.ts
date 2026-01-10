export const ACCUMULATOR_BUCKET_SIZE = 20
export const ACCUMULATOR_LEAK_PER_SECOND = 20

export const HTTPS_BODY_LIMIT = 1024 * 1000 - 1 // 1024Kb - 2
export const BODY_OVERSHOOT_TARGET = 1.25 * HTTPS_BODY_LIMIT

export const MAX_HTTP_RETRY_ATTEMPTS = 10 

export const SECRETS_KEY_LOOKUP = 'ROSA-API-KEY'

export const INJESTION_BASE_API_ROUTE = 'https://api.rosaanalytic.com'
export const EVENTS_API_ROUTE = `${INJESTION_BASE_API_ROUTE}/log/batch`
