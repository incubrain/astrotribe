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
          throw createError({
            statusCode: 400,
            message: 'Feed name is required',
          })
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
          const { error: categoriesError } = await client.from('feed_categories').insert(
            selectedCategories.map((category: Category) => ({
              feed_id,
              category_id: category.id,
            })),
          )

          if (categoriesError) throw categoriesError
        }

        // Insert sources
        if (selectedSourceIds.size) {
          const { error: sourcesError } = await client.from('feed_sources').insert(
            Array.from(selectedSourceIds).map((companyId) => ({
              feed_id,
              content_source_id: companyId,
            })),
          )

          if (sourcesError) throw sourcesError
        }
        addFeed(feed_id, name.value)

        return { feed_id, name }
      }
    } catch (error) {
      console.error('Feeds API Error:', err)
      throw createError({
        statusCode: err.statusCode || 500,
        message: err.message || 'Internal server error',
      })
    }
  }
})
