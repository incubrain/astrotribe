<script setup lang="ts">
definePageMeta({
  layoutTransition: false,
  name: 'Redis',
  middleware: 'is-admin',
})
</script>

<template>
  <div class="relative h-full max-h-full">
    <AdminRedisManagement />
  </div>
</template>

<style scoped></style>
