const redirectUrl = 'http://localhost:3000/astrotribe'

export function useAuth() {
  const baseUrl = computed(() => window.location.origin ?? null)
  const toast = useToast()
  const supabase = useSupabaseClient()

  const isLoggedIn = computed(() => !!useSupabaseSession() || !!useSupabaseUser())

  async function registerWithEmail(email: string, password: string) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    })

    if (error) {
      console.error(error.message)
      toast.add({ severity: 'error', summary: 'Register with email error', detail: error.message })
    }
  }

  async function loginWithEmail(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error(error.message)
      toast.add({ severity: 'error', summary: 'Login with password error', detail: error.message })
    }
  }

  async function loginSocial(provider: 'linkedin_oidc' | 'twitter') {
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

    const { data: user, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: 'http://localhost:3000/astrotribe' }
    })

    if (error?.message) {
      console.error({ message: error.message })
      toast.add({ severity: 'error', summary: `${provider} login error:`, detail: error.message })
    }

    if (!user) {
      console.error({ message: 'Login failed' })
      toast.add({ severity: 'error', summary: `Login with ${provider} failed` })
    }
  }

  async function forgotPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${baseUrl.value}/auth/update-password`
    })

    if (error) {
      console.error('Forgot password failed:', error)
      toast.add({ severity: 'error', summary: 'Forgot password failed', detail: error.message })
    } else {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Check your email for a password reset link'
      })
    }
  }

  async function updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({ password: newPassword })

    if (error) {
      console.error('Password update failed:', error)
      toast.add({ severity: 'error', summary: 'Password update failed', detail: error.message })
    } else {
      toast.add({ severity: 'success', summary: 'Password update successful' })
    }
  }

  async function logout() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Logout failed:', error)
      toast.add({ severity: 'error', summary: 'Logout failed', detail: error.message })
    } else {
      toast.add({ severity: 'success', summary: 'Logout successful' })
      navigateTo('/')
    }
  }

  return {
    isLoggedIn,
    registerWithEmail,
    loginWithEmail,
    loginSocial,
    logout,
    password: {
      forgot: forgotPassword,
      update: updatePassword
    }
  }
}
