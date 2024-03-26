import type { NewsCardT } from '@/types/news'

export default defineEventHandler(async (event) => {
  const { category, skip, limit } = getRouterParams(event)

  const rangeEnd = limit ? Number(limit) + Number(skip) : 5
  const rangeStart = skip ? Number(skip) : 0

  if (!category) {
    throw createError({ message: 'No category provided' })
  }

  try {
    const supabaseClient = await dbClient(event)
    let query = supabaseClient
      .from('news')
      .select('*')
      .range(rangeStart, rangeEnd)
      .order('published_at', { ascending: false })

    if (category !== 'all') {
      query = query.eq('source', category)
    }

    const { data, error } = await query

    if (error?.message) {
      throw createError({ message: error.message })
    }

    if (!data || data.length === 0) {
      throw createError({ message: 'No News Returned From Supabase' })
    }

    console.log('get-news', data, error)

    return {
      status: 200,
      message: 'News retrieved from supabase',
      news: data as NewsCardT[]
    }
  } catch (error: any) {
    console.error('get-news error', error.message)
    return {
      status: 500,
      message: 'Error retrieving news',
      news: null,
      error
    }
  }
})
