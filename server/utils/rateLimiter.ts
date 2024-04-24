import type { H3Event } from 'h3'

const rateLimitConfig = {
  user: {
    interval: 1800000,
    maxRequests: 5
  },
  premium: {
    interval: 1800000,
    maxRequests: 20
  }
}

// consider using   const ip = getRequestIP(event); // "192.0.2.0"
// consider using   const userAgent = getRequestHeader(event, 'user-agent');
// consider using   const referer = getRequestHeader(event, 'referer');
// getRequestFingerprint(event, opts) instead of correlation-id

// this can probably be improved once we have role based access implmented
// all info can be appended to the event.context object

type RoleKey = keyof typeof rateLimitConfig

interface RateLimitInfo {
  requestCount: number
  expiresAt: number
}

export const rateLimiter = async (event: H3Event) => {
  const userID = getRequestHeader(event, 'X-USER-ID')
  const userRole: RoleKey = (getRequestHeader(event, 'X-USER-ROLE') as RoleKey) || 'user'
  const storage = useStorage<RateLimitInfo>('rateLimit')
  const storageKey = `requests:${userRole}:${userID}`
  const settings = rateLimitConfig[userRole]

  if (!userID) {
    throw createError({ message: 'UserID not found, You must be logged in to use this endpoint' })
  }

  let rateLimit = await storage.getItem(storageKey)
  if (!rateLimit || rateLimit.expiresAt < Date.now()) {
    // first api call, or it has expired
    console.log('No rate limit found, or it has expired')
    rateLimit = {
      requestCount: 1,
      expiresAt: Date.now() + settings.interval
    }
  }

  if (rateLimit.requestCount > settings.maxRequests) {
    console.log('THROWING ERROR')
    throw createError({
      statusCode: 429,
      statusMessage: 'Too many requests',
      message: `You have exceeded your limit of ${settings.maxRequests} calls to ${
        event.path.split('?')[0]
      } in the last ${settings.interval / 60000} minutes`
    })
  }

  rateLimit.requestCount++

  await storage.setItem(storageKey, rateLimit)
}
