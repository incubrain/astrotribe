import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'
import { FEATURES, PlanType } from '#shared/constants'
import { handleFeatureLimitError } from '#shared/error-handlers'

// Map API endpoints to features
const featureMap: Record<string, string> = {
  '/api/news': 'CONTENTS',
  '/api/companies': 'COMPANIES',
  '/api/bookmarks': 'BOOKMARKS',
  '/api/folders': 'BOOKMARK_FOLDERS',
  '/api/jobs': 'JOB_LISTINGS',
}

export default defineEventHandler(async (event) => {
  // Skip for non-GET/POST requests
  if (!['GET', 'POST'].includes(event.method)) return

  // Get the endpoint path
  const path = getRequestPath(event)

  // Check if this endpoint is limited
  const featureKey = Object.keys(featureMap).find((key) => path.startsWith(key))
  if (!featureKey) return

  const feature = featureMap[featureKey]

  try {
    // Get current user
    const user = await serverSupabaseUser(event)
    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized',
      })
    }

    // Get user plan from metadata
    const userPlan = user.app_metadata?.plan || 'free'

    // For GET requests, modify the query to limit results
    if (event.method === 'GET') {
      const limit = FEATURES[feature].limit[userPlan === 'free' ? PlanType.FREE : PlanType.PRO]

      // Only apply limit for free users
      if (userPlan === 'free' && limit !== -1) {
        // Add limit parameter to query
        const query = getQuery(event)
        const currentLimit = query.limit ? parseInt(query.limit as string) : 100

        // Only restrict if requested limit exceeds feature limit
        if (currentLimit > limit) {
          // Apply limit to query
          setQuery(event, {
            ...query,
            limit: limit.toString(),
          })
        }
      }
    }

    // For POST requests, check current count before allowing
    if (event.method === 'POST') {
      // Only check for free users
      if (userPlan === 'free') {
        const supabase = await serverSupabaseClient(event)

        // Get table name based on feature
        let table = path.split('/')[2]

        // Handle special cases
        if (table === 'folders') {
          table = 'bookmark_folders'
        }

        // Get current count
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact' })
          .eq('user_id', user.id)

        if (error) {
          console.error('Error checking count:', error)
          return
        }

        const limit = FEATURES[feature].limit[PlanType.FREE]

        // Block if limit reached
        if (limit !== -1 && count >= limit) {
          throw createError({
            statusCode: 402, // Payment Required
            message: `You have reached the ${FEATURES[feature].name.toLowerCase()} limit for your plan.`,
            data: {
              feature,
              limit,
              upgrade: true,
            },
          })
        }
      }
    }
  } catch (error: any) {
    handleFeatureLimitError(error)
  }
})
