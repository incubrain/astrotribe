<script setup lang="ts">
definePageMeta({
  layoutTransition: false,
  name: 'Growth',
  middleware: 'is-admin'
})
</script>

<template>
  <div class="relative h-full max-h-full">
    <!-- <AdminGrowthMetrics /> -->
    <AdminTableGrowth />
  </div>
</template>

<style scoped></style>
