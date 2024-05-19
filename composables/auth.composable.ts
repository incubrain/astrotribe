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
    confirmNewPassword: passwordValidation
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ['confirmNewPassword']
  })

export type SettingsPasswordType = z.infer<typeof SettingsPasswordValidation>

export function useAuth() {
  const redirectUrl = computed(() => `${window.location.origin}/astrotribe`)
  const logger = useLogger('auth')

  const loading = useLoadingStore()

  // !todo:bug - I believe there is an issue where the token expires for Social login but it doesn't refresh
  // !todo:high - retrieve current user profile

  const userPasswordSettings = reactive({
    currentPassword: 'current password',
    newPassword: 'new password',
    confirmNewPassword: 'confirm new password'
  })

  const toast = useToast()
  const supabase = useSupabaseClient()

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
          surname
        }
      }
    })

    if (error) {
      console.error(error.message)
      toast.add({ severity: 'error', summary: 'Register with email error', detail: error.message })
    } else {
      console.log('success')
      navigateTo('/auth/success')
    }
    loading.setLoading('auth', false)
  }

  async function loginWithEmail(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) {
      console.error(error.message)
      toast.add({ severity: 'error', summary: 'Login with password error', detail: error.message })
    }
  }

  async function loginSocial(provider: 'linkedin_oidc' | 'twitter') {
    console.log('redirect', redirectUrl.value)

    const { data: user, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: redirectUrl.value }
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
    // infra:critical:easy:1 - add correct redirect for userId/settings/password
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${redirectUrl.value}/settings/password`
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
