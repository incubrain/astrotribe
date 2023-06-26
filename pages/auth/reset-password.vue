<template>
  <div class="flex flex-col items-center justify-center w-full h-full">
    <h2 class="mb-6 text-2xl text-center">
      Reset Password
    </h2>
    <FormDynamic
      :schema="resetPasswordData"
      :schema-validation="ResetPasswordValidation"
      class="w-full"
      @submit="handleResetPassword"
    >
      <FormButton> Reset Password </FormButton>
    </FormDynamic>
  </div>
</template>

<script setup lang="ts">
import useAuth from '~/composables/useAuth'
import { ResetPasswordValidation } from '@/types/zod'
import { resetPasswordData } from '@/data/forms'

const auth = useAuth()
// const router = useRouter()

const handleResetPassword = (value: { password: string; confirmPassword: string }) => {
  // Get the user token from the URL
  if (value.password === value.confirmPassword) {
    auth.password.update(value.password)
  }
}

definePageMeta({
  name: 'Reset Password',
  layout: 'auth'
})
</script>
