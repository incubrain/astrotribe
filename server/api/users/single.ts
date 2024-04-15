export default defineEventHandler(async (event) => {
  const { userId } = getQuery(event)

  console.log('get user', userId)
  try {
    const client = new UserRepository()
    const user = await client.selectUserProfile({
      dto: 'select:user:profile',
      criteria: {
        single: true,
        filters: [
          {
            type: 'eq',
            field: 'id',
            value: String(userId)
          }
        ]
      }
    })

    console.log('users/[id] data: ', user)

    if (!user) {
      console.error('No user found')
      return {
        status: 404,
        message: 'No user found',
        data: null
      }
    }

    return {
      status: 200,
      message: 'User fetched',
      data: user
    }
  } catch (error: any) {
    console.error('get-user-[id] error', error.message)
    return {
      status: 500,
      message: error.message,
      data: null
    }
  }
})
