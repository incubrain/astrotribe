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

const updateUserProfileSchema = userSchema.pick(pickUserProfile).transform((user) => ({
  ...user,
  dob: user.dob ? formatDob(user.dob) : undefined
}))

const userIdSchema = z.string().uuid()

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const validatedProfile = await validateBody(event, updateUserProfileSchema)


  console.log('have body', validatedProfile)
  // logic:med:med:2 - set the dataTypes and call correct function. eg. settings or profile
  // consider if this is worthwhile, or we should have individual endpoints per dataType

  console.log('set user')
  try {
    const userService = new UserService()
    const structuredProfile = userService.validateUser(validatedProfile)
    const user = await userService.userRepository.updateOne<'user_profiles'>({
      tableName: 'user_profiles',
      data: structuredProfile,
      isReturned: true,
      filterBy: {
        columnName: 'id',
        operator: 'eq',
        value: id
      }
    })

    if (!user || !user.id) {
      console.error('Error updating user')
      return {
        status: 404,
        message: 'No user returned',
        users: null
      }
    }

    return {
      status: 200,
      message: 'User fetched',
      user
    }
  } catch (error: any) {
    console.error('update user error', error.message)
    return {
      status: 500,
      message: error.message,
      user: null
    }
  }
})
