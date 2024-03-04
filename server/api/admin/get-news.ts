import type { NewsType } from '@/types/news'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const supabaseClient = await serverSupabaseClient(event)
    const { data, error } = await supabaseClient.from('news').select('*').limit(10)

    if (error) {
      createError(`400: ${error.message}`)
    }

    if (!data) {
      createError('400: No News Returned From Supabase')
    }

    return {
      status: 200,
      message: 'News retrieved from supabase',
      news: data
    }
  } catch (error: any) {
    console.error('get-news error', error.message)
    return {
      status: 500,
      message: 'Error retrieving news',
      error
    }
  }
})
