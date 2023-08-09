<template>
  <div class="py-32">
    <h1 class="text-xl font-semibold">Please Confirm Your Email:</h1>
    <div>
      <h1 class="mb-4">Check your email</h1>
      <p class="mb-2">
        We’ve sent a message to
        <strong>{{ user?.email }}</strong>
        with a link to activate your account.
      </p>
      <div class="flex">
        <div>
          <p>
            <a
              target="_blank"
              href="https://mail.google.com/mail/u/0/"
              rel="noopener noreferrer"
              >Open Gmail</a
            >
          </p>
        </div>
        <div>
          <p>
            <a
              target="_blank"
              href="https://outlook.live.com/mail/0/inbox"
              rel="noopener noreferrer"
              >Open Outlook</a
            >
          </p>
        </div>
      </div>
      <div></div>
      <label>Didn’t get an email? Check your spam folder!</label>
      <div>
        <p>Still nothing? Try to register again</p>
        <br />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const auth = useAuthStore();
const { user } = storeToRefs(auth);
</script>

<style scoped></style>
