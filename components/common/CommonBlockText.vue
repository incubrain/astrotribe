<template>
  <div class="w-full p-4 border border-color foreground xl:p-8 md:rounded-lg md:shadow-sm">
    <h1 class="mb-4 text-lg font-semibold md:text-xl xl:text-2xl">
      {{ title }}
    </h1>
    <p>
      {{ body }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  }
})
</script>

<style scoped></style>
