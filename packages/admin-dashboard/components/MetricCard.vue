<template>
  <div class="rounded-lg border border-color background p-4 shadow-lg">
    <h3 class="mb-4 text-xl font-semibold">
      {{ title }}
    </h3>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>
