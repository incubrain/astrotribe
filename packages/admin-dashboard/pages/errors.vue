<script setup lang="ts">
definePageMeta({
  layoutTransition: false,
  name: 'Errors',
  
  middleware: 'is-admin',
})
</script>

<template>
  <div class="relative h-full max-h-full">
    <AdminServerErrors />
  </div>
</template>

<style scoped></style>
