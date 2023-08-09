import { userSchema, sessionSchema } from '@/types/auth'

export default defineEventHandler(async (event) => {
  const { _supabaseClient } = event.context
  // console.log("login client", _supabaseClient);
  const body = await readBody(event)
  let { email, password } = body
  const env = useRuntimeConfig()
  if (env.public.NODE_ENV === 'development') {
    email = String(env.TESTING_USERNAME)
    password = String(env.TESTING_PASSWORD)
  }
  console.log('login client', email, password)
  const { data, error } = await _supabaseClient.auth.signInWithPassword({
    email,
    password,
    options: {
      emailRedirectTo: 'http://localhost:3000/astrotribe'
    }
  })
  console.log('login Data', data, error)
  if (error) {
    throw createError({
      statusText: `Error logging in user: ${error}`,
      status: error.status
    })
  }

  const validatedUser = userSchema.safeParse(data.user)
  if (!validatedUser.success) {
    // Handle validation error
    throw createError(validatedUser.error)
  }

  const validatedSession = sessionSchema.safeParse(data.session)
  if (!validatedSession.success) {
    throw createError(validatedSession.error)
  }

  console.log('login client', data)
  return {
    status: 200,
    data: {
      user: validatedUser.data,
      session: validatedSession.data
    }
  }
})
