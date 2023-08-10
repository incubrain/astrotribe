import { Role } from '@/types/roles'

export default defineEventHandler(async (event) => {
  const client = useClient()

  const { roles }: { roles: Role[] } = await readBody(event)
  // const env = useRuntimeConfig().public

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
