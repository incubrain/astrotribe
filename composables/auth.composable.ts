import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

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

export const FormPasswordSchema = toTypedSchema(SettingsPasswordValidation)

const redirectUrl = computed(() => `${window.location.origin}/astrotribe`)

export function useAuth() {
  // !todo:bug - I believe there is an issue where the token expires for Social login but it doesn't refresh
  // !todo:high - look into cookieOptions
  // !todo:high - retrieve current user profile
  // cookieOptions: {
  //   maxAge: 60 * 60 * 8,
  //   sameSite: 'lax',
  //   secure: true
  // }
  // https://nuxt.com/docs/api/composables/use-cookie#options
  // https://supabase.com/docs/reference/javascript/initializing

  const userPasswordSettings = reactive({
    currentPassword: 'current password',
    newPassword: 'new password',
    confirmNewPassword: 'confirm new password'
  })

  const baseUrl = computed(() => window.location.origin ?? null)
  const toast = useToast()
  const supabase = useSupabaseClient()

  const isLoggedIn = computed(() => !!useSupabaseSession() || !!useSupabaseUser())

  async function registerWithEmail(email: string, password: string) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl.value
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
