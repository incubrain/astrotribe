import { defineEventHandler, getQuery } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    // Get query parameters
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const pageSize = parseInt(query.pageSize as string) || 12
    const category = query.category as string
    const sources = query.sources ? (query.sources as string).split(',') : []
    const tags = query.tags ? (query.tags as string).split(',') : []
    const startDate = query.startDate ? new Date(query.startDate as string) : null
    const endDate = query.endDate ? new Date(query.endDate as string) : null
    const search = query.search as string

    // Calculate pagination
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    // Get Supabase client
    const client = await serverSupabaseClient(event)

    // Start building the query
    let newsQuery = client
      .from('contents')
      .select(
        `
        id, 
        content_type,
        title, 
        url, 
        created_at, 
        hot_score,
        published_at, 
        description, 
        author, 
        featured_image, 
        source_id,
        company_id,
        details
      `,
      )
      .eq('content_type', 'news')
      .eq('is_active', true)
      .is('deleted_at', null)
      .order('published_at', { ascending: false })
      .range(from, to)

    // Apply filters
    if (sources.length > 0) {
      newsQuery = newsQuery.in('source_id', sources)
    }

    if (search) {
      newsQuery = newsQuery.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Handle date range filtering
    if (startDate) {
      newsQuery = newsQuery.gte('published_at', startDate.toISOString())
    }

    if (endDate) {
      newsQuery = newsQuery.lte('published_at', endDate.toISOString())
    }

    // For category and tags filtering, we need a more complex approach since they're in JSONB
    // We'll fetch all matching the above filters and then filter in-memory
    const { data, error } = await newsQuery

    if (error) {
      throw error
    }

    // Post-process for category and tags (since they're in the JSONB details field)
    let filteredData = data

    // Category filtering
    if (category && category !== 'all' && category !== 'new' && category !== 'hot') {
      filteredData = filteredData.filter((item) =>
        item.details?.categories?.some(
          (cat: any) => cat.name?.toLowerCase() === category.toLowerCase(),
        ),
      )
    }

    // Tags filtering
    if (tags.length > 0) {
      filteredData = filteredData.filter((item) =>
        item.details?.tags?.some((tag: string) => tags.includes(tag)),
      )
    }

    // Apply special sorting if needed (already sorted by published_at by default)
    if (category === 'hot') {
      filteredData = [...filteredData].sort((a, b) => (b.hot_score || 0) - (a.hot_score || 0))
    }

    return {
      data: filteredData.slice(0, pageSize), // Make sure we don't send more than requested
      hasMore: filteredData.length === pageSize,
      page,
    }
  } catch (error) {
    console.error('Error fetching news:', error)
    return {
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error',
      hasMore: false,
      page: 1,
    }
  }
})
