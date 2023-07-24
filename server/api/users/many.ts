export default defineEventHandler(async (event) => {
  const client = useClient()
  // const admin = false
  const users = await client.public_users.findMany({
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
    data = JSON.stringify(
      users,
      (key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
    )
  } else {
    status = 500
    message = 'Error getting users'
    data = undefined
  }

  return {
    status,
    message,
    users: JSON.parse(data)
  }
})
