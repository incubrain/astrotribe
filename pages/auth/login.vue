<template>
  <div class="flex flex-col items-center justify-center w-full h-full">
    <h2 class="mb-6 text-2xl text-center"> Sign In </h2>
    <FormDynamic
      :schema="schema"
      :validation-schema="LoginForm"
      has-labels
      class="w-full"
      @submit-form="auth.login"
    >
      <FormButton> Sign In </FormButton>
    </FormDynamic>
    <!-- <p class="mt-4 text-sm text-center">
      <NuxtLink to="/auth/forgot-password"> Forgot Password? </NuxtLink>
    </p> -->
    <!-- <div class="gap-4 w-full mt-6 hidden">
      <UButton
        class="flex items-center justify-center w-full"
        color="white"
        @click="handleProviderSignIn('google')"
      >
        <UIcon
          class="mr-2"
          name="i-mdi-google"
          width="28px"
        />
        Sign In with Google
      </UButton>
      <UButton
        class="flex items-center justify-center w-full"
        color="white"
        @click="handleProviderSignIn('linkedin')"
      >
        <UIcon
          class="mr-2"
          name="i-mdi-linkedin"
          width="28px"
        />
        Sign In with Linkedin
      </UButton>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { LoginForm } from '@/types/forms'
import type { FormFieldType } from '@/types/forms'

const auth = useAuth()

const schema = computed(() => {
  return [
    {
      name: 'email',
      props: {
        label: 'Email',
        type: 'email'
      }
    },
    {
      name: 'password',
      props: {
        label: 'Password',
        type: 'password'
      }
    }
  ] as FormFieldType[]
})

definePageMeta({
  name: 'Login',
  layout: 'auth'
})
</script>
