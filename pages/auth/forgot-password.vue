<script setup lang="ts">
// If you use PKCE (default), this link only works on the device or browser where the original reset request was made. Display a message to the user to make sure they don't change devices or browsers.
// redirectTo page (password reset) should require auth to view (should be secure)

const form = reactive({
  email: ''
})

const auth = useAuth()

definePageMeta({
  name: 'ForgotPassword',
  layout: 'auth'
})
</script>

<template>
  <PrimeCard class="flex flex-col items-center justify-center w-full h-full">
    <template #title>
      <h2 class="text-2xl text-center"> Forgot Your Password?</h2>
    </template>
    <template #content>
      <div class="flex flex-col gap-4 xl:gap-6">
        <PrimeFloatLabel class="flex flex-col w-full">
          <PrimeInputText
            id="username"
            v-model="form.email"
          />
          <label for="username">Email</label>
        </PrimeFloatLabel>
        <PrimeButton
          class="justify-center"
          @click="auth.password.forgot(form.email)"
        >
          Send Reset Email
        </PrimeButton>
      </div>
    </template>
  </PrimeCard>
</template>
