<template>
  <PrimeCard>
    <template #title>
      <h2 class="text-2xl text-center"> Sign In </h2>
    </template>
    <template #content>
      <div class="flex flex-col gap-6">
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
          @click="handleLogin({ provider: 'email', email: form.email, password: form.password })"
        >
          Sign in with email
        </PrimeButton>
        <div class="flex gap-4 w-full">
          <PrimeButton @click="handleLogin({ provider: 'google' })">
            <Icon
              class="mr-2"
              name="mdi:google"
              width="28px"
            />
            Sign in with Google
          </PrimeButton>
          <PrimeButton @click="handleLogin({ provider: 'linkedin' })">
            <Icon
              class="mr-2"
              name="mdi:linkedin"
              width="28px"
            />
            Sign in with Linkedin
          </PrimeButton>
        </div>
        <p class="mt-4 text-sm text-center">
          <NuxtLink to="/auth/forgot-password"> Forgot Password? </NuxtLink>
        </p>
      </div>
    </template>
  </PrimeCard>
</template>

<script setup lang="ts">
// import { LoginForm } from '@/types/forms'
import type { FormFieldType } from '@/types/forms'

const form = reactive({
  email: '',
  password: ''
})

interface LoginInput {
  provider?: string
  email?: string
  password?: string
}

const handleLogin = async ({ provider = 'email', email, password }: LoginInput) => {
  let body = null

  if (provider === 'email') {
    console.log('email', email)
    body = { email, password }
  }

  const data = await $fetch(`/api/auth/login/${provider}`, {
    method: 'POST',
    body
  })

  if (!data) throw createError('Login Error: No data returned from supabase')
}

// const auth = useAuth()

const schema = computed(() => {
  return [
    {
      name: 'email',
      props: {
        label: 'Email',
        type: 'email',
        suggested: 'username'
      }
    },
    {
      name: 'password',
      props: {
        label: 'Password',
        type: 'password',
        suggested: 'current-password'
      }
    }
  ] as FormFieldType[]
})

definePageMeta({
  name: 'Login',
  layout: 'auth'
})
</script>
