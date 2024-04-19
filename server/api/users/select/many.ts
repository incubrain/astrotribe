import { UserRepository } from '~/server/utils/user/user.repository'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  console.log('get users getQuery', query)

  try {
    const parsedQuery = handleQueryParams(query)

    const userRepository = new UserRepository()
    const users = await userRepository.selectUserCards(parsedQuery)

    console.log('user/many data: ', users)

    if (!users || !users.length) {
      console.error('No users found')
      return {
        status: 404,
        message: 'No users found',
        data: null
      }
    }

    return {
      status: 200,
      message: 'Users fetched successfully',
      data: userRepository.dto.validateAndFormatData({ data: users, dto: parsedQuery.dto })
    }
  } catch (error) {
    console.error('user-cards error', error)
    return {
      status: 401,
      message: 'user/many error',
      data: null
    }
  }
})
