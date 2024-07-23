<script setup lang="ts">

const dataIsReady = ref(false)

definePageMeta({
  layoutTransition: false,
  name: 'AdminDashboard',
  middleware: 'is-admin'
})
</script>

<template>
  <div class="relative h-full max-h-full">
    <AdminScraperMetrics />
  </div>
</template>

<style scoped></style>
