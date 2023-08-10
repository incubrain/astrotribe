export default defineEventHandler(async () => {
  const env = useRuntimeConfig().public
  let users = []
  if (env.NODE_ENV === 'local') users = await import('@/data/seed/users.json')
  const client = useClient()
  let message
  let status

  // Function to insert users from JSON file
  console.log('trying to add users')
  if (users.length > 0) {
    const mappedUsers = users.map((user) => {
      if (user.dob !== null) {
        user.dob = new Date(user.dob).toISOString()
      }
      user.created_at = new Date(user.created_at).toISOString()
      user.updated_at = new Date(user.updated_at).toISOString()
      user.last_seen = new Date(user.last_seen).toISOString()
      return {
        ...user
      }
    })

    await client.users.createMany({ data: [...mappedUsers] })

    status = 200
    message = 'Users have been inserted successfully'
  } else {
    console.log('no users to add')
    status = 200
    message = 'no users to add'
  }

  return {
    status,
    message
  }
})
