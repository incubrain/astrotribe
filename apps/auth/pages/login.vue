<script setup lang="ts">
const activeAuthMethod = ref('magic-link') // 'magic-link' or 'password'

const turnstile = ref()
const turnstileValid = ref(false)
const turnstileToken = ref<string | null>(null)

const onValidTurnstile = (token: string) => {
  turnstileValid.value = true
  turnstileToken.value = token
}

const resetTurnstile = () => {
  turnstile.value?.reset?.()
  turnstileValid.value = false
  turnstileToken.value = null
}

definePageMeta({
  name: 'Login',
})
</script>

<template>
  <AuthCard
    :title="{
      main: 'Login to AstronEra',
      subtitle: 'Don\'t have an account?',
      label: 'Sign up',
    }"
    :help-url="`${$config.public.registerPath}`"
  >
    <template #content>
      <div class="w-full flex flex-col gap-4">
        <!-- OAuth Providers (Google, Twitter, LinkedIn) -->
        <FormOAuthProviders layout="column" />

        <!-- Auth Method Toggle -->
        <FormToggle v-model:active-method="activeAuthMethod" />

        <TurnstileChallenge
          ref="turnstile"
          class="mb-4"
          :on-valid-token="onValidTurnstile"
        />

        <!-- Magic Link Form (Default) -->
        <div v-if="activeAuthMethod === 'magic-link'">
          <FormMagicLink
            :turnstile-valid="turnstileValid"
            :turnstile-token="turnstileToken"
            :reset-turnstile="resetTurnstile"
          />
        </div>

        <!-- Password Form (Alternative) -->
        <div v-else>
          <FormPassword
            :is-register="false"
            :turnstile-valid="turnstileValid"
            :turnstile-token="turnstileToken"
            :reset-turnstile="resetTurnstile"
          />
        </div>
      </div>
    </template>
  </AuthCard>
</template>
