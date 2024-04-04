export default defineEventHandler(async (event) => {
  const client = await dbClient(event)
  // only fetch users if there is a avatar
  const { data, error } = await client.from('users').select('*, roles(*)').neq('avatar', '')

  if (error) {
    throw createError({ message: `Error fetching users: ${error}`, data: error })
  }

  if (!data || data.length === 0) {
    console.error('No users found')
  }

  return {
    status: 200,
    message: 'Users fetched',
    users: data
  }
})
