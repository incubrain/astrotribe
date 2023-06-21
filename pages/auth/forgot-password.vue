<template>
  <div class="w-full h-full flex flex-col justify-center items-center">
    <h2 class="text-2xl mb-6 text-center"> Forgot Your Password? </h2>
    <FormDynamic
      :schema="forgotPasswordData"
      :schema-validation="ForgotPasswordValidation"
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
