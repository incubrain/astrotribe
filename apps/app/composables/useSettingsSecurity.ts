// composables/useSettingsSecurity.ts
export function useSettingsSecurity() {
  const supabase = useSupabaseClient()
  const currentUser = useCurrentUser()
  const toast = useNotification()

  interface TurnstileOptions {
    token: string
    reset: () => void
  }

  // Linked Identities
  async function getLinkedIdentities() {
    const { data, error } = await supabase.auth.getUserIdentities()
    if (error) {
      toast.error({
        summary: 'Error',
        message: 'Could not fetch linked accounts',
      })
      return []
    }
    return data?.identities || []
  }

  async function linkIdentity(
    provider: 'email' | 'twitter' | 'google' | 'facebook' | 'linkedin_oidc',
  ) {
    const { data, error } = await supabase.auth.linkIdentity({ provider })
    if (error) {
      toast.error({
        summary: 'Error',
        message: 'Could not link account',
      })
    }
    return { data, error }
  }

  async function unlinkIdentity(identity: any) {
    const { data, error } = await supabase.auth.unlinkIdentity(identity)
    if (error) {
      toast.error({
        summary: 'Error',
        message: 'Could not unlink account',
      })
    }
    return { data, error }
  }

  // Password Management
  async function setPassword(password: string) {
    const { error } = await supabase.auth.updateUser({ password })

    await linkIdentity('email')
    if (error) {
      toast.error({
        summary: 'Error',
        message: 'Could not set password',
      })
      return false
    }
    return true
  }

  // 2FA Management
  async function setupTwoFactor() {
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
    })
    if (error) {
      toast.error({
        summary: 'Error',
        message: 'Could not setup 2FA',
      })
      return null
    }
    return data
  }

  async function verifyTwoFactor(code: string, factorId: string) {
    const { data, error } = await supabase.auth.mfa.challenge({
      factorId,
      code,
    })
    if (error) {
      toast.error({
        summary: 'Error',
        message: 'Invalid verification code',
      })
      return false
    }
    return true
  }

  async function verifyLogin(options: TurnstileOptions, password?: string) {
    if (!password) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: currentUser.profile.providers[0],
        options: { skipBrowserRedirect: true, catpchaToken: options.token },
      })

      return error
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: currentUser.profile.email,
        password,
        options: { captchaToken: options.token },
      })

      return error
    }
  }

  async function deleteAccount(options: TurnstileOptions, password?: string) {
    const error = await verifyLogin(options, password)
    const { authURL } = useRuntimeConfig().public

    if (error) {
      toast.error({ summary: 'Deletion Failed', message: error.message })
      options.reset()
      return
    }

    const { error: deleteError } = await supabase.rpc('delete_user', {
      user_id: currentUser.profile.id,
    })

    if (deleteError) {
      toast.error({ summary: 'Deletion Failed', message: deleteError.message })
      options.reset()
      return
    }

    toast.success({ summary: 'Account Deleted', message: 'Redirecting...' })
    await supabase.auth.signOut()

    setTimeout(() => navigateTo(authURL, { external: true }), 1000)
  }

  return {
    getLinkedIdentities,
    linkIdentity,
    unlinkIdentity,
    deleteAccount,
    setPassword,
    setupTwoFactor,
    verifyTwoFactor,
  }
}
