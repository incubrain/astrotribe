<template>
  <div class="w-64">
    <h2 class="text-xl font-semibold leading-normal lg:text-2xl">
      {{ title }}
    </h2>
    <p class="mt-2 text-base">
      {{ value }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  }
})
</script>
