// composables/useAuth.ts
export async function forgotPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${authUrl}/reset-password`, // Public reset password page
  })
  if (error) {
    console.error('Forgot password failed:', error)
    toast.error({
      summary: 'Password Reset Failed',
      message: error.message,
    })
  } else {
    toast.success({ summary: 'EmailSent', message: 'Check your email for a password reset link' })
  }
}
