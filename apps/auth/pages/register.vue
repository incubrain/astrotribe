<script setup lang="ts">
import { z } from 'zod'

const form = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
  acceptNewsletter: false,
})

const auth = useAuth()
const isLoading = ref(false)
const errorMessage = ref('')

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
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms & conditions' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

const validationErrors = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: '',
})

function validate() {
  // Reset errors
  Object.keys(validationErrors).forEach((key) => {
    validationErrors[key] = ''
  })

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

async function handleRegister() {
  if (!turnstileValid.value) return
  if (!validate()) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    await auth.registerWithEmail({
      email: form.email,
      password: form.password,
      turnstileToken: turnstileToken.value,
      resetTurnstile: turnstile.value?.reset,
    })
  } catch (error: any) {
    errorMessage.value = error.message || 'Registration failed'
  } finally {
    isLoading.value = false
  }
}

// Get focused input using directive
const vFocus = {
  mounted: (el) => {
    // Ensure the element is an input that can be focused
    if (el && typeof el.focus === 'function') {
      el.focus()
    }
  },
}

definePageMeta({
  name: 'Register',
})
</script>

<template>
  <AuthCard
    :title="{
      main: 'Create an Account',
      subtitle: 'Already have an account?',
      label: 'Login',
    }"
    help-url="/login"
  >
    <template #content>
      <div class="w-full">
        <!-- OAuth Providers (Google, Twitter, LinkedIn) -->
        <FormOAuthProviders layout="column" />

        <div class="my-4">
          <PrimeDivider
            layout="horizontal"
            class="flex justify-center items-center"
          >
            <p>Or sign up with email</p>
          </PrimeDivider>
        </div>

        <form
          id="signup-form"
          class="flex flex-col gap-4 w-full"
          autocomplete="off"
          @submit.prevent="handleRegister"
        >
          <div class="flex flex-col gap-1">
            <label
              for="email-register"
              class="text-sm"
              >Email</label
            >
            <PrimeInputText
              id="email-register"
              v-model="form.email"
              v-focus
              name="email"
              :disabled="isLoading"
              :class="{ 'p-invalid': validationErrors.email }"
              autocomplete="email"
              class="w-full"
              autofocus
            />
            <small
              v-if="validationErrors.email"
              class="text-red-500"
              >{{ validationErrors.email }}</small
            >
          </div>

          <div class="flex flex-col gap-1">
            <label
              for="password-register"
              class="text-sm"
              >Password</label
            >
            <PrimePassword
              id="password-register"
              v-model="form.password"
              name="new-password"
              :disabled="isLoading"
              :class="{ 'p-invalid': validationErrors.password }"
              :feedback="true"
              toggle-mask
              autocomplete="new-password"
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
              for="confirm-password"
              class="text-sm"
              >Confirm Password</label
            >
            <PrimePassword
              id="confirm-password"
              v-model="form.confirmPassword"
              name="confirm-password"
              :disabled="isLoading"
              :class="{ 'p-invalid': validationErrors.confirmPassword }"
              :feedback="false"
              toggle-mask
              autocomplete="new-password"
              class="w-full"
            />
            <small
              v-if="validationErrors.confirmPassword"
              class="text-red-500"
              >{{ validationErrors.confirmPassword }}</small
            >
          </div>

          <div class="flex flex-col gap-3 mt-2">
            <div class="flex items-start gap-2">
              <PrimeCheckbox
                id="accept-terms"
                v-model="form.acceptTerms"
                :binary="true"
                :disabled="isLoading"
                :class="{ 'p-invalid': validationErrors.acceptTerms }"
              />
              <label
                for="accept-terms"
                class="text-sm leading-tight"
              >
                I agree to the
                <a
                  href="#"
                  class="text-primary hover:underline"
                  >Terms of Service</a
                >
                and
                <a
                  href="#"
                  class="text-primary hover:underline"
                  >Privacy Policy</a
                >
              </label>
            </div>
            <small
              v-if="validationErrors.acceptTerms"
              class="text-red-500"
              >{{ validationErrors.acceptTerms }}</small
            >

            <div class="flex items-start gap-2">
              <PrimeCheckbox
                id="accept-newsletter"
                v-model="form.acceptNewsletter"
                :binary="true"
                :disabled="isLoading"
              />
              <label
                for="accept-newsletter"
                class="text-sm leading-tight"
              >
                I'd like to receive news, updates and offers about AstronEra
              </label>
            </div>
          </div>

          <TurnstileChallenge
            ref="turnstile"
            class="mb-4 mt-2"
            :on-valid-token="onValidTurnstile"
          />

          <PrimeButton
            type="submit"
            class="justify-center"
            :disabled="!turnstileValid || isLoading"
            :loading="isLoading"
          >
            <template v-if="!isLoading">Create Account</template>
            <template v-else>Creating Account...</template>
          </PrimeButton>

          <PrimeMessage
            v-if="errorMessage"
            severity="error"
            class="w-full"
          >
            {{ errorMessage }}
          </PrimeMessage>
        </form>
      </div>
    </template>
  </AuthCard>
</template>

<style scoped>
/* This helps the browser autofill styles to work properly */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  transition: background-color 5000s ease-in-out 0s;
}
</style>
