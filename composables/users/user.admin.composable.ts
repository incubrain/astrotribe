import { emailUnvalidatedUserSchema } from '@/types/auth'
import type { UserRowType } from '~/types/users'

interface NewUser {
  email: string
  password: string
}

const DOMAIN_KEY = 'useAdmin'

export function useAdmin() {
  const errors = useBaseError()
  const log = useLogger(DOMAIN_KEY)
  const utils = useUtils()
  const client = useSupabaseClient()
  const toast = useNotification()
  const createdUsers = ref([] as NewUser[])

  const register = async ({ email, password }: { email: string; password: string }) => {
    const { data, error } = await client.auth.signUp({
      email,
      password
    })
    if (error) {
      throw createError({
        statusCode: 401,
        message: error.message
      })
    }

    const validatedUser = emailUnvalidatedUserSchema.safeParse(data.user)

    if (!validatedUser.success) {
      throw createError(validatedUser.error)
    }

    return validatedUser.data
  }

  async function addProfilePicture(userId: string, file: File) {
    try {
      const { data, error } = await client.storage
        .from('profile-public')
        .upload(`${userId}/avatar/${file.name}`, file)
      if (error) {
        throw createError(
          `Error uploading profile picture for user with ID ${userId}: ${error.message}`
        )
      }
      console.log(`Profile picture uploaded successfully for user with ID ${userId}`)
    } catch (error) {
      console.error(`Error uploading profile picture for user with ID ${userId}:`, error)
    }
  }

  async function addCoverPicture(userId: string, file: File) {
    try {
      const { data, error } = await client.storage
        .from('profile-public')
        .upload(`${userId}/cover/${file.name}`, file)
      if (error) {
        throw createError(
          `Error uploading cover picture for user with ID ${userId}: ${error.message}`
        )
      }
      console.log(`cover picture uploaded successfully for user with ID ${userId}`)
    } catch (error) {
      console.error(`Error uploading cover picture for user with ID ${userId}:`, error)
    }
  }

  async function registerManyUsers() {
    const users: UserRowType[] = []
    for (const user of users) {
      // Extract the given name and surname
      const givenName = user.given_name.charAt(0).toUpperCase() + user.given_name.slice(1)
      const surname = user.surname.charAt(0).toUpperCase() + user.surname.slice(1)

      // Construct the password
      const password = `${givenName}${surname}12345$`

      // Register the user
      try {
        // const newUser = await register({ email: user.email, password })
        // we handle user profile creation with a database trigger
        // now seed the database with the user data
        // createdUsers.value.push({ email: user.email, password })

        // Locate the profile image file based on the user's given name and surname
        const imageName = `${givenName.toLowerCase()}-${surname.toLowerCase()}.jpg`
        const imagePath = `/data/seed/avatars/${imageName}` // Adjust the path as necessary
        const imageFile = new File([await fetch(imagePath).then((r) => r.blob())], imageName, {
          type: 'image/jpeg'
        })

        console.log('file exists', imageFile.size)
        // Upload the profile image
        await addProfilePicture(newUser.id, imageFile)

        // update user profile with data
        await updateSingle(user, newUser.id)
      } catch (error) {
        console.error(`Failed to register user with email ${user.email}:`, error)
      }
    }
  }

  async function updateManyUsers() {
    // first fetch all users from the database
    const { data, error } = await client.from('user_profiles').select('*')
    if (error) {
      throw createError(`error fetching users: ${error.message}`)
    }

    console.log('users fetched:', data)

    // then we should match the emails to the users json file and update the user profiles
    for (const user of users) {
      const existingUser = data.find((u) => u.email === user.email)
      if (!existingUser) {
        console.error(`User with email ${user.email} not found`)
        continue
      } else {
        // update the user profile
        console.log('updating user:', user)
        await updateUser(user, existingUser.id)
      }
    }
  }

  async function updateUser(newData: any, oldData: any) {
    log.info(`Updating user with email ${newData.email}`)
    // we should first parse the data to check if anything has changed and then filter out any undefined values
    try {
      const { noDataUpdated, data: updatedData } = utils.wasRowDataUpdated(newData, oldData)

      if (noDataUpdated) {
        log.info('No changes detected, no update necessary')
        return
      }

      const response = await $fetch('/api/admin/users/update', {
        method: 'POST',
        body: {
          data: updatedData,
          id: newData.id
        }
      })

      console.log('data:', response)

      const data = errors.server({
        response,
        devOnly: false,
        showSuccess: true,
        devMessage: `Error updating user with email ${newData.email}`,
        userMessage: `There was an error updating user with email ${newData.email}`
      })

      log.info(`User with email ${data.email} updated successfully`)
      toast.success({
        summary: 'Success',
        message: `User with email ${data.email} updated successfully`
      })

      // maybe update state here
    } catch (error) {
      errors.client({
        error,
        devOnly: false,
        devMessage: `Error updating user with email ${newData.email}`,
        userMessage: `There was an error updating user with email ${newData.email}`
      })
    }
  }

  return {
    registerManyUsers,
    updateManyUsers,
    updateUser,
    createdUsers
  }
}
