import { emailUnvalidatedUserSchema } from '@/types/auth'
// import users from '@/data/seed/manali-users.json'
import type { UserRowType } from '~/types/users'

interface NewUser {
  email: string
  password: string
}

export default function useAdmin() {
  const client = useSupabaseClient()
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
    const { data, error } = await client.from('users').select('*')
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
        await updateSingle(user, existingUser.id)
      }
    }
  }

  async function updateSingle(userData: UserRowType, userId: string) {
    try {
      const { data, error } = await client
        .from('users')
        .update({ given_name: userData.given_name, surname: userData.surname })
        .eq('id', userId)
        .select()

      console.log('data:', data)
      console.log('error:', error)

      if (error) {
        throw createError(`error updating users: ${error.value}`)
      }

      console.log(`User with email ${data.email} updated successfully`)
    } catch (error) {
      console.error(`Error updating user with email ${userData.email}:`, error)
    }
  }

  return {
    registerManyUsers,
    updateManyUsers,
    createdUsers
  }
}
