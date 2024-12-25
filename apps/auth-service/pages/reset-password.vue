<!-- pages/reset-password.vue -->
<script setup lang="ts">
const route = useRoute()
const auth = useAuth()
const toast = useNotification()

const form = reactive({
  password: '',
  confirmPassword: '',
})

const turnstile = ref()
const turnstileValid = ref(false)
const turnstileToken = ref<string | null>(null)

const onValidTurnstile = (token: string) => {
  turnstileValid.value = true
  turnstileToken.value = token
}

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
  } catch (error: any) {
    toast.error({
      summary: 'Reset Failed',
      message: error.message,
    })
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (turnstileValid.value && event.key === 'Enter' && turnstileValid.value) {
    handlePasswordReset()
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
        @keydown="handleKeydown"
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
        <TurnstileChallenge
          ref="turnstile"
          class="mb-4"
          :on-valid-token="onValidTurnstile"
        />
        <PrimeButton
          :disabled="!turnstileValid"
          type="submit"
          class="w-full"
        >
          Reset Password
        </PrimeButton>
      </form>
    </template>
  </AuthCard>
</template>
