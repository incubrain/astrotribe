<script setup lang="ts">
const activeAuthMethod = ref('magic-link') // 'magic-link' or 'password'

definePageMeta({
  name: 'Login',
})
</script>

<template>
  <AuthCard
    :title="{
      main: 'Login to AstronEra',
      subtitle: 'Don\'t have an account?',
      label: 'Sign up',
    }"
    help-url="/register"
  >
    <template #content>
      <div class="w-full flex flex-col gap-4">
        <!-- OAuth Providers (Google, Twitter, LinkedIn) -->
        <FormOAuthProviders layout="column" />

        <!-- Auth Method Toggle -->
        <FormToggle v-model:active-method="activeAuthMethod" />

        <!-- Magic Link Form (Default) -->
        <div v-if="activeAuthMethod === 'magic-link'">
          <FormMagicLink />
        </div>

        <!-- Password Form (Alternative) -->
        <div v-else>
          <FormPassword :is-register="false" />
        </div>
      </div>
    </template>
  </AuthCard>
</template>
