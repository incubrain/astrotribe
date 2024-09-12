<script setup lang="ts">
definePageMeta({
  layoutTransition: false,
  name: 'Spider',
  layout: 'admin',
  middleware: 'is-admin',
})
</script>

<template>
  <div class="relative h-full max-h-full">
    <AdminSpiderAnalytics />
  </div>
</template>

<style scoped></style>
