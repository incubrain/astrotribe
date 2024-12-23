<script setup lang="ts">
definePageMeta({
  layoutTransition: false,
  name: 'Referrals',
})
</script>

<template>
  <div class="relative h-full max-h-full">
    <ReferralAdminDashboard />
    <ReferralSecurityMonitoring />
  </div>
</template>

<style scoped></style>
