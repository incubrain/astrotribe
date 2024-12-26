<script setup lang="ts">
const form = reactive({
  given_name: '',
  surname: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const auth = useAuth()
const turnstile = ref()
const turnstileValid = ref(false)
const turnstileToken = ref<string | null>(null)

const isPasswordEntered = computed(() => {
  return !!form.password && !!form.confirmPassword
})

const isPasswordValid = computed(() => {
  return form.password === form.confirmPassword && !!form.password && !!form.confirmPassword
})

const isEmailValid = computed(() => {
  return form.email.includes('@') && form.email.includes('.')
})

const isFormValid = computed(() => {
  return (
    isPasswordValid.value &&
    isEmailValid.value &&
    !!form.given_name &&
    !!form.surname &&
    turnstileValid.value
  )
})

const handleRegister = async () => {
  if (!isFormValid.value) return

  await auth.registerWithEmail({
    ...form,
    turnstileToken: turnstileToken.value,
    resetTurnstile: turnstile.value.reset,
  })
}

const onValidTurnstile = (token: string) => {
  turnstileValid.value = true
  turnstileToken.value = token
}

const handleKeydown = (event: KeyboardEvent) => {
  if (turnstileValid.value && event.key === 'Enter' && turnstileValid.value) {
    handleRegister()
  }
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
      <div
        class="flex flex-col gap-4"
        @keydown="handleKeydown"
      >
        <div class="flex w-full gap-4">
          <PrimeFloatLabel class="flex w-full flex-col">
            <PrimeInputText
              id="given_name"
              v-model="form.given_name"
              :pt="{ root: 'w-full' }"
              :pt-options="{ mergeProps: true, mergeSections: true }"
            />
            <label for="given_name">Given Name</label>
          </PrimeFloatLabel>
          <PrimeFloatLabel class="flex w-full flex-col">
            <PrimeInputText
              id="surname"
              v-model="form.surname"
              :pt="{ root: 'w-full' }"
              :pt-options="{ mergeProps: true, mergeSections: true }"
            />
            <label for="surname">Surname</label>
          </PrimeFloatLabel>
        </div>
        <PrimeFloatLabel class="flex w-full flex-col">
          <PrimeInputText
            id="email"
            v-model="form.email"
          />
          <label for="email">Email</label>
        </PrimeFloatLabel>
        <FormPassword
          id="user-password"
          v-model="form.password"
          label="Enter your password"
        />
        <FormPassword
          id="confirm-password"
          v-model="form.confirmPassword!"
          label="Confirm password"
          :invalid="!isPasswordValid && isPasswordEntered"
          :feedback="false"
        />

        <TurnstileChallenge
          ref="turnstile"
          :on-valid-token="onValidTurnstile"
        />

        <PrimeButton
          class="justify-center"
          :disabled="!isFormValid"
          @click="handleRegister"
        >
          Sign up with email
        </PrimeButton>
        <PrimeMessage
          v-show="!isPasswordValid && isPasswordEntered"
          severity="error"
        >
          Passwords do not match
        </PrimeMessage>
      </div>
    </template>
    <template #footer>
      <AuthRegisterWith :disabled="!turnstileValid" />
    </template>
  </AuthCard>
</template>
