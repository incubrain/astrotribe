export default defineEventHandler(async (event) => {
  console.log('login-with-[provider].post.ts')
  const { provider } = getRouterParams(event)
  console.log('provider', provider)
  const { email, password } = await readBody(event)
  console.log('email', email, 'password', password)

  if (!provider) {
    console.error('No login provider selected')
  }

  const supabase = await dbClient(event)

  try {
    let query

    if (provider === 'email') {
      // Handle login with email and password

      if (!email || !password) {
        throw createError({ message: 'Email and password are required' })
      }

      query = supabase.auth.signInWithPassword({ email, password })
    } else if (provider === 'google') {
      // Handle login with Google
      query = supabase.auth.signInWithOAuth({ provider: 'google' })
    } else if (provider === 'linkedin') {
      // Handle login with LinkedIn
      query = supabase.auth.signInWithOAuth({ provider: 'linkedin' })
    } else if (provider === 'twitter') {
      // Handle login with LinkedIn
      query = supabase.auth.signInWithOAuth({ provider: 'twitter' })
    } else {
      throw createError({ message: 'Invalid login provider' })
    }

    const { user, error } = await query

    if (error?.message) {
      throw createError({ message: error.message })
    }

    if (!user) {
      throw createError({ message: 'Login failed' })
    }

    return {
      status: 200,
      message: 'Login successful',
      user
    }
  } catch (error: any) {
    console.error('login error', error)
    return {
      status: 500,
      message: 'Error logging in',
      user: null,
      error
    }
  }
})
