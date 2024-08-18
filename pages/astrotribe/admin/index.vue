<script setup lang="ts">
definePageMeta({
  layoutTransition: false,
  name: 'AdminDashboard',
  middleware: 'is-admin'
})
</script>

<template>
  <div class="relative h-full max-h-full">
    <!-- <AdminScraperMetrics /> -->

    <AdminDatabaseMetrics />
    <AdminServerJobs />
  </div>
</template>

<style scoped></style>
