import { emailUnvalidatedUserSchema } from '@/types/auth'

interface Register {
  email: string
  password: string
}

export default defineEventHandler(async (event) => {
  const { _supabaseClient } = event.context
  const env = useRuntimeConfig()
  console.log('register')
  let { email, password }: Register = await readBody(event)
  if (env.public.NODE_ENV === 'development') {
    email = String(env.TESTING_USERNAME)
    password = String(env.TESTING_PASSWORD)
  }
  console.log('register', email, password)
  const { data, error } = await _supabaseClient.auth.signUp({
    email,
    password
  })
  if (error) {
    throw createError({
      statusCode: 401,
      message: error.message
    })
  }

  console.log('register data', data)

  const validatedUser = emailUnvalidatedUserSchema.safeParse(data.user)
  if (!validatedUser.success) {
    throw createError(validatedUser.error)
  }

  return {
    status: 200,
    data: {
      user: validatedUser.data
    }
  }
})
