export default defineEventHandler(async (event) => {
  console.log('GET-USER')
  try {
    const { id } = event.context.params
    // const query = getQuery(event)
    const client = useClient()
    console.log('getting user', id)
    // const admin = false
    const user = await client.users.findFirst({
      where: {
        id: String(id)
      },
      include: {
        roles: true
      }
    })

    console.log('SupaUser', user)

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
