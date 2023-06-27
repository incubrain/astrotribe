<template>
  <div class="flex flex-col justify-center text-center lg:pl-8">
    <h1 class="mb-4 text-base font-bold tracking-tight text-primary-700 dark:text-primary-600">
      {{ heading }}
    </h1>
    <h2 class="text-3xl font-semibold leading-normal max-w-80">
      {{ subheading }}
    </h2>
  </div>
</template>

<script setup lang="ts">
defineProps({
  heading: {
    type: String,
    required: true
  },
  subheading: {
    type: String,
    required: true
  }
})
</script>

<style scoped></style>
