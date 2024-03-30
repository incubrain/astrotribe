<template>
  <div class="flex flex-col items-center justify-center w-full h-full">
    <h2 class="mb-6 text-2xl text-center"> Forgot Your Password?</h2>
    <FormDynamic
      :schema="schema"
      :validation-schema="ForgotPasswordForm"
      has-labels
      button-label="Request Reset Email"
      class="w-full"
      @submit-form="auth.forgotPassword"
    />
  </div>
</template>

<script setup lang="ts">
import { ForgotPasswordForm } from '@/types/forms'
import type { FormFieldType } from '@/types/forms'

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
  ] as FormFieldType[]
})

const auth = useAuth()

definePageMeta({
  name: 'ForgotPassword',
  layout: 'auth'
})
</script>
