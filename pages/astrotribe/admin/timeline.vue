<script setup lang="ts">
definePageMeta({
  layoutTransition: false,
  name: 'Timeline',
  layout: 'admin',
  middleware: 'is-admin',
})
</script>

<template>
  <div class="p-4">
    <IbTasksCalendar />
  </div>
</template>

<style scoped></style>
