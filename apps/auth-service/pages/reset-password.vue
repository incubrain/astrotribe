<!-- pages/reset-password.vue -->
<script setup lang="ts">
const route = useRoute()
const auth = useAuth()
const toast = useNotification()

const form = reactive({
  password: '',
  confirmPassword: '',
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
    :show-title="false"
    :title="{
      main: 'Reset Password',
      subtitle: 'Enter your new password below',
    }"
  >
    <template #content>
      <form
        class="space-y-4 w-100"
        @submit.prevent="handlePasswordReset"
      >
        <div class="flex flex-col gap-2">
          <label
            for="password"
            class="text-sm"
            >Password</label
          >
          <FormPassword
            id="password"
            v-model="form.password"
            :feedback="true"
            toggle-mask
            required
          />
        </div>
        <div class="flex flex-col gap-2">
          <label
            for="confirm-password"
            class="text-sm"
            >Confirm Password</label
          >
          <FormPassword
            id="confirm-password"
            v-model="form.confirmPassword"
            required
          />
        </div>
        <PrimeButton
          type="submit"
          class="w-full"
        >
          Reset Password
        </PrimeButton>
      </form>
    </template>
  </AuthCard>
</template>
