import { z } from 'zod'

const passwordValidation = z
  .string()
  .min(8, 'Password must contain 8 characters')
  .regex(/[A-Z]/, 'Password must contain an uppercase letter')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain a special character')

export const SettingsPasswordValidation = z
  .object({
    currentPassword: passwordValidation,
    newPassword: passwordValidation,
    confirmNewPassword: passwordValidation,
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ['confirmNewPassword'],
  })

export type SettingsPasswordType = z.infer<typeof SettingsPasswordValidation>

export function useAuth() {
  const { authURL, appURL } = useRuntimeConfig().public
  const appUrl = `${appURL}/auth-callback`

  const logger = useLogger('auth')
  const toast = useNotification()
  const supabase = useSupabaseClient()
  const loading = useLoadingStore()

  // Analytics tracking function
  const trackAuthEvent = (event: string, properties: Record<string, any> = {}) => {
    try {
      // Check if posthog is available
      if (window.posthog) {
        window.posthog.capture(event, properties)
      }
    } catch (error: any) {
      logger.error('Failed to track event', { event, error })
    }
  }

  // Send magic link for passwordless login
  async function sendMagicLink(
    email: string,
    turnstileToken: string | null = null,
    resetTurnstile: (() => void) | null = null,
  ) {
    loading.setLoading('currentUser', true)
    trackAuthEvent('magic_link_attempt', { email: email.toLowerCase() })

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.toLowerCase(),
        options: {
          emailRedirectTo: appUrl,
          captchaToken: turnstileToken,
        },
      })

      if (error) {
        logger.error('Magic link error:', error)
        toast.error({ summary: 'Magic Link Failed', message: error.message })
        trackAuthEvent('magic_link_error', {
          email: email.toLowerCase(),
          error: error.message,
        })
        if (resetTurnstile) resetTurnstile()
        throw error
      }

      toast.success({
        summary: 'Magic Link Sent',
        message: 'Check your email for a login link',
      })

      trackAuthEvent('magic_link_sent', { email: email.toLowerCase() })
    } finally {
      loading.setLoading('currentUser', false)
    }
  }

  const userPasswordSettings = reactive({
    currentPassword: 'current password',
    newPassword: 'new password',
    confirmNewPassword: 'confirm new password',
  })

  interface RegisterWithEmail {
    email: string
    password: string
    confirmPassword?: string
    given_name?: string
    surname?: string
  }

  const registerWithEmail = async (formData: {
    email: string
    password: string
    given_name?: string
    surname?: string
    turnstileToken?: string | null
    resetTurnstile?: () => void
  }) => {
    loading.setLoading('currentUser', true)
    trackAuthEvent('signup_attempt', { email: formData.email })

    // Proceed with registration
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        captchaToken: formData.turnstileToken,
        data: {
          given_name: formData.given_name || '',
          surname: formData.surname || '',
        },
      },
    })

    if (!data.user?.identities?.length) {
      toast.error({ summary: 'Registration Failure', message: 'User already exists' })
      if (formData.resetTurnstile) formData.resetTurnstile()
      trackAuthEvent('signup_error', {
        email: formData.email,
        error: 'User already exists',
      })
      loading.setLoading('currentUser', false)
      return
    }

    if (error) {
      toast.error({ summary: 'Registration Failure', message: error.message })
      if (formData.resetTurnstile) formData.resetTurnstile()
      trackAuthEvent('signup_error', {
        email: formData.email,
        error: error.message,
      })
      loading.setLoading('currentUser', false)
      return
    }

    // Handle successful registration
    toast.success({ summary: 'Registration Successful', message: 'Redirecting...' })
    trackAuthEvent('signup_success', { email: formData.email })
    await new Promise((resolve) => setTimeout(resolve, 1000))
    loading.setLoading('currentUser', false)
    navigateTo('/success')
  }

  const loginWithEmail = async (
    email: string,
    password: string,
    options?: {
      turnstileToken: string | null
      resetTurnstile: () => void
    },
  ) => {
    loading.setLoading('currentUser', true)
    trackAuthEvent('login_attempt', {
      email,
      method: 'password',
    })

    // Proceed with login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: { captchaToken: options?.turnstileToken },
    })

    if (error) {
      toast.error({ summary: 'Authentication Failure', message: error.message })
      options?.resetTurnstile()
      trackAuthEvent('login_error', {
        email,
        method: 'password',
        error: error.message,
      })
      loading.setLoading('currentUser', false)
      return
    }

    toast.success({ summary: 'Authenticated', message: 'Logging In...' })
    trackAuthEvent('login_success', {
      email,
      method: 'password',
    })
    await new Promise((resolve) => setTimeout(resolve, 1000))
    loading.setLoading('currentUser', false)
    navigateTo(appURL, { external: true })
  }

  async function loginSocial(provider: 'linkedin_oidc' | 'twitter' | 'google') {
    loading.setLoading('currentUser', true)
    trackAuthEvent('login_attempt', { method: provider })

    const { data: user, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: appUrl,
      },
    })

    if (error?.message) {
      console.error({ message: error.message })
      toast.error({ summary: `${provider} login:`, message: error.message })
      trackAuthEvent('login_error', {
        method: provider,
        error: error.message,
      })
    }

    if (!user) {
      console.error({ message: 'Login failed' })
      toast.error({
        summary: 'Login failed',
        message: `there was an error logging in with ${provider}, no user returned`,
      })
      trackAuthEvent('login_error', {
        method: provider,
        error: 'No user returned',
      })
    }

    loading.setLoading('currentUser', false)
  }

  async function forgotPassword(
    email: string,
    turnstileToken: string | null,
    resetTurnstile: (() => void) | null,
  ) {
    loading.setLoading('currentUser', true)
    trackAuthEvent('password_reset_request', { email })

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: encodeURIComponent(`${authURL}/reset-password`),
      captchaToken: turnstileToken,
    })

    if (error) {
      console.error('Forgot password failed:', error)
      toast.error({ summary: 'Password Reset Failed', message: error.message })
      trackAuthEvent('password_reset_error', {
        email,
        error: error.message,
      })
      if (resetTurnstile) resetTurnstile()
    } else {
      toast.success({
        summary: 'Email Sent',
        message: 'Check your email for a password reset link',
      })
      trackAuthEvent('password_reset_email_sent', { email })
    }
    loading.setLoading('currentUser', false)
  }

  async function updatePassword(newPassword: string) {
    loading.setLoading('currentUser', true)
    trackAuthEvent('password_update_attempt')

    const { error } = await supabase.auth.updateUser({ password: newPassword })

    if (error) {
      console.error('Password update failed:', error)
      toast.error({ summary: 'Password Update Failed', message: error.message })
      trackAuthEvent('password_update_error', { error: error.message })
    } else {
      toast.success({ summary: 'Password Updated', message: 'Your password has been updated' })
      trackAuthEvent('password_update_success')
    }
    loading.setLoading('currentUser', false)
  }

  async function logout() {
    loading.setLoading('currentUser', true)
    trackAuthEvent('logout_attempt')

    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Logout failed:', error)
      toast.error({ summary: 'Logout Failed', message: error.message })
      trackAuthEvent('logout_error', { error: error.message })
    } else {
      toast.success({ summary: 'You Logged Out', message: 'You have been logged out' })
      trackAuthEvent('logout_success')
      navigateTo(authURL, { external: true })
    }
    loading.setLoading('currentUser', false)
  }

  return {
    registerWithEmail,
    loginWithEmail,
    loginSocial,
    sendMagicLink,
    logout,
    password: {
      forgot: forgotPassword,
      update: updatePassword,
    },
  }
}
