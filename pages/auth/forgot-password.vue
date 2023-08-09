<template>
  <div class="flex flex-col items-center justify-center w-full h-full">
    <h2 class="mb-6 text-2xl text-center"> Forgot Your Password? </h2>
    <FormDynamic
      :schema="forgotPasswordData"
      :validation-schema="ForgotPasswordSchema"
      class="w-full"
      @submit="handleForgotPassword"
    >
      <FormButton> Request Reset Email </FormButton>
    </FormDynamic>
  </div>
</template>

<script setup lang="ts">
// import useAuth from '~/composables/useAuth'
import { ForgotPasswordSchema } from '@/types/forms'
import forgotPasswordData from '@/data/forms/auth/forgot-password.json'

// const auth = useAuth()

const handleForgotPassword = (value: { email: string }) => {
  // auth.password.requestResetEmail(value.email)
}

definePageMeta({
  name: 'Forgot Password',
  layout: 'auth'
})
</script>
