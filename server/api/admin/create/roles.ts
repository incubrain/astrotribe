export default defineEventHandler(async () => {
  const client = useClient()
  const env = useRuntimeConfig().public

  let roles = []
  if (env.NODE_ENV === 'local') roles = await import('@/data/seed/roles.json')

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
