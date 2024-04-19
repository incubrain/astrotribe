<template>
  <div class="flex flex-col justify-center items-center text-center lg:pl-8">
    <p class="mb-4 text-base font-bold uppercase tracking-tight text-primary-700 dark:text-primary-600">
      {{ heading }}
    </p>
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
