import { handleFeatureLimitError } from '../utils/errors'
import { validateFeatureLimit } from '../utils/featureLimits'
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  // Only check POST requests
  if (event.method !== 'POST') return

  // Get the path to determine which feature to check
  const path = getRequestPath(event)

  // Map endpoints to features
  const featureMap: Record<string, string> = {
    '/api/bookmarks': 'BOOKMARKS',
    '/api/folders': 'BOOKMARK_FOLDERS',
    '/api/feeds': 'CUSTOM_FEEDS',
  }

  const feature = featureMap[path]
  if (!feature) return // Not a feature-limited endpoint

  try {
    const user = await serverSupabaseUser(event)

    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized',
      })
    }

    const supabase = await serverSupabaseClient(event)

    // Get the table name from the path
    let table = path.split('/')[2] // 'bookmarks' or 'folders'

    if (table === 'folders') {
      table = 'bookmark_folders'
    }

    // Check current count
    const { count } = await supabase
      .from(table)
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)

    await validateFeatureLimit(event, feature, count ?? 0)
  } catch (error) {
    handleFeatureLimitError(error)
  }
})
