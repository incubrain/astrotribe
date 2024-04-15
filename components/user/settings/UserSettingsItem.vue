<script setup lang="ts">
defineProps({
  item: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="flex gap-8 w-full h-auto border-color py-4 justify-between border-y">
    <div class="flex flex-col gap-4 justify-start max-w-48 w-full">
      <div class="space-y-2 w-full">
        <p class="text-lg font-bold">
          {{ item.label }}
        </p>
        <p class="text-sm">
          {{ item.tip }}
        </p>
      </div>
    </div>
    <div class="w-full">
      <slot />
    </div>
  </div>
</template>

<style scoped></style>
