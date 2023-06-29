<template>
  <div class="flex flex-col items-center justify-center w-full h-full">
    <h2 class="mb-6 text-2xl text-center"> Forgot Your Password? </h2>
    <FormDynamic
      :schema="forgotPasswordData"
      :validation-schema="ForgotPasswordValidation"
      class="w-full"
      @submit="handleForgotPassword"
    >
      <FormButton> Request Reset Email </FormButton>
    </FormDynamic>
  </div>
</template>

<script setup lang="ts">
import useAuth from '~/composables/useAuth'
import { ForgotPasswordValidation } from '@/types/zod'
import { forgotPasswordData } from '@/data/forms'

const auth = useAuth()

const handleForgotPassword = (value: { email: string }) => {
  auth.password.requestResetEmail(value.email)
}

definePageMeta({
  name: 'Forgot Password',
  layout: 'auth'
})
</script>
