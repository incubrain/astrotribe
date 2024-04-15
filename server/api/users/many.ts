import { UserRepository } from '~/server/utils/user/user.repository'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  console.log('get users getQuery', query)

  try {
    if (!Array.isArray(query.filters)) {
      console.log('is not array')
      query.filters = [JSON.parse(query.filters)]
    }

    if (query.pagination) {
      query.pagination = JSON.parse(query.pagination)
    }

    const user = new UserRepository()
    const users = await user.selectUserCards(query)

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
      data: users
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
