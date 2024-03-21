import { serverSupabaseClient } from '#supabase/server'
import type { NewsCardT } from '@/types/news'

export default defineEventHandler(async (event) => {
  const category = getRouterParam(event, 'category')

  if (!category) {
    return createError('400: No category provided')
  }

  try {
    const supabaseClient = await serverSupabaseClient(event)
    const { data, error } = await supabaseClient
      .from('news')
      .select('*')
      .limit(12)
      .eq('source', category)
      .order('published_at', { ascending: false })

    console.log('get-news', data, error)

    if (error) {
      createError(`400: ${error.message}`)
    }

    if (!data) {
      createError('400: No News Returned From Supabase')
    }

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
