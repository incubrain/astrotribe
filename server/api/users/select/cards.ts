import { formatAvatarUrl, datetimeOffset, roleIconMapping } from '#imports'
import { z } from 'zod'

const pickUserCard = {
  id: true,
  username: true,
  given_name: true,
  surname: true,
  avatar: true,
  last_seen: true,
  introduction: true,
  role: true
} as const

const userCardSchema = z.array(
  userSchema.pick(pickUserCard).transform((user) => ({
    ...user,
    avatar: user.avatar ? formatAvatarUrl(user) : undefined,
    last_seen: user.last_seen ? datetimeOffset(user.last_seen) : undefined,
    roleIcon: user.role ? roleIconMapping(user.role) : undefined
  }))
)

type UserCardType = z.output<typeof userCardSchema> & {
  avatar: string
  last_seen: string | null
  roleIcon: string
}

export default defineEventHandler({
  onRequest: [],
  onBeforeResponse: [],
  handler: async (event) => {
    const query = getQuery(event)

    if (!query) {
      return {
        statusCode: 400,
        error: {
          message: 'query is required'
        }
      }
    }

    try {
      const parsedQuery = handleQueryParams(query)

      const userRepository = new UserRepository()
      const users = await userRepository.selectMany<'user_profiles'>({
        tableName: 'user_profiles',
        selectStatement: '*',
        filterBy: parsedQuery.filterBy,
        pagination: parsedQuery.pagination
      })

      console.log('have users', users)

      return {
        error: null,
        statusCode: 200,
        message: 'user cards retrieved from database',
        data: userCardSchema.parse(users)
      }
    } catch (error) {
      console.log('error', error)
      return {
        data: null,
        error,
        statusMessage: 'error fetching user cards',
        statusCode: 500
      }
    }
  }
})
