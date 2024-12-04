import { z } from 'zod'
import { useLogger } from '@ib/logger'

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
  const { aeAuthUrl, aeAppUrl } = useRuntimeConfig().public
  const authUrl = aeAuthUrl
  const appUrl = `${aeAppUrl}/auth-callback`

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
  }) => {
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

    if (error) {
      toast.error({ summary: 'Registration Failure', message: error.message })
      return
    }

    // Handle successful registration
    toast.success({ summary: 'Registeration Successful', message: 'Redirecting...' })
    await new Promise((resolve) => setTimeout(resolve, 1000))
    navigateTo('/success')
  }

  const loginWithEmail = async (
    email: string,
    password: string,
    options?: { turnstileToken: string | null },
  ) => {
    // Proceed with login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: { captchaToken: options?.turnstileToken },
    })

    if (error) {
      toast.error({ summary: 'Authentication Failure', message: error.message })
      return
    }

    toast.success({ summary: 'Authenticated', message: 'Logging In...' })
    await new Promise((resolve) => setTimeout(resolve, 1000))
    navigateTo(aeAppUrl, { external: true })
  }

  async function loginSocial(provider: 'linkedin_oidc' | 'twitter') {
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
  }

  async function forgotPassword(email: string) {
    // infra:critical:easy:1 - add correct redirect for userId/settings/password
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${authUrl}settings/password`,
    })

    if (error) {
      console.error('Forgot password failed:', error)
      toast.error({ summary: 'Password Reset Failed', message: error.message })
    } else {
      toast.success({
        summary: 'Email Sent',
        message: 'Check your email for a password reset link',
      })
    }
  }

  async function updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({ password: newPassword })

    if (error) {
      console.error('Password update failed:', error)
      toast.error({ summary: 'Password Update Failed', message: error.message })
    } else {
      toast.success({ summary: 'Password Updated', message: 'Your password has been updated' })
    }
  }

  async function logout() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Logout failed:', error)
      toast.error({ summary: 'Logout Failed', message: error.message })
    } else {
      toast.success({ summary: 'You Logged Out', message: 'You have been logged out' })
      navigateTo(aeAuthUrl, { external: true })
    }
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
