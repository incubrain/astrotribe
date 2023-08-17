export default defineEventHandler(async (event) => {
  try {
    const { id } = event.context.params
    // const query = getQuery(event)
    const client = useClient()
    // const admin = false
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
  } catch (error) {
    throw createError(`Error getting user: ${error}`)
  }
})
