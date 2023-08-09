export default defineEventHandler(async (event) => {
  const { id } = event.context.params
  // const query = getQuery(event)
  const client = useClient()
  // const admin = false
  const user = await client.users.findFirst({
    where: {
      id: BigInt(id)
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
    data = JSON.stringify(
      user,
      (key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
    )
  } else {
    status = 500
    message = 'Error getting user'
    data = undefined
  }

  return {
    status,
    message,
    user: JSON.parse(data)
  }
})