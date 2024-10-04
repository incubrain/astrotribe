import { z } from 'zod'
import { useLogger } from '@ib/client'

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

export function useUserAuth() {
  const { aeAppUrl } = useRuntimeConfig().public
  const redirectUrl = aeAppUrl
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

  async function registerWithEmail({ email, password, given_name, surname }: RegisterWithEmail) {
    if (loading.isLoading('auth')) {
      return
    }

    loading.setLoading('auth', true)
    console.log('registerWithEmail', email, password, given_name, surname)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          given_name,
          surname,
        },
      },
    })

    if (error) {
      console.error(error.message)
      toast.error({ summary: 'Register with email', message: error.message })
    } else {
      console.log('success')
      navigateTo('/success')
    }
    loading.setLoading('auth', false)
  }

  async function loginWithEmail(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error(error.message)
      toast.error({ summary: 'Login with password', message: error.message })
    }
  }

  async function loginSocial(provider: 'linkedin_oidc' | 'twitter') {
    const { data: user, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectUrl,
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
      redirectTo: `${redirectUrl}/settings/password`,
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
      navigateTo(redirectUrl, { external: true })
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
