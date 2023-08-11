<template>
  <div class="flex flex-col items-center justify-center w-full h-full">
    <h2 class="mb-6 text-2xl text-center"> Forgot Your Password? test </h2>
    <FormDynamic
      :schema="schema"
      :validation-schema="ForgotPasswordForm"
      has-labels
      button-label="Request Reset Email"
      class="w-full"
      @submit-form="auth.requestPasswordReset"
    />
  </div>
</template>

<script setup lang="ts">
import { ForgotPasswordForm, FormField } from '@/types/forms'

const schema = computed(() => {
  return [
    {
      name: 'email',
      width: 'full',
      props: {
        label: 'Email',
        type: 'email'
      }
    }
  ] as FormField[]
})

const auth = useAuthStore()

const handleForgotPassword = (value: { email: string }) => {
  // auth.password.requestResetEmail(value.email)
}

definePageMeta({
  name: 'ForgotPassword',
  layout: 'auth'
})
</script>
