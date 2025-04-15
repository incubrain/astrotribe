<script setup lang="ts">
const form = reactive({
  email: '',
})

const auth = useAuth()
const isLoading = ref(false)
const isSuccess = ref(false)
const errorMessage = ref('')

const props = defineProps({
  isRegister: {
    type: Boolean,
    default: false,
  },
  turnstileValid: {
    type: Boolean,
    default: false,
  },
  turnstileToken: {
    type: String,
    default: null,
  },
  resetTurnstile: {
    type: Function,
    default: null,
  },
})

// Get focused input using directive instead of ref
const vFocus = {
  mounted: (el) => {
    // Ensure the element is an input that can be focused
    if (el && typeof el.focus === 'function') {
      el.focus()
    }
  },
}

async function handleSendMagicLink() {
  if (!props.turnstileValid) return

  isLoading.value = true
  errorMessage.value = ''
  isSuccess.value = false

  try {
    await auth.sendMagicLink(form.email, props.turnstileToken)
    isSuccess.value = true
    // Keep the success message visible for a few seconds
    setTimeout(() => {
      isSuccess.value = false
    }, 5000)
  } catch (error: any) {
    errorMessage.value = error.message || 'Failed to send magic link'
  } finally {
    isLoading.value = false
    setTimeout(() => props.resetTurnstile(), 1000)
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (props.turnstileValid && event.key === 'Enter') {
    handleSendMagicLink()
  }
}

// Try to prefill email from localStorage if available
onMounted(() => {
  try {
    const savedEmail = localStorage.getItem('userEmail')
    if (savedEmail) {
      form.email = savedEmail
    }
  } catch (e) {
    // Ignore any localStorage errors
  }
})

// Save email to localStorage when user submits
watch(
  () => form.email,
  (newEmail) => {
    if (newEmail && newEmail.includes('@')) {
      try {
        localStorage.setItem('userEmail', newEmail)
      } catch (e) {
        // Ignore any localStorage errors
      }
    }
  },
)
</script>

<template>
  <form
    id="magic-link-form"
    class="flex flex-col gap-4 w-full"
    autocomplete="on"
    @submit.prevent="handleSendMagicLink"
    @keydown="handleKeydown"
  >
    <div class="flex flex-col gap-2">
      <label
        for="email-magic"
        class="text-sm"
        >Email</label
      >
      <PrimeInputText
        id="email-magic"
        v-model="form.email"
        v-focus
        name="email"
        :disabled="isLoading"
        autocomplete="username email"
        class="w-full"
        type="email"
        placeholder="Enter your email"
        autofocus
      />
    </div>

    <PrimeButton
      type="submit"
      class="justify-center"
      :disabled="!turnstileValid || isLoading"
      :loading="isLoading"
    >
      <template v-if="!isLoading">Send Magic Link</template>
      <template v-else>Sending...</template>
    </PrimeButton>

    <PrimeMessage
      v-if="isSuccess"
      severity="success"
      class="w-full"
    >
      Magic link sent! Check your email to sign in.
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

<style scoped>
/* This helps the browser autofill styles to work properly */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  transition: background-color 5000s ease-in-out 0s;
}
</style>
