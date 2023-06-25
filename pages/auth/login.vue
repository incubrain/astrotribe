<template>
  <div class="flex flex-col items-center justify-center w-full h-full">
    <h2 class="mb-6 text-2xl text-center"> Sign In </h2>
    <FormDynamic
      :schema="loginData"
      :schema-validation="LoginValidation"
      class="w-full"
      @submit="handleLogin"
    >
      <FormButton> Sign In </FormButton>
    </FormDynamic>
    <p class="mt-4 text-sm text-center">
      <NuxtLink to="/auth/forgot-password"> Forgot Password? </NuxtLink>
    </p>
    <UButton
      class="flex items-center justify-center w-full gap-4 mt-6"
      color="white"
      @click="handleProviderSignIn('google')"
    >
      <NuxtImg
        src="/icons/google.svg"
        alt="Google Logo"
        width="28px"
      />
      Sign In with Google
    </UButton>
    <UButton
      class="flex items-center justify-center w-full gap-4 mt-6"
      color="white"
      @click="handleProviderSignIn('github')"
    >
      <UIcon
        name="i-mdi-github"
        alt="Github Logo"
        width="28px"
      />
      Sign In with Github
    </UButton>
  </div>
</template>

<script setup lang="ts">
import useAuth from '~/composables/useAuth'
import { LoginValidation } from '@/types/zod'
import { loginData } from '@/data/forms'

const auth = useAuth()

const handleLogin = (value: { email: string; password: string }) => {
  auth.login.withEmail(value.email, value.password)
}

async function handleProviderSignIn(provider) {
  try {
    const { data, error } = await auth.login.withOAuth(provider)

    if (error) throw error
    console.log('User logged in via Google', data)
  } catch (error) {
    console.error('Error logging in via Google', error)
  }
}

definePageMeta({
  name: 'Login',
  layout: 'auth'
})
</script>
