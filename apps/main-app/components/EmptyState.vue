<script setup lang="ts">
defineProps<{
  isSearching: boolean
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center h-64 text-gray-500">
    <Icon
      name="mdi:bookmark-outline"
      class="w-12 h-12"
    />
    <p class="mt-4 text-lg">No bookmarks found</p>
    <p class="text-sm">
      {{ isSearching ? 'Try a different search term' : 'Start by bookmarking some articles' }}
    </p>
  </div>
</template>
