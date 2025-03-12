import type { H3Event } from 'h3'

interface Category {
  readonly id: string
  readonly feed_id: string
  readonly category_id: string
}

export default defineEventHandler(async (event: H3Event) => {
  const { addFeed } = usePages()
  if (event.method === 'POST') {
    try {
      const client = useSupabaseClient()
      const { name, selectedCategories, selectedSourceIds } = await readBody(event)
      const { profile } = useCurrentUser()

      if (profile?.id) {
        if (!name.trim()) {
          throw createError({ statusCode: 400, message: 'Feed name is required' })
        }

        if (!selectedCategories.length && !selectedSourceIds.size) {
          throw createError({
            statusCode: 400,
            message: 'At least one category needs to be selected',
          })
        }

        // Get current folder count
        const { count } = await client
          .from('feeds')
          .select('*', { count: 'exact' })
          .eq('user_id', profile.id)

        // Validate feature limit
        await validateFeatureLimit(event, 'CUSTOM_FEEDS', count || 0)

        // Create feed
        const { data: feedData, error: feedError } = await client
          .from('feeds')
          .insert({ user_id: profile.id, name })
          .select('id')
          .single()

        if (feedError) throw feedError

        const feed_id = feedData.id

        // Insert categories
        if (selectedCategories.length) {
          const { error: categoriesError } = await client
            .from('feed_categories')
            .insert(
              selectedCategories.map((category: Category) => ({
                feed_id,
                category_id: category.id,
              })),
            )

          if (categoriesError) throw categoriesError
        }

        // Insert sources - Updated to work with new content_sources table
        if (selectedSourceIds.size) {
          const { error: sourcesError } = await client
            .from('feed_sources')
            .insert(
              Array.from(selectedSourceIds).map((sourceId) => ({
                feed_id,
                content_source_id: sourceId,
              })),
            )

          if (sourcesError) throw sourcesError
        }
        addFeed(feed_id, name.value)

        return { feed_id, name }
      }
    } catch (error: any) {
      console.error('Feeds API Error:', error)
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.message || 'Internal server error',
      })
    }
  } else if (event.method === 'GET') {
    // Get feed content
    const client = useSupabaseClient()
    const { profile } = useCurrentUser()
    const { feed_id } = getQuery(event)

    if (!profile?.id) {
      throw createError({ statusCode: 401, message: 'Unauthorized' })
    }

    try {
      // First, get the feed's sources and categories
      const [{ data: sources }, { data: categories }] = await Promise.all([
        client.from('feed_sources').select('content_source_id').eq('feed_id', feed_id),
        client.from('feed_categories').select('category_id').eq('feed_id', feed_id),
      ])

      const sourceIds = sources?.map((s) => s.content_source_id) || []
      const categoryIds = categories?.map((c) => c.category_id) || []

      // Now query the unified contents table with the appropriate filters
      let query = client
        .from('contents')
        .select(
          `
          id, 
          content_type, 
          title, 
          description, 
          url, 
          published_at, 
          author, 
          featured_image, 
          hot_score,
          source_id,
          company_id,
          details
        `,
        )
        .is('deleted_at', null)
        .eq('is_active', true)
        .order('published_at', { ascending: false })
        .limit(50)

      // Add filters based on feed configuration
      if (sourceIds.length > 0) {
        query = query.in('source_id', sourceIds)
      }

      // For categories, we need to use a different approach since they might be in the details JSONB
      if (categoryIds.length > 0) {
        // This assumes category info is stored in details->category_id
        // Adjust according to your actual JSONB structure
        const categoryFilters = categoryIds
          .map((id) => `details->>'category_id' = '${id}'`)
          .join(' OR ')

        query = query.or(categoryFilters)
      }

      const { data: contents, error } = await query

      if (error) throw error

      return { data: contents }
    } catch (error: any) {
      console.error('Feed content fetch error:', error)
      throw createError({ statusCode: 500, message: 'Failed to fetch feed content' })
    }
  }
})
