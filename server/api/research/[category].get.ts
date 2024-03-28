import type { NewsCardT } from '@/types/news'

export default defineEventHandler(async (event) => {
  const { category } = getRouterParams(event)
  const { skip, limit } = getQuery(event)

  console.log('get-research', category, skip, limit)
  const rangeEnd = limit ? Number(limit) + Number(skip) : 24
  const rangeStart = skip ? Number(skip) : 0

  if (!category) {
    throw createError({ message: 'No category provided' })
  }

  try {
    const supabaseClient = await dbClient(event)
    let query = supabaseClient
      .from('papers')
      .select('*')
      .range(rangeStart, rangeEnd)
      .order('published_at', { ascending: false })

    if (category !== 'all') {
      console.log('category', category)
      query = query.eq('source', category)
    }

    const { data, error } = await query

    if (error?.message) {
      throw createError({ message: error.message })
    }

    if (!data || data.length === 0) {
      throw createError({ message: 'No Research Returned From Supabase' })
    }

    return {
      research: data as NewsCardT[],
      error: null
    }
  } catch (error: any) {
    console.error('get-research error', error.message)
    return {
      research: null,
      error
    }
  }
})
