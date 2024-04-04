export default defineEventHandler(async (event) => {
  // auto-linking of profiles seems to happen automatically
  // worked with email first then linkedin social signin
  console.log('login-with-[provider].post.ts')
  const { provider } = getRouterParams(event)
  console.log('provider', provider)

  if (!provider) {
    console.error('No login provider selected')
  }

  const supabase = await dbClient(event)

  try {
    let query

    if (provider === 'email') {
      const { email, password } = await readBody(event)
      console.log('email', email, 'password', password)
      // Handle login with email and password
      if (!email || !password) {
        throw createError({ message: 'Email and password are required' })
      }

      query = supabase.auth.signInWithPassword({ email, password })
    } else if (provider === 'linkedin') {
      console.log('linkedin query')
      query = supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: { redirectTo: 'http://localhost:3000/astrotribe' }
      })

      // Linkedin returns this metadata:
      //   "iss": "https://www.linkedin.com",
      //   "sub": "hQfa_HISo7",
      //   "name": "full name",
      //   "email": "myemail@gmail.com",
      //   "locale": "en_US",
      //   "picture": "https://media.licdn.com/dms/image/D4D03AQE7S77JxVf6uQ/profile-displayphoto-shrink_100_100/0/1678109223064?e=2147483647&v=beta&t=btGs399dJp6PMGOAb8A2Q-yngrKo6mPQNLHRNSW_eMc",
      //   "given_name": "first",
      //   "family_name": "given",
      //   "provider_id": "hQfa_HISo7",
      //   "email_verified": true,
      //   "phone_verified": false
    } else if (provider === 'twitter') {
      query = supabase.auth.signInWithOAuth({ provider: 'twitter' })
    } else {
      throw createError({ message: 'Invalid login provider' })
    }

    const { data: user, error } = await query

    if (error?.message) {
      throw createError({ message: error.message })
    }

    if (!user) {
      throw createError({ message: 'Login failed' })
    }

    console.log('data response', error, user)

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
