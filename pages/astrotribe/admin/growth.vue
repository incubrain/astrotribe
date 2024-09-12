<script setup lang="ts">
definePageMeta({
  layoutTransition: false,
  name: 'Growth',
  layout: 'admin',
  middleware: 'is-admin',
})
</script>

<template>
  <div>
    <!-- <AdminGrowthMetrics /> -->
    <AdminTableGrowth />
  </div>
</template>

<style scoped></style>
