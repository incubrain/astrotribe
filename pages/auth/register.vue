<template>
  <div class="flex flex-col items-center justify-center w-full h-full">
    <h2 class="mb-6 text-2xl text-center"> Sign Up </h2>
    <FormDynamic
      :schema="registerForm"
      :validation-schema="RegisterSchema"
      has-labels
      class="w-full"
      @submit="handleRegister"
    >
      <FormButton> Sign Up </FormButton>
    </FormDynamic>
    <p class="mt-4 text-sm text-center">
      <NuxtLink to="/auth/login"> Already have an account? Sign In </NuxtLink>
    </p>
    <!-- <UButton
      class="flex items-center justify-center w-full gap-4 mt-6"
      color="white"
      @click="handleGoogleSignUp"
    >
      <NuxtImg
        src="/icons/google.svg"
        alt="Google Logo"
        width="28px"
      />
      Sign Up with Google
    </UButton> -->
  </div>
</template>

<script setup lang="ts">
// import useAuth from '~/composables/useAuth'
import { RegisterSchema } from '@/types/forms'
import registerForm from '@/data/forms/auth/register.json'

async function handleGoogleSignUp() {
  // try {
  //   const { data, error } = await auth.register.withOauth('google')
  //   if (error) throw error
  // } catch (error) {
  //   console.error('Error registering via Google', error)
  // }
}

definePageMeta({
  name: 'Register',
  layout: 'auth'
})
</script>
