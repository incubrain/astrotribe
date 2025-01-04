<script setup lang="ts">
defineProps({
  heading: {
    type: String,
    required: true,
  },
  subheading: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="flex flex-col justify-center items-center text-center lg:pl-8">
    <p class="mb-4 text-base font-bold uppercase tracking-tight text-primary-600">
      {{ heading }}
    </p>
    <h2 class="text-3xl font-semibold leading-normal max-w-80">
      {{ subheading }}
    </h2>
  </div>
</template>

<style scoped></style>
