<script setup lang="ts">
const form = reactive({
  email: '',
})

const auth = useAuth()
const isLoading = ref(false)
const isSuccess = ref(false)
const errorMessage = ref('')

const turnstile = ref()
const turnstileValid = ref(false)
const turnstileToken = ref<string | null>(null)

const onValidTurnstile = (token: string) => {
  turnstileValid.value = true
  turnstileToken.value = token
}

// Auto-focus the email input when component mounts
const emailInput = ref<HTMLElement | null>(null)
onMounted(() => {
  emailInput.value?.focus()
})

async function handleForgotPassword() {
  if (!turnstileValid.value) return

  isLoading.value = true
  errorMessage.value = ''
  isSuccess.value = false

  try {
    await auth.password.forgot(form.email, turnstileToken.value, turnstile.value?.reset)
    isSuccess.value = true
  } catch (error: any) {
    errorMessage.value = error.message || 'Failed to send reset link'
  } finally {
    isLoading.value = false
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (turnstileValid.value && event.key === 'Enter') {
    handleForgotPassword()
  }
}

definePageMeta({
  name: 'ForgotPassword',
})
</script>

<template>
  <AuthCard
    :title="{
      main: 'Reset Password',
      subtitle: 'Remember your password?',
      label: 'Sign in',
    }"
    help-url="/login"
  >
    <template #content>
      <form
        class="flex flex-col gap-4 w-full"
        @submit.prevent="handleForgotPassword"
        @keydown="handleKeydown"
      >
        <div class="flex flex-col gap-2">
          <label
            for="email"
            class="text-sm"
            >Email</label
          >
          <PrimeInputText
            id="email"
            ref="emailInput"
            v-model="form.email"
            :disabled="isLoading || isSuccess"
            autocomplete="email"
            class="w-full"
            placeholder="Enter your registered email"
          />
        </div>

        <TurnstileChallenge
          ref="turnstile"
          class="mb-4"
          :on-valid-token="onValidTurnstile"
        />

        <PrimeButton
          type="submit"
          class="justify-center"
          :disabled="!turnstileValid || isLoading || isSuccess"
          :loading="isLoading"
        >
          <template v-if="!isLoading">Send Reset Link</template>
          <template v-else>Sending...</template>
        </PrimeButton>

        <div
          v-if="isSuccess"
          class="mt-2"
        >
          <PrimeMessage
            severity="success"
            class="w-full"
          >
            <div class="flex flex-col gap-1">
              <p>Password reset link sent!</p>
              <p class="text-sm">Check your email inbox and spam folder.</p>
            </div>
          </PrimeMessage>
        </div>

        <PrimeMessage
          v-if="errorMessage"
          severity="error"
          class="w-full"
        >
          {{ errorMessage }}
        </PrimeMessage>
      </form>
    </template>

    <template #footer>
      <div class="flex flex-col items-center gap-4 mt-4">
        <p class="text-sm text-gray-400">
          Can't access your email? Please contact
          <a
            href="mailto:support@astronera.org"
            class="text-primary hover:underline"
            >support@astronera.org</a
          >
        </p>
      </div>
    </template>
  </AuthCard>
</template>
