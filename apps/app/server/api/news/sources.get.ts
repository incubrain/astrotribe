import { defineEventHandler } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    // Get Supabase client
    const client = await serverSupabaseClient(event)

    // Query content sources that are related to news
    const { data, error } = await client
      .from('content_sources')
      .select('id, name, url, content_type')
      .eq('content_type', 'news')
      // Removed the is_active filter as this column doesn't exist
      .order('name')

    if (error) {
      throw error
    }

    return {
      data: data.map((source) => ({
        id: source.id,
        name: source.name || extractDomainName(source.url),
        url: source.url,
      })),
      error: null,
    }
  } catch (error: any) {
    console.error('Error fetching news sources:', error)
    return {
      data: [],
      error: error.message || 'Failed to fetch news sources',
    }
  }
})

// Helper function to extract domain name from URL
function extractDomainName(url: string): string {
  try {
    const domain = new URL(url).hostname
    return domain.replace(/^www\./, '')
  } catch (e) {
    return url
  }
}
