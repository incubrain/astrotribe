<script setup lang="ts">
const userStore = useCurrentUser()
const { profile } = storeToRefs(userStore)

definePageMeta({
  name: 'Success',
})
</script>

<template>
  <PrimeCard>
    <template #title>
      <h2 class="text-primary-700 pb-2 text-3xl font-semibold"> SUCCESS! </h2>
    </template>
    <template #subtitle>
      <PrimeMessage
        severity="info"
        class="text-white"
      >
        Please confirm your email
      </PrimeMessage>
    </template>
    <template #content>
      <div class="pt-2">
        <p> We’ve sent a message to your email address: </p>
        <p>
          <strong>{{ profile?.email }}</strong>
        </p>
        <p> with a link to activate your account. </p>
        <div class="w-auto space-x-2 py-4">
          <PrimeTag>
            <a
              target="_blank"
              href="https://mail.google.com/mail/u/0/"
              rel="noopener noreferrer"
            >
              Open Gmail
            </a>
          </PrimeTag>
          <PrimeTag>
            <a
              target="_blank"
              href="https://outlook.live.com/mail/0/inbox"
              rel="noopener noreferrer"
            >
              Open Outlook
            </a>
          </PrimeTag>
        </div>
        <p>Didn’t get an email? Please check your spam folder.</p>
        <p>
          Still nothing?
          <NuxtLink
            class="text-primary-500 underline"
            to="/forgot-password"
          >
            Request another.
          </NuxtLink>
        </p>
      </div>
    </template>
  </PrimeCard>
</template>

<style scoped></style>
