<template>
  <UCard>
    <div class="flex flex-wrap gap-2">
      <UButton
        color="primary"
        class="mt-4"
        @click="
          smtp.sendEmail({ email: 'drewmacgibbon@gmail.com', logic: 'auth', type: 'verify-email' })
        "
      >
        Test SMTP
      </UButton>
    </div>
  </UCard>
</template>

<script setup lang="ts">
const smtp = useSMTP()
</script>

<style scoped></style>
