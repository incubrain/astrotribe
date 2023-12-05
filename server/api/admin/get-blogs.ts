import { PostgrestSingleResponse, SupabaseClient } from '@supabase/supabase-js'
import type { NewsType } from '@/types/news'

export default defineEventHandler(async (event) => {
  try {
    const supabaseClient: SupabaseClient = await supabaseServerClient(event)
    const res: PostgrestSingleResponse<NewsType[]> = await supabaseClient
      .from('articles')
      .select('*')

    return {
      status: 200,
      message: 'Blogs retrieved',
      blogs: res.data
    }
  } catch (error: any) {
    console.error('get-blogs error', error.message)
    return {
      status: 500,
      message: 'Error retrieving blogs',
      error
    }
  }
})
