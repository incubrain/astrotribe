const rateLimitConfig = {
  free: {
    interval: 1800000,
    maxRequests: 3
  },
  basic: {
    interval: 1800000,
    maxRequests: 10
  },
  intermediate: {
    interval: 1800000,
    maxRequests: 20
  },
  premium: {
    interval: 1800000,
    maxRequests: 30
  }
}

// consider using   const ip = getRequestIP(event); // "192.0.2.0"
// consider using   const userAgent = getRequestHeader(event, 'user-agent');
// consider using   const referer = getRequestHeader(event, 'referer');
// getRequestFingerprint(event, opts) instead of correlation-id

// this can probably be improved once we have role based access implmented
// all info can be appended to the event.context object

type PlanKey = keyof typeof rateLimitConfig

interface RateLimitInfo {
  requestCount: number
  expiresAt: number
}

// pass the required context from another general session middleware.
// add user roles, permissions, privellages.
export async function rateLimiter() {
  console.log('RATE-LIMITER TRIGGERED')
  const event = useEvent()
  const permissions = await getUserPermissions()

  if (!permissions) {
    throw createError({ message: 'User not found, You must be logged in to use this endpoint' })
  }

  const user = permissions.user

  // test this
  console.log('rateLimiter', user, event.path)

  const userPlan: PlanKey = (user.user_plan as PlanKey) ?? 'free'
  const storage = useStorage('session')
  const storageKey = `rateLimit:endpoint:${userPlan}:${user.user_id}`
  const settings = rateLimitConfig[userPlan]

  let rateLimit = await storage.getItem<RateLimitInfo>(storageKey)
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
