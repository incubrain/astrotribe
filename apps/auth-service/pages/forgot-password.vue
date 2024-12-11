<!-- /forgot-password -->

<script setup lang="ts">
// If you use PKCE (default), this link only works on the device or browser where the original reset request was made. Display a message to the user to make sure they don't change devices or browsers.
const turnstile = ref()
const turnstileValid = ref(false)
const turnstileToken = ref<string | null>(null)

const onValidTurnstile = (token: string) => {
  turnstileValid.value = true
  turnstileToken.value = token
}

const form = reactive({
  email: '',
})

const auth = useAuth()

const handleForgotPassword = () =>
  auth.password.forgot(form.email, turnstileToken.value, turnstile.value.reset)

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && turnstileValid.value) {
    handleForgotPassword()
  }
}

definePageMeta({
  name: 'ForgotPassword',
})
</script>

<template>
  <AuthCard
    :show-title="false"
    :title="{
      main: 'Request Magic Link',
      subtitle: 'Enter your email to get a reset link.',
    }"
  >
    <template #content>
      <div
        class="flex flex-col gap-4 xl:gap-6"
        @keydown="handleKeydown"
      >
        <PrimeFloatLabel class="flex flex-col w-full">
          <PrimeInputText
            id="username"
            v-model="form.email"
          />
          <label for="username">Your Registered Email</label>
        </PrimeFloatLabel>
      </div>
      <TurnstileChallenge
        ref="turnstile"
        class="mb-4"
        :on-valid-token="onValidTurnstile"
      />
    </template>
    <template #footer>
      <PrimeButton
        class="w-full flex justify-center"
        :disabled="!turnstileValid"
        @click="handleForgotPassword"
      >
        Request Reset Email
      </PrimeButton>
    </template>
  </AuthCard>
</template>
