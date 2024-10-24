<template>
  <div
    class="flex flex-col text-center gap-4"
    :class="padding"
  >
    <h2 class="text-3xl md:text-5xl font-bold text-center font-space">{{ title }}</h2>
    <h4
      class="text-2xl font-space uppercase text-primary-500 font-extrabold underline underline-offset-8"
    >
      {{ subtitle }}</h4
    >
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: false,
    default: '',
  },
  padding: {
    type: String,
    required: false,
    default: 'pb-8',
  },
})
</script>

<style scoped></style>
