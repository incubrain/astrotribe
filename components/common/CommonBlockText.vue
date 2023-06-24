<template>
  <div>
    <h1 class="text-lg font-semibold md:text-xl xl:text-2xl mb-4">
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
