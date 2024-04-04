<script setup lang="ts">
const form = reactive({
  email: '',
  password: ''
})

type Provider = 'twitter' | 'linkedin' | 'email'

const handleLogin = async (provider: Provider) => {
  let body = null

  if (provider === 'email') {
    console.log('email')
    body = { email: form.email, password: form.password }
  }

  const data = await $fetch(`/api/auth/login/${provider}`, {
    method: 'POST',
    body
  })

  if (!data.user) {
    console.error('Login Error: No data returned from supabase')
    return
  }

  if (provider === 'linkedin') {
    window.location.href = data.user.url
  }
}

definePageMeta({
  name: 'Login',
  layout: 'auth'
})
</script>

<template>
  <PrimeCard>
    <template #title>
      <h2 class="text-2xl text-center"> Sign In </h2>
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
            <template #header>
              <h6>Pick a password</h6>
            </template>
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

        <PrimeButton
          class="justify-center"
          @click="handleLogin('email')"
        >
          Sign in with email
        </PrimeButton>
        <div class="flex flex-col md:flex-row gap-4 xl:gap-6 w-full">
          <AuthSocialButton
            provider="twitter"
            @social-login="handleLogin('twitter')"
          />
          <AuthSocialButton
            provider="linkedin"
            @social-login="handleLogin('linkedin')"
          />
        </div>
      </div>
    </template>
    <template #footer>
      <p class="mt-4 text-sm text-center">
        <NuxtLink to="/auth/forgot-password"> Forgot Password? </NuxtLink>
      </p>
    </template>
  </PrimeCard>
</template>
