import { PostgrestSingleResponse, SupabaseClient } from '@supabase/supabase-js'
import type { NewsType } from '@/types/news'

export default defineEventHandler(async (event) => {
  try {
    const supabaseClient: SupabaseClient = await supabaseServerClient(event)
    const res: PostgrestSingleResponse<NewsType[]> = await supabaseClient
      .from('news')
      .select('*')
      .limit(10)

    if (res.error) createError(`400: ${res.error.message}`)
    if (!res.data) createError('400: No News Returned From Supabase')

    return {
      status: 200,
      message: 'News retrieved from supabase',
      news: res.data!
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
