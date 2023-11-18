export default defineEventHandler(async (event) => {
  const users = await readBody(event)
  console.log('many-users', users)
  const client = useClient()
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

    await client.users.createMany({ data: [...mappedUsers] })

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
