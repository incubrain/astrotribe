export interface ResetPasswordParams {
  access_token?: string
  refresh_token?: string
  expires_in?: number
  token_type?: string
  type?: string
}

// composables/useResetPassword.ts
export function useResetPassword() {
  const supabase = useSupabaseClient()

  // Verify the reset token is valid
  async function verifyResetToken(hash: string): Promise<boolean> {
    try {
      const params = parseHashFragment(hash)
      // Verify token with Supabase
      const { error } = await supabase.auth.verifyOtp({
        token_hash: params.access_token,
        type: 'recovery',
      })
      return !error
    } catch {
      return false
    }
  }

  return {
    verifyResetToken,
  }
}
