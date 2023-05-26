<template>
  <div>
    <h2 class="lg:w-64 text-xl lg:text-2xl font-semibold leading-normal text-general">{{
      title
    }}</h2>
    <p class="text-base leading-normal text-general mt-2">{{ value }}</p>
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
