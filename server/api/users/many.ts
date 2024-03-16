export default defineEventHandler(async (event) => {
  const client = await supabaseServerClient(event)
  // only fetch users if there is a avatar
  const { data, error } = await client.from('users').select('*, roles(*)').neq('avatar', '')

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
