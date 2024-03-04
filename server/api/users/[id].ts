import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const { id } = event.context.params

  const supabase = await serverSupabaseClient(event)

  const { data, error } = await supabase
    .from('users')
    .select('*, roles(*)') // assuming 'roles' is a foreign table related to 'users'
    .eq('id', String(id))
    .single() // Since findFirst gets only one user, we use single() with Supabase

  if (error) {
    return {
      status: 500,
      message: 'Error getting user',
      user: undefined
    }
  }

  if (data) {
    return {
      status: 200,
      message: 'User fetched',
      user: handleBigInt(data) // Assuming handleBigInt works with Supabase objects as well
    }
  }

  // This can be a catch-all, in case the user is not found
  return {
    status: 404,
    message: 'User not found',
    user: undefined
  }
})
