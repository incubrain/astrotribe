<!-- /forgot-password -->

<script setup lang="ts">
// If you use PKCE (default), this link only works on the device or browser where the original reset request was made. Display a message to the user to make sure they don't change devices or browsers.

const form = reactive({
  email: '',
})

const auth = useAuth()

definePageMeta({
  name: 'ForgotPassword',
})
</script>

<template>
  <AuthCard
    :show-title="false"
    :title="{
      main: 'Request Magic Link',
      subtitle: 'Enter your email to get a reset link.',
    }"
  >
    <template #content>
      <div class="flex flex-col gap-4 xl:gap-6">
        <PrimeFloatLabel class="flex flex-col w-full">
          <PrimeInputText
            id="username"
            v-model="form.email"
          />
          <label for="username">Your Registered Email</label>
        </PrimeFloatLabel>
      </div>
    </template>
    <template #footer>
      <PrimeButton
        class="w-full flex justify-center"
        @click="auth.password.forgot(form.email)"
      >
        Request Reset Email
      </PrimeButton>
    </template>
  </AuthCard>
</template>
