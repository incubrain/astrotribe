<script setup lang="ts">
definePageMeta({
  layoutTransition: false,
  name: 'Timeline',
  middleware: 'is-admin',
})
</script>

<template>
  <div class="p-4">
    <h1>Timeline</h1>
    <IBCalendar />
  </div>
</template>

<style scoped></style>
