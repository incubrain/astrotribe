<template>
  <div class="flex flex-col items-center justify-center w-full h-full">
    <!-- <h2 class="mb-6 text-2xl text-center"> Reset Password </h2>
    <FormDynamic
      :schema="schema"
      :validation-schema="ResetPasswordForm"
      has-labels
      button-label="Reset Password"
      class="w-full"
      @submit-form="auth.resetPassword"
    /> -->
  </div>
</template>

<script setup lang="ts">
// import { ResetPasswordForm, FormField } from '@/types/forms'

// const auth = useAuthStore()
// const router = useRouter()

// const handleResetPassword = (value: { password: string; confirmPassword: string }) => {
//   // Get the user token from the URL
//   // if (value.password === value.confirmPassword) {
//   //   auth.password.update(value.password)
//   // }
// }

// const schema = computed(() => {
//   return [
//     {
//       name: 'password',
//       props: {
//         label: 'Password',
//         type: 'password'
//       }
//     },
//     {
//       name: 'confirmPassword',
//       props: {
//         label: 'Confirm Password',
//         type: 'password'
//       }
//     }
//   ] as FormField[]
// })

definePageMeta({
  name: 'ResetPassword',
  layout: 'auth'
})
</script>
