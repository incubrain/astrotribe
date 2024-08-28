<script setup lang="ts">
definePageMeta({
  layoutTransition: false,
  name: 'Spider',
  middleware: 'is-admin'
})
</script>

<template>
  <div class="relative h-full max-h-full">
    <AdminSpiderAnalytics />
  </div>
</template>

<style scoped></style>
