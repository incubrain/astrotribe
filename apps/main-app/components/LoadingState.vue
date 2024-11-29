<script setup lang="ts">
defineProps<{
  message?: string
}>()
</script>

<template>
  <div class="flex items-center justify-center h-64">
    <div class="flex flex-col items-center gap-4">
      <Icon
        name="mdi:loading"
        class="w-8 h-8 text-gray-400 animate-spin"
      />
      <span class="text-gray-500">{{ message || 'Loading...' }}</span>
    </div>
  </div>
</template>
