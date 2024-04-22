export default defineEventHandler(async (event) => {
  const { userId } = getQuery(event)

  console.log('get user', userId)
  try {
    const userRepository = new UserRepository()
    const user = await userRepository.selectOne<'user_profiles'>({
      tableName: 'user_profiles',
      selectStatement: '*, roles(*)',
      filterBy: {
        columnName: 'id',
        operator: 'eq',
        value: String(userId)
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
      data: userRepository.dto.validateAndFormatData({ dto: 'select:user:profile', data: user })
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
