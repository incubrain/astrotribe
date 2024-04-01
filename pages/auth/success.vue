<script setup lang="ts">
const { user } = useUser()

definePageMeta({
  name: 'Success',
  layout: 'auth'
})
</script>

<template>
  <PrimeCard>
    <template #title>
      <h2 class="text-xl font-semibold text-primary-500 dark:text-primary-700"> SUCCESS! </h2>
    </template>
    <template #subtitle>
      <p> Please confirm your email</p>
    </template>
    <template #content>
      <div>
        <p> We’ve sent a message to your email address: </p>
        <p>
          <strong>{{ user?.email }}</strong>
        </p>
        <p> with a link to activate your account. </p>
        <div class="space-x-2 py-4 w-auto">
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
      </div>
    </template>
    <template #footer>
      <p>Didn’t get an email? Please check your spam folder.</p>
      <p>Still nothing? Try to register again</p>
    </template>
  </PrimeCard>
</template>

<style scoped></style>
