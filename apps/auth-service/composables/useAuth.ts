import { z } from 'zod'

const passwordValidation = z
  .string()
  .min(8, 'Password must contain 6 characters')
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
  const authUrl = authURL
  const appUrl = `${appURL}/auth-callback`

  const logger = useLogger('auth')
  const toast = useNotification()
  const supabase = useSupabaseClient()

  const loading = useLoadingStore()

  // !todo:bug - I believe there is an issue where the token expires for Social login but it doesn't refresh
  // !todo:high - retrieve current user profile

  const userPasswordSettings = reactive({
    currentPassword: 'current password',
    newPassword: 'new password',
    confirmNewPassword: 'confirm new password',
  })

  interface RegisterWithEmail {
    email: string
    password: string
    confirmPassword: string
    given_name: string
    surname: string
  }

  const registerWithEmail = async (formData: {
    email: string
    password: string
    given_name: string
    surname: string
    turnstileToken?: string | null
    resetTurnstile?: () => void
  }) => {
    loading.setLoading('currentUser', true)
    // Proceed with registration
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        captchaToken: formData.turnstileToken,
        data: {
          given_name: formData.given_name,
          surname: formData.surname,
        },
      },
    })

    if (!data.user!.identities!.length) {
      toast.error({ summary: 'Registration Failure', message: 'User already exists' })
      if (formData.resetTurnstile) formData.resetTurnstile()
      loading.setLoading('currentUser', false)
      return
    }

    if (error) {
      toast.error({ summary: 'Registration Failure', message: error.message })
      if (formData.resetTurnstile) formData.resetTurnstile()
      loading.setLoading('currentUser', false)
      return
    }

    // Handle successful registration
    toast.success({ summary: 'Registeration Successful', message: 'Redirecting...' })
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
    // Proceed with login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: { captchaToken: options?.turnstileToken },
    })

    if (error) {
      toast.error({ summary: 'Authentication Failure', message: error.message })
      options?.resetTurnstile()
      loading.setLoading('currentUser', false)
      return
    }

    toast.success({ summary: 'Authenticated', message: 'Logging In...' })
    await new Promise((resolve) => setTimeout(resolve, 1000))
    loading.setLoading('currentUser', false)
    navigateTo(appURL, { external: true })
  }

  async function loginSocial(provider: 'linkedin_oidc' | 'twitter') {
    loading.setLoading('currentUser', true)
    const { data: user, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: appUrl,
      },
    })

    if (error?.message) {
      console.error({ message: error.message })
      toast.error({ summary: `${provider} login:`, message: error.message })
    }

    if (!user) {
      console.error({ message: 'Login failed' })
      toast.error({
        summary: 'Login failed',
        message: `there was an error logging in with ${provider}, no user returned`,
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
    // infra:critical:easy:1 - add correct redirect for userId/settings/password
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: encodeURIComponent(`${authUrl}/reset-password`),
      captchaToken: turnstileToken,
    })

    if (error) {
      console.error('Forgot password failed:', error)
      toast.error({ summary: 'Password Reset Failed', message: error.message })
      if (resetTurnstile) resetTurnstile()
    } else {
      toast.success({
        summary: 'Email Sent',
        message: 'Check your email for a password reset link',
      })
    }
    loading.setLoading('currentUser', false)
  }

  async function updatePassword(newPassword: string) {
    loading.setLoading('currentUser', true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })

    if (error) {
      console.error('Password update failed:', error)
      toast.error({ summary: 'Password Update Failed', message: error.message })
    } else {
      toast.success({ summary: 'Password Updated', message: 'Your password has been updated' })
    }
    loading.setLoading('currentUser', false)
  }

  async function logout() {
    loading.setLoading('currentUser', true)
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Logout failed:', error)
      toast.error({ summary: 'Logout Failed', message: error.message })
    } else {
      toast.success({ summary: 'You Logged Out', message: 'You have been logged out' })
      navigateTo(authURL, { external: true })
    }
    loading.setLoading('currentUser', false)
  }

  return {
    registerWithEmail,
    loginWithEmail,
    loginSocial,
    logout,
    password: {
      forgot: forgotPassword,
      update: updatePassword,
    },
  }
}
