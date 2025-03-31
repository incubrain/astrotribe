<script setup lang="ts">
import { z } from 'zod'

const form = reactive({
  password: '',
  confirmPassword: '',
})

const auth = useAuth()
const isLoading = ref(false)
const isSuccess = ref(false)
const errorMessage = ref('')
const isTokenInvalid = ref(false)

const turnstile = ref()
const turnstileValid = ref(false)
const turnstileToken = ref<string | null>(null)

const onValidTurnstile = (token: string) => {
  turnstileValid.value = true
  turnstileToken.value = token
}

// Validation
const schema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

const validationErrors = reactive({
  password: '',
  confirmPassword: '',
})

function validate() {
  // Reset errors
  validationErrors.password = ''
  validationErrors.confirmPassword = ''

  try {
    schema.parse(form)
    return true
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        const path = err.path[0] as string
        validationErrors[path] = err.message
      })
    }
    return false
  }
}

async function handlePasswordReset() {
  if (!turnstileValid.value) return
  if (!validate()) return

  isLoading.value = true
  errorMessage.value = ''
  isSuccess.value = false

  try {
    // Update password
    await auth.password.update(form.password)

    // Show success message
    isSuccess.value = true

    // Redirect after a delay
    setTimeout(() => {
      navigateTo('/login', {
        query: {
          message: 'Password reset successful. Please log in with your new password.',
        },
      })
    }, 3000)
  } catch (error: any) {
    errorMessage.value = error.message || 'Password reset failed'
  } finally {
    isLoading.value = false
  }
}

// Verify token on mount
onMounted(async () => {
  const route = useRoute()
  const resetToken = route.hash // The token is in the URL hash

  if (!resetToken) {
    isTokenInvalid.value = true
    errorMessage.value = 'No reset token found'
    return
  }

  // Focus password field after validation
  const passwordInput = document.getElementById('password')
  if (passwordInput) {
    passwordInput.focus()
  }
})

definePageMeta({
  name: 'ResetPassword',
})
</script>

<template>
  <AuthCard
    :title="{
      main: 'Create New Password',
      subtitle: 'Enter a new secure password for your account',
    }"
  >
    <template #content>
      <div
        v-if="isTokenInvalid"
        class="w-full text-center"
      >
        <PrimeMessage
          severity="error"
          class="w-full mb-4"
        >
          <div class="flex flex-col gap-1">
            <p>Invalid or expired password reset link.</p>
            <p class="text-sm">Please request a new password reset.</p>
          </div>
        </PrimeMessage>

        <PrimeButton
          label="Request New Link"
          class="w-full mt-4"
          @click="navigateTo('/forgot-password')"
        />
      </div>

      <form
        v-else
        class="flex flex-col gap-4 w-full"
        @submit.prevent="handlePasswordReset"
      >
        <div class="flex flex-col gap-1">
          <label
            for="password"
            class="text-sm"
            >New Password</label
          >
          <PrimePassword
            id="password"
            v-model="form.password"
            :disabled="isLoading || isSuccess"
            :class="{ 'p-invalid': validationErrors.password }"
            :feedback="true"
            toggle-mask
            class="w-full"
          />
          <small
            v-if="validationErrors.password"
            class="text-red-500"
            >{{ validationErrors.password }}</small
          >
        </div>

        <div class="flex flex-col gap-1">
          <label
            for="confirmPassword"
            class="text-sm"
            >Confirm Password</label
          >
          <PrimePassword
            id="confirmPassword"
            v-model="form.confirmPassword"
            :disabled="isLoading || isSuccess"
            :class="{ 'p-invalid': validationErrors.confirmPassword }"
            :feedback="false"
            toggle-mask
            class="w-full"
          />
          <small
            v-if="validationErrors.confirmPassword"
            class="text-red-500"
            >{{ validationErrors.confirmPassword }}</small
          >
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
          <template v-if="!isLoading">Reset Password</template>
          <template v-else>Resetting...</template>
        </PrimeButton>

        <PrimeMessage
          v-if="isSuccess"
          severity="success"
          class="w-full"
        >
          <div class="flex flex-col gap-1">
            <p>Password successfully reset!</p>
            <p class="text-sm">Redirecting to login page...</p>
          </div>
        </PrimeMessage>

        <PrimeMessage
          v-if="errorMessage"
          severity="error"
          class="w-full"
        >
          {{ errorMessage }}
        </PrimeMessage>
      </form>
    </template>
  </AuthCard>
</template>
