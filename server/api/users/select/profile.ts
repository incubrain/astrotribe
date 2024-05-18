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

export const userProfileSchema = userSchema.pick(pickUserProfile).transform((user) => ({
  ...user,
  avatar: formatAvatarUrl(user),
  last_seen: user.last_seen ? datetimeOffset(user.last_seen) : undefined,
  role_icon: user.role ? roleIconMapping(user.role) : undefined,
  cover_image: formatCoverUrl(user),
  dob: user.dob ? formatDob(user.dob) : undefined
}))

export default defineEventHandler(async (event) => {
  console.log('get user 1')
  const { userId } = getQuery(event)

  console.log('get user 2', userId)
  try {
    const userRepository = new UserRepository()
    const user = await userRepository.selectOne<'user_profiles'>({
      tableName: 'user_profiles',
      selectStatement: '*',
      isSingle: true,
      filterBy: {
        columnName: 'id',
        operator: 'eq',
        value: String(userId)
      }
    })

    console.log('users/select/profile-[id] data: ', user)

    if (!user) {
      console.error('No user found')
      return {
        status: 404,
        message: 'No user found',
        data: null
      }
    }

    console.log('parsing data: ', user)
    const parsedData = userProfileSchema.parse(user)

    return {
      status: 200,
      message: 'User fetched',
      data: parsedData
    }
  } catch (error: any) {
    console.error('users/select/profile-[id] error', error.message)
    return {
      status: 500,
      error,
      message: 'Error fetching user profile',
      data: null
    }
  }
})
