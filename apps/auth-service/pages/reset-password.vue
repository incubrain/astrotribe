 <!-- pages/reset-password.vue -->
<script setup lang="ts">
const route = useRoute()
const auth = useUserAuth()
const toast = useNotification()

const form = reactive({
  password: '',
  confirmPassword: '',
})

// Get the hash fragment from the URL (Supabase includes the token here)
const hash = route.hash

onMounted(() => {
  // Verify the hash exists
  if (!hash) {
    toast.error({
      summary: 'Invalid Reset Link',
      message: 'This password reset link is invalid or has expired',
    })
    return
  }
})

async function handlePasswordReset() {
  if (form.password !== form.confirmPassword) {
    toast.error({
      summary: 'Passwords Do Not Match',
      message: 'Please ensure both passwords are identical',
    })
    return
  }

  try {
    // Update the password
    await auth.password.update(form.password)

    // Redirect to login
    navigateTo('/login', {
      replace: true,
      query: {
        message: 'Password successfully reset. Please log in with your new password.',
      },
    })
  } catch (error) {
    toast.error({
      summary: 'Reset Failed',
      message: 'Unable to reset password. Please try again.',
    })
  }
}
</script>

<template>
  <AuthCard
    title="Reset Password"
    subtitle="Enter your new password below"
  >
    <form @submit.prevent="handlePasswordReset">
      <div class="space-y-4">
        <PrimeFloatLabel>
          <PrimePassword
            v-model="form.password"
            :feedback="true"
            required
          />
          <label>New Password</label>
        </PrimeFloatLabel>

        <PrimeFloatLabel>
          <PrimePassword
            v-model="form.confirmPassword"
            required
          />
          <label>Confirm Password</label>
        </PrimeFloatLabel>

        <PrimeButton
          type="submit"
          class="w-full"
        >
          Reset Password
        </PrimeButton>
      </div>
    </form>
  </AuthCard>
</template>
