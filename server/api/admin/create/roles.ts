const roles = []

export default defineEventHandler(async () => {
  const client = useClient()

  // Function to insert users from JSON file
  if (roles.length > 0) {
    const mappedRoles = roles.map((role) => {
      role.created_at = new Date(role.created_at).toISOString()
      return {
        ...role
      }
    })

    await client.roles.createMany({ data: [...mappedRoles] })
  }

  return {
    status: 200,
    message: 'Users have been inserted successfully'
  }
})
