<script setup lang="ts">
const form = ref({
  email: '',
  password: '',
  rememberMe: false,
})

const auth = useAuth()
const currentUser = useCurrentUser()
const { haveUserSession } = storeToRefs(currentUser)
const turnstile = ref()
const turnstileValid = ref(false)
const turnstileToken = ref<string | null>(null)

const handleLogin = async () => {
  if (!turnstileValid.value) {
    return
  }

  await auth.loginWithEmail(form.value.email, form.value.password, {
    turnstileToken: turnstileToken.value,
    resetTurnstile: turnstile.value.reset,
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
      <div class="flex flex-col w-full gap-4">
        <div class="flex flex-col gap-2">
          <label
            for="email"
            class="text-sm"
            >Email</label
          >
          <PrimeInputText
            id="email"
            v-model="form.email"
            autocomplete="email"
            class="w-full"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label
            for="password"
            class="text-sm"
            >Password</label
          >
          <PrimePassword
            id="password"
            v-model="form.password"
            input-class="w-full"
            :feedback="false"
            toggle-mask
            autocomplete="current-password"
          />
        </div>

        <div class="flex justify-between">
          <div class="flex items-center gap-2">
            <PrimeCheckbox
              id="remember-me"
              v-model="form.rememberMe"
              :binary="true"
            />
            <label
              for="remember-me"
              class="text-sm"
              >Remember me</label
            >
          </div>
          <NuxtLink
            to="/forgot-password"
            class="text-sm text-primary hover:text-primary-600 transition-colors"
          >
            Forgot password?
          </NuxtLink>
        </div>

        <TurnstileChallenge
          ref="turnstile"
          class="mb-4"
          :on-valid-token="onValidTurnstile"
        />

        <PrimeButton
          class="justify-center link"
          :disabled="!turnstileValid"
          @click="handleLogin"
        >
          Login
        </PrimeButton>
      </div>
    </template>

    <template #footer>
      <AuthRegisterWith />
    </template>
  </AuthCard>
</template>
