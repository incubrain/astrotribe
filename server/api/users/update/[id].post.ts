import { z } from 'zod'
import { userSchema } from '#imports'

const pickUserProfile = {
  id: true,
  username: true,
  given_name: true,
  surname: true,
  introduction: true,
  quote: true,
  dob: true
} as const

const cleanObject = (obj) => {
  Object.keys(obj).forEach((key) => obj[key] === undefined && delete obj[key])
  return obj
}
const updateUserProfileSchema = userSchema
  .partial()
  .transform((user) => ({
    ...user,
    dob: user.dob ? formatDob(user.dob) : undefined
  }))
  .transform(cleanObject)

const userIdSchema = z.string().uuid()

export default defineEventHandler(async (event) => {
  console.log('update user endpoint fired')
  const { id } = getRouterParams(event)
  // , updateUserProfileSchema.safeParse
  const data = await readBody(event)

  console.log('have body', data)
  // logic:med:med:2 - set the dataTypes and call correct function. eg. settings or profile
  // consider if this is worthwhile, or we should have individual endpoints per dataType

  try {
    const userService = new UserService()
    const structuredProfile = userService.validateUser(data)
    const parsedUser = updateUserProfileSchema.parse(structuredProfile)
    console.log('update user', parsedUser)

    const user = await userService.userRepository.updateOne<'user_profiles'>({
      tableName: 'user_profiles',
      data: parsedUser,
      isReturned: true,
      filterBy: {
        columnName: 'id',
        operator: 'eq',
        value: id
      }
    })

    if (!user || !user.length) {
      const message =
        ' ERROR: User may have been updated, but was not returned, try refreshing your browser'
      console.error(message)
      return {
        error: message,
        status: 404,
        message: message,
        data: null
      }
    }

    return {
      error: null,
      data:  user,
      status: 200,
      message: 'User fetched'
    }
  } catch (error: any) {
    console.error('update user error', error.message)
    return {
      error,
      data: null,
      status: 500,
      message: error.message
    }
  }
})
