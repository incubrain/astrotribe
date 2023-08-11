import { SupabaseClient } from '@supabase/supabase-js'
import { emailUnvalidatedUserSchema } from '@/types/auth'
import users from '@/private-data/users.json'

interface User {
  email: string
  password: string
}

export default function useAdmin() {
  const client: SupabaseClient = useNuxtApp().$supabase.client
  const createdUsers = ref([] as User[])

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
        await register({ email: user.email, password })
        createdUsers.value.push({ email: user.email, password })
      } catch (error) {
        console.error(`Failed to register user with email ${user.email}:`, error)
      }
    }
  }

  return {
    registerManyUsers,
    createdUsers
  }
}
