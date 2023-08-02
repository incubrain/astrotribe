import users from './data/users.json'

export default defineEventHandler(async () => {
  const client = useClient()

  // Function to insert users from JSON file

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

  return {
    status: 200,
    message: 'Users have been inserted successfully'
  }
})
