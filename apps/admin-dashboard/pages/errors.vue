<script setup lang="ts">
const logger = useLogger('TESTER')
definePageMeta({
  layoutTransition: false,
  name: 'Errors',
})

logger.error('TESTING ERROR LOGGER NUXT', {})
</script>

<template>
  <div class="relative h-full max-h-full">
    <ErrorView />
  </div>
</template>

<style scoped></style>
