import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const supabase = await serverSupabaseClient(event)

    const { data } = await supabase.auth.getUser()
    const { user } = data

    if (user && user.email) {
      const response = await supabase.from('user_profiles').update(body).eq('id', user.id)

      if (response.error) {
        return {
          error: response.error,
          data: [],
          status: 500,
          message: 'Error Updating User',
        }
      } else {
        return {
          error: null,
          data: [],
          status: 200,
          message: 'User Updated',
        }
      }
    }

    return {
      error: null,
      data: [],
      status: 500,
      message: 'Something went wrong',
    }
  } catch (error: any) {
    return {
      error,
      data: [],
      status: 500,
      message: 'Error',
    }
  }
})
