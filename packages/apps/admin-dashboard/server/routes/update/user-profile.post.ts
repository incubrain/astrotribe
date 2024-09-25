import type { UserRowType } from '~/types/users'

export default defineEventHandler(async (event) => {
  const { userId, profile }: { userId: string, profile: UserRowType } = await readBody(event)
  const client = await dbClient(event)

  // Function to insert users from JSON file
  try {
    if (profile.dob) {
      console.log('profile.dob:', profile.dob)
      profile.dob = new Date(profile.dob).toISOString()
    }

    if (!profile) {
      return {
        status: 400,
        message: 'No user profile provided',
      }
    }

    console.log(`attempting to update ${profile.given_name} with id ${userId}`)
    const { data, error } = await client
      .from('user_profiles')
      .update(profile)
      .eq('email', profile.email)
      .select()

    if (error) {
      throw createError({ message: `error updating users: ${error.message}` })
    }

    console.log(`User ${data.email} updated successfully`)

    return {
      status: 200,
      message: 'Users have been inserted successfully',
      data,
    }
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error)
    return {
      status: 500,
      message: 'Error updating user profile',
    }
  }
})
