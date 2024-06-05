import { z } from 'zod'
import { userSchema } from '#imports'

const pickUserProfile = {
  id: true,
  email: true,
  username: true,
  given_name: true,
  surname: true,
  avatar: true,
  cover_image: true,
  introduction: true,
  quote: true,
  dob: true,
  last_seen: true,
  role: true
} as const

export const userProfileSchema = z.array(
  userSchema.pick(pickUserProfile).transform((user) => ({
    ...user,
    avatar: formatAvatarUrl(user),
    last_seen: user.last_seen ? datetimeOffset(user.last_seen) : undefined,
    role_icon: user.role ? roleIconMapping(user.role) : undefined,
    cover_image: formatCoverUrl(user),
    dob: user.dob ? formatDob(user.dob) : undefined
  }))
)

export default defineEventHandler(async (event) => {
  // todo:med:easy:1 - add isRaw to param for admin data, false for user facing data (parse this)
  try {
    const userRepository = new UserRepository()
    const users = await userRepository.selectMany<'user_profiles'>({
      tableName: 'user_profiles',
      selectStatement:
        'id, email, given_name, surname, username, dob, gender_id, created_at, last_seen, avatar, cover_image, plan, role',
      orderBy: {
        columnNames: ['given_name', 'surname'],
        ascending: false
      }
    })

    console.log('users/select/profiles data: ', users)

    if (!users) {
      console.error('No users found')
      return {
        statusCode: 404,
        message: 'No users found',
        data: null
      }
    }

    return {
      statusCode: 200,
      message: 'User fetched',
      data: users
    }
  } catch (error: any) {
    console.error('users/select/profile error', error.message)
    return {
      statusCode: 500,
      error,
      message: 'Error fetching user profiles',
      data: null
    }
  }
})
