export default defineEventHandler(async (event) => {
  const client = await supabaseServerClient(event)
  const { data, error } = await client.from('users').select('*, roles(*)')

  console.log('manyUsers:', data, error)
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