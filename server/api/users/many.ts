export default defineEventHandler(async (event) => {
  const supabase = await supabaseServerClient(event)

  const { data, error } = await supabase.from('users').select('*, roles(*)') // Assuming 'roles' is a foreign table related to 'users'

  if (error) {
    return {
      status: 500,
      message: 'Error fetching users',
      users: undefined
    }
  }

  return {
    status: 200,
    message: 'Users fetched',
    users: handleBigInt(data) // Assuming handleBigInt works with Supabase objects as well
  }
})
