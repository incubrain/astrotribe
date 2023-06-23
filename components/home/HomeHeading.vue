<template>
  <div class="flex flex-col mb-8 text-center justify-center lg:pl-8">
    <h1 class="text-base font-bold text-primary-700 dark:text-primary-600 tracking-tight mb-4">
      {{ heading }}
    </h1>
    <h2 class="text-3xl font-semibold max-w-80 leading-normal">
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
