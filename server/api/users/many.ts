export default defineEventHandler(async (event) => {
  const client = useClient()
  const users = await client.users.findMany({
    include: {
      roles: true
    }
  })

  let status: number
  let message: string
  let data: any

  if (users) {
    status = 200
    message = 'Users fetched'
    data = handleBigInt(users)
  } else {
    status = 500
    message = 'Error getting users'
    data = undefined
  }

  return {
    status,
    message,
    users: data
  }
})
