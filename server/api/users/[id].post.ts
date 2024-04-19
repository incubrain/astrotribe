export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const { newData, dataType } = readBody(event)

  // logic:med:med:2 - set the dataTypes and call correct function. eg. settings or profile
  // consider if this is worthwhile, or we should have individual endpoints per dataType

  console.log('set user')
  try {
    const client = new UserRepository()
    const user = await client.updateUserProfile({
      data: newData,
      single: true,
      filter: {
        eq: {
          id
        }
      }
    })

    if (!user || !user.id) {
      console.error('No user found')
      return {
        status: 404,
        message: 'No user found',
        users: null
      }
    }

    return {
      status: 200,
      message: 'User fetched',
      user
    }
  } catch (error: any) {
    console.error('get-user-[id] error', error.message)
    return {
      status: 500,
      message: error.message,
      user: null
    }
  }
})
