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

  async function registerWithEmail(email: string, password: string) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl.value
      }
    })

    // https://www.linkedin.com/uas/login?session_redirect=%2Foauth%2Fv2%2Flogin-success%3Fapp_id%3D219179818%26auth_type%3DAC%26flow%3D%257B%2522state%2522%253A%2522eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTM1NDYzNTgsInNpdGVfdXJsIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwiaWQiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAiLCJmdW5jdGlvbl9ob29rcyI6bnVsbCwicHJvdmlkZXIiOiJsaW5rZWRpbl9vaWRjIiwicmVmZXJyZXIiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAvYXN0cm90cmliZSIsImZsb3dfc3RhdGVfaWQiOiJmMjFlYzM3NS0zZDRlLTQ4MjQtYjY2Ny0yZDY1YjYzNGZlYTMifQ.gfYgjuPrCu6JUR3qAvx8dhlXm3q-9Agd4rzkRXXrOpg%2522%252C%2522scope%2522%253A%2522openid%2Bemail%2Bprofile%2522%252C%2522appId%2522%253A219179818%252C%2522authorizationType%2522%253A%2522OAUTH2_AUTHORIZATION_CODE%2522%252C%2522authFlowName%2522%253A%2522generic-permission-list%2522%252C%2522currentSubStage%2522%253A0%252C%2522creationTime%2522%253A1713546062257%252C%2522redirectUri%2522%253A%2522http%253A%252F%252Flocalhost%253A54321%252Fauth%252Fv1%252Fcallback%2522%252C%2522currentStage%2522%253A%2522LOGIN_SUCCESS%2522%257D&fromSignIn=1&trk=oauth&cancel_redirect=%2Foauth%2Fv2%2Flogin-cancel%3Fapp_id%3D219179818%26auth_type%3DAC%26flow%3D%257B%2522state%2522%253A%2522eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTM1NDYzNTgsInNpdGVfdXJsIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwiaWQiOiIwMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDAiLCJmdW5jdGlvbl9ob29rcyI6bnVsbCwicHJvdmlkZXIiOiJsaW5rZWRpbl9vaWRjIiwicmVmZXJyZXIiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAvYXN0cm90cmliZSIsImZsb3dfc3RhdGVfaWQiOiJmMjFlYzM3NS0zZDRlLTQ4MjQtYjY2Ny0yZDY1YjYzNGZlYTMifQ.gfYgjuPrCu6JUR3qAvx8dhlXm3q-9Agd4rzkRXXrOpg%2522%252C%2522scope%2522%253A%2522openid%2Bemail%2Bprofile%2522%252C%2522appId%2522%253A219179818%252C%2522authorizationType%2522%253A%2522OAUTH2_AUTHORIZATION_CODE%2522%252C%2522authFlowName%2522%253A%2522generic-permission-list%2522%252C%2522currentSubStage%2522%253A0%252C%2522creationTime%2522%253A1713546062257%252C%2522redirectUri%2522%253A%2522http%253A%252F%252Flocalhost%253A54321%252Fauth%252Fv1%252Fcallback%2522%252C%2522currentStage%2522%253A%2522LOGIN_SUCCESS%2522%257D

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
    // infra:critical:easy:1 - add correct redirect for userId/settings/password
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
