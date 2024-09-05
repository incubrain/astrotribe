type PlanKey = 'free' | 'basic' | 'intermediate' | 'premium'
type FeatureKey = 'ask'

interface FeatureConfig {}

const rateLimitConfig = {
  free: {
    ask: {
      interval: 1800000,
      maxRequests: 3,
    },
  },
  basic: {
    ask: {
      interval: 1800000,
      maxRequests: 10,
    },
  },
  intermediate: {
    ask: {
      interval: 1800000,
      maxRequests: 20,
    },
  },
  premium: {
    ask: {
      interval: 1800000,
      maxRequests: 30,
    },
  },
}

// consider using   const ip = getRequestIP(event); // "192.0.2.0"
// consider using   const userAgent = getRequestHeader(event, 'user-agent');
// consider using   const referer = getRequestHeader(event, 'referer');
// getRequestFingerprint(event, opts) instead of correlation-id

// this can probably be improved once we have role based access implmented
// all info can be appended to the event.context object

interface RateLimitInfo {
  requestCount: number
  expiresAt: number
}

const getFeatureFromPath = (path: string): FeatureKey => {
  const feature = path.split('/').pop()?.split('?')[0] as FeatureKey
  console.log('getFeatureFromPath', feature)
  return feature
}

export async function rateLimiter() {
  const event = useEvent()
  const feature = getFeatureFromPath(event.path)
  const permissions = await getUserPermissions()

  if (!permissions) {
    throw createError({ message: 'User not found, You must be logged in to use this endpoint' })
  }

  const user = permissions.user

  const userPlan: PlanKey = (user.user_plan as PlanKey) ?? 'free'
  const storage = useStorage('session')
  const storageKey = `rateLimit:endpoint:${userPlan}:${user.user_id}`
  const settings = rateLimitConfig[userPlan][feature]

  let rateLimit = await storage.getItem<RateLimitInfo>(storageKey)
  if (!rateLimit || rateLimit.expiresAt < Date.now()) {
    console.info('Rate limit not found, or it has expired')
    rateLimit = {
      requestCount: 1,
      expiresAt: Date.now() + settings.interval,
    }
  }

  if (rateLimit.requestCount > settings.maxRequests) {
    throw createError({
      statusCode: 429,
      statusMessage: `Exceeded ${feature.charAt(0).toUpperCase()}${feature.slice(1)} Limits`,
      message: `You have exceeded your limit of ${settings.maxRequests}
       requests in the last ${settings.interval / 60000} minutes`,
    })
  }

  rateLimit.requestCount++

  await storage.setItem(storageKey, rateLimit)
}
