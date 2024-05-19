<script setup lang="ts">
const form = reactive({
  given_name: '',
  surname: '',
  email: '',
  password: '',
  confirmPassword: null as string | null
})

const auth = useAuth()

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
  return isPasswordValid.value && isEmailValid.value && !!form.given_name && !!form.surname
})


definePageMeta({
  name: 'Register',
  layout: 'auth'
})
</script>

<template>
  <AuthCard
    :title="{
      main: 'Create an Account',
      subtitle: 'Already have an account?',
      label: 'Login'
    }"
    help-url="/auth/login"
  >
    <template #content>
      <div class="flex flex-col gap-4">
        <div class="flex gap-4 w-full">
          <PrimeFloatLabel class="flex flex-col w-full">
            <PrimeInputText
              id="given_name"
              v-model="form.given_name"
              :pt="{ root: 'w-full' }"
            />
            <label for="given_name">Given Name</label>
          </PrimeFloatLabel>
          <PrimeFloatLabel class="flex flex-col w-full">
            <PrimeInputText
              id="surname"
              v-model="form.surname"
              :pt="{ root: 'w-full' }"
            />
            <label for="surname">Surname</label>
          </PrimeFloatLabel>
        </div>
        <PrimeFloatLabel class="flex flex-col w-full">
          <PrimeInputText
            id="email"
            v-model="form.email"
          />
          <label for="email">Email</label>
        </PrimeFloatLabel>
        <div class="flex gap-4 w-full">
          <PrimeFloatLabel class="w-full">
            <PrimePassword
              id="password"
              v-model="form.password"
              :pt="{ root: 'w-full', input: { root: 'w-full' } }"
            >
              <template #footer>
                <PrimeDivider />
                <p class="mt-2">Suggestions</p>
                <ul
                  class="pl-2 ml-2 mt-0"
                  style="line-height: 1.5"
                >
                  <li>At least one lowercase</li>
                  <li>At least one uppercase</li>
                  <li>At least one numeric</li>
                  <li>Minimum 8 characters</li>
                </ul>
              </template>
            </PrimePassword>
            <label for="password">Password</label>
          </PrimeFloatLabel>
          <PrimeFloatLabel class="w-full">
            <PrimePassword
              id="confirmPassword"
              v-model="form.confirmPassword"
              :feedback="false"
              :invalid="!isPasswordValid && isPasswordEntered"
              :pt="{ root: 'w-full', input: { root: 'w-full' } }"
            />
            <label for="confirmPassword">Confirm password</label>
          </PrimeFloatLabel>
        </div>
        <PrimeButton
          class="justify-center"
          :disabled="!isFormValid"
          @click="auth.registerWithEmail(form!)"
        >
          Sign up with email
        </PrimeButton>
        <PrimeInlineMessage
          severity="error"
          v-show="!isPasswordValid && isPasswordEntered"
        >
          Passwords do not match
        </PrimeInlineMessage>
      </div>
    </template>
    <template #footer>
      <AuthRegisterWith />
    </template>
  </AuthCard>
</template>
