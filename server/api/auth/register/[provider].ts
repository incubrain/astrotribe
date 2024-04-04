export default defineEventHandler(async (event) => {
  console.log('register-with-[provider].post.ts')
  // !todo: handle already registered email
  //
  const { provider } = getRouterParams(event)
  console.log('provider', provider)
  const { email, password, redirectUrl } = await readBody(event)
  console.log('email', email, 'password', password)

  if (!provider) {
    console.error('No register provider selected')
  }

  const supabase = await dbClient(event)

  try {
    let query

    if (provider === 'email') {
      // !todo: add redirect to supabase dashboard
      // When the user confirms their email address,
      // they are redirected to the SITE_URL by default. You can modify your SITE_URL or add additional redirect URLs in

      if (!email || !password) {
        throw createError({ message: 'Email and password are required' })
      }

      query = supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      })
    } else if (provider === 'linkedin') {
      // info https://supabase.com/docs/guides/auth/social-login/auth-linkedin
      // !todo create in linkedin developer dashboard: https://www.linkedin.com/developers/apps
      // Add your LinkedIn (OIDC) client_id and client_secret to your Supabase dashboard: https://supabase.com/dashboard
      // Add login code to env file

      query = supabase.auth.signInWithOAuth({ provider: 'linkedin_oidc' })
    } else if (provider === 'twitter') {
      // info https://supabase.com/docs/guides/auth/social-login/auth-twitter
      // !todo: create in twitter developer dashboard: https://developer.twitter.com/en/portal/dashboard
      // add info to supabase dashboard: https://supabase.com/dashboard
      // add login code to env file
      query = supabase.auth.signInWithOAuth({ provider: 'twitter' })
    } else {
      throw createError({ message: 'Invalid register provider' })
    }

    const { data: user, error } = await query

    if (error?.message) {
      throw createError({ message: error.message })
    }

    if (!user) {
      throw createError({ message: 'Register failed' })
    }

    return {
      status: 200,
      message: 'Register successful',
      user,
      error: null
    }
  } catch (error: any) {
    console.error('register error', error)
    return {
      status: 500,
      message: 'Error registering',
      user: null,
      error
    }
  }
})
