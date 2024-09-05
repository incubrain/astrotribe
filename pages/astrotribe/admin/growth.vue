<script setup lang="ts">
definePageMeta({
  layoutTransition: false,
  name: 'Growth',
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
