// composables/useSettingsSecurity.ts
export function useSettingsSecurity() {
  const supabase = useSupabaseClient()
  const toast = useNotification()

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

  async function linkIdentity(provider: 'twitter' | 'google' | 'facebook' | 'linkedin_oidc') {
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

  return {
    getLinkedIdentities,
    linkIdentity,
    unlinkIdentity,
    setPassword,
    setupTwoFactor,
    verifyTwoFactor,
  }
}
