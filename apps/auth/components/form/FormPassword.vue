<script setup lang="ts">
const form = reactive({
  email: '',
  password: '',
  rememberMe: false,
})

const props = defineProps({
  isRegister: {
    type: Boolean,
    default: false,
  },
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

// Get focused input using directive instead of ref
const vFocus = {
  mounted: (el) => {
    // Ensure the element is an input that can be focused
    if (el && typeof el.focus === 'function') {
      el.focus()
    }
  },
}

async function handleSubmit() {
  if (!turnstileValid.value) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    if (props.isRegister) {
      // Registration logic
      await auth.registerWithEmail({
        email: form.email,
        password: form.password,
        turnstileToken: turnstileToken.value,
        resetTurnstile: turnstile.value?.reset,
      })
    } else {
      // Login logic
      await auth.loginWithEmail(form.email, form.password, {
        turnstileToken: turnstileToken.value,
        resetTurnstile: turnstile.value?.reset,
      })
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'Authentication failed'
  } finally {
    isLoading.value = false
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (turnstileValid.value && event.key === 'Enter') {
    handleSubmit()
  }
}
</script>

<template>
  <!-- Use proper form ID for browsers to recognize the login/signup form -->
  <form
    :id="isRegister ? 'signup-form' : 'login-form'"
    class="flex flex-col gap-4 w-full"
    :autocomplete="isRegister ? 'off' : 'on'"
    @submit.prevent="handleSubmit"
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
        v-model="form.email"
        v-focus
        name="email"
        :disabled="isLoading"
        :autocomplete="isRegister ? 'email' : 'username'"
        class="w-full"
        type="email"
        placeholder="Enter your email"
        autofocus
      />
    </div>

    <div class="flex flex-col gap-2">
      <label
        for="password"
        class="text-sm"
        >Password</label
      >
      <!-- We use a wrapper div to handle the PrimePassword component -->
      <div class="password-wrapper">
        <PrimePassword
          id="password"
          v-model="form.password"
          name="password"
          :disabled="isLoading"
          :feedback="isRegister"
          input-class="w-full"
          toggle-mask
          :autocomplete="isRegister ? 'new-password' : 'current-password'"
          placeholder="Enter your password"
        />
      </div>
    </div>

    <div
      v-if="!isRegister"
      class="flex justify-between"
    >
      <div class="flex items-center gap-2">
        <PrimeCheckbox
          id="remember-me"
          v-model="form.rememberMe"
          :binary="true"
          :disabled="isLoading"
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
      type="submit"
      class="justify-center"
      :disabled="!turnstileValid || isLoading"
      :loading="isLoading"
    >
      <template v-if="!isLoading">
        {{ isRegister ? 'Sign up' : 'Sign in' }}
      </template>
      <template v-else>
        {{ isRegister ? 'Signing up...' : 'Signing in...' }}
      </template>
    </PrimeButton>

    <PrimeMessage
      v-if="errorMessage"
      severity="error"
      class="w-full"
    >
      {{ errorMessage }}
    </PrimeMessage>
  </form>
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
