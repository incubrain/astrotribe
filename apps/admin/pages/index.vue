<script setup lang="ts">
definePageMeta({
  layoutTransition: false,
  name: 'AdminDashboard',
})
</script>

<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-6">Jobs Monitor</h1>
    <CronDashboard />
  </div>
</template>

<style scoped></style>
