import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const { data, error } = await client.from('users').select('*, roles(*)')

  if (error) {
    return {
      status: 500,
      message: `Error fetching users: ${error}`,
      users: undefined
    }
  }

  return {
    status: 200,
    message: 'Users fetched',
    users: data
  }
})
