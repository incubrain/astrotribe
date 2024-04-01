<script setup lang="ts">
const form = reactive({
  email: '',
  password: '',
  confirmPassword: ''
})

const isPasswordValid = computed(() => {
  return form.password === form.confirmPassword
})

const baseUrl = computed(() => window.location.origin)

const handleRegister = async (provider: string) => {
  let body = null

  if (provider === 'email') {
    console.log('email')

    if (!isPasswordValid.value) {
      // todo: show error message
      console.log('passwords do not match')
      return
    }
    body = { email: form.email, password: form.password }
  }

  const { user, error } = await $fetch(`/api/auth/register/${provider}`, {
    method: 'POST',
    body
  })

  if (error) {
    console.error('Error signing up:', error)
    // show message
  }

  if (user) {
    // redirect to success page
    console.log('user', user)
  }
}

definePageMeta({
  name: 'Register',
  layout: 'auth'
})
</script>

<template>
  <PrimeCard class="flex flex-col items-center justify-center w-full h-full">
    <template #title>
      <h2 class="text-2xl text-center"> Register </h2>
    </template>
    <template #content>
      <div class="flex flex-col gap-4 xl:gap-6">
        <PrimeFloatLabel class="flex flex-col w-full">
          <PrimeInputText
            id="username"
            v-model="form.email"
          />
          <label for="username">Username</label>
        </PrimeFloatLabel>
        <PrimeFloatLabel>
          <PrimePassword
            id="password"
            v-model="form.password"
            class="flex flex-col relative"
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
        <PrimeFloatLabel>
          <PrimePassword
            id="confirmPassword"
            v-model="form.confirmPassword"
            :feedback="false"
            class="flex flex-col relative"
          />
          <label for="confirmPassword">Confirm password</label>
        </PrimeFloatLabel>
        <PrimeButton
          class="justify-center"
          @click="handleRegister('email')"
        >
          Sign in with email
        </PrimeButton>
      </div>
    </template>
    <template #footer>
      <div class="flex flex-col md:flex-row gap-4 xl:gap-6 w-full">
        <AuthSocialButton
          provider="twitter"
          @social-login="handleRegister('twitter')"
        />
        <AuthSocialButton
          provider="linkedin"
          @social-login="handleRegister('linkedin')"
        />
      </div>
      <p class="mt-4 text-sm text-center">
        <NuxtLink to="/auth/login"> Already have an account? Sign In </NuxtLink>
      </p>
    </template>
  </PrimeCard>
</template>
