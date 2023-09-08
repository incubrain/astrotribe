<template>
  <div
    class="flex justify-center items-start gap-4 flex-col w-full rounded-lg"
    :class="hasBorder ? 'border p-4 xl:p-8' : ''"
  >
    <h2 class="text-xl xl:text-2xl font-bold"> {{ title }}</h2>
    <h4 class="text-base font-semibold"> {{ subtitle }}</h4>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  },
  hasBorder: {
    type: Boolean,
    default: true
  }
})
</script>
