export default defineEventHandler(async (event) => {
  const users = await readBody(event)
  const client = dbClient(event)
  let message
  let status

  // Function to insert users from JSON file
  if (users.length > 0) {
    const mappedUsers = users.map((user) => {
      if (user.dob !== null) {
        user.dob = new Date(user.dob).toISOString()
      }
      user.created_at = new Date().toISOString()
      user.updated_at = new Date().toISOString()
      user.last_seen = new Date().toISOString()
      return {
        ...user
      }
    })

    const { data, error } = await client
      .from('user_profiles')
      .createMany({ data: [...mappedUsers] })
      .select('*')

    status = 200
    message = 'Users have been inserted successfully'
  } else {
    console.error('no users to add')
    status = 200
    message = 'no users to add'
  }

  return {
    status,
    message
  }
})
