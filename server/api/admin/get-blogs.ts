import { PostgrestSingleResponse, SupabaseClient } from '@supabase/supabase-js'
import type { NewsType } from '@/types/news'
import serverSupabaseClient from '~/server/utils/useSupabaseClient'

export default defineEventHandler(async (event) => {
  try {
    const supabaseClient: SupabaseClient = await serverSupabaseClient(event)
    const res = (await supabaseClient.from('articles').select('*')) as PostgrestSingleResponse<
      NewsType[]
    >

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
