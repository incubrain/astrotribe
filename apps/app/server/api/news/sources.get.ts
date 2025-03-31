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
      .eq('is_active', true)
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
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
})

// Helper function to extract domain name from URL
function extractDomainName(url?: string): string {
  if (!url) return 'Unknown Source'

  try {
    const urlObj = new URL(url)
    return urlObj.hostname.replace('www.', '')
  } catch {
    return 'Unknown Source'
  }
}
