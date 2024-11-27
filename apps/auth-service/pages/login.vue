<script setup lang="ts">
const form = ref({
  email: '',
  password: '',
  rememberMe: false,
})

const auth = useAuth()
const currentUser = useCurrentUser()
const { haveUserSession } = storeToRefs(currentUser)
const turnstileValid = ref(false)
const turnstileToken = ref<string | null>(null)

// Modified login handler
const handleLogin = async () => {
  if (!turnstileValid.value) {
    // Show error message to user that captcha is required
    return
  }

  await auth.loginWithEmail(form.value.email, form.value.password, {
    turnstileToken: turnstileToken.value,
  })
}

const onValidTurnstile = (token: string) => {
  turnstileValid.value = true
  turnstileToken.value = token
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
    help-url="/register"
  >
    <template #title>
      <div v-if="haveUserSession">
        <AuthVerifiedWith class="w-full" />

        <div class="w-full pt-4">
          <PrimeDivider
            layout="horizontal"
            class="flex justify-left items-center"
          >
            <p>Or Login with</p>
          </PrimeDivider>
        </div>
      </div>
    </template>
    <template #content>
      <PrimeFloatLabel class="flex flex-col w-full">
        <PrimeInputText
          id="username"
          v-model="form.email"
        />
        <label for="username">Username</label>
      </PrimeFloatLabel>

      <PrimeFloatLabel class="flex flex-col w-full">
        <FormPassword
          v-model="form.password"
          :feedback="false"
        />
        <label for="password">Password</label>
      </PrimeFloatLabel>

      <div class="w-full py-2 flex justify-between">
        <!-- Remember me and forgot password section -->
      </div>

      <TurnstileChallenge
        class="mb-4"
        :onValidToken="onValidTurnstile"
      />

      <PrimeButton
        class="justify-center link"
        :disabled="!turnstileValid"
        @click="handleLogin"
      >
        Sign in with email
      </PrimeButton>
    </template>
    <template #footer>
      <AuthRegisterWith />
    </template>
  </AuthCard>
</template>
