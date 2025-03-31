import { defineEventHandler } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    // Get Supabase client
    const client = await serverSupabaseClient(event)

    // Fetch a sample of news content to extract tags
    const { data, error } = await client
      .from('contents')
      .select('details')
      .eq('content_type', 'news')
      .eq('is_active', true)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(100) // Limit to recent items for better performance

    if (error) {
      throw error
    }

    // Extract unique tags from the JSONB details field
    const tags = new Set<string>()

    data.forEach((item) => {
      const itemTags = item.details?.tags || []
      itemTags.forEach((tag: string) => {
        if (tag && typeof tag === 'string') {
          tags.add(tag)
        }
      })
    })

    return {
      data: Array.from(tags).sort(),
      error: null,
    }
  } catch (error: any) {
    console.error('Error fetching news tags:', error)
    return {
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
})
