<template>
  <div class="w-64">
    <h2 class="text-xl lg:text-2xl font-semibold leading-normal">{{ title }}</h2>
    <p class="text-base mt-2">{{ value }}</p>
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
