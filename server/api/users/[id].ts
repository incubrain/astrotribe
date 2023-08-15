export default defineEventHandler(async (event) => {
  const { id } = event.context.params
  const client = useClient()
  const user = await client.users.findFirst({
    where: {
      auth_id: String(id)
    },
    include: {
      roles: true
    }
  })

  let status: number
  let message: string
  let data: any

  if (user) {
    status = 200
    message = 'User fetched'
    data = handleBigInt(user)
  } else {
    status = 500
    message = 'Error getting user'
    data = undefined
  }

  return {
    status,
    message,
    user: data
  }
})
