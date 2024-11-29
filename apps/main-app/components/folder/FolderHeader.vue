<!-- FolderHeader.vue -->
<template>
  <div class="flex items-center gap-2">
    <div
      class="w-3 h-3 rounded-full"
      :style="{ backgroundColor: folder.color }"
    />
    <h2 class="text-xl font-semibold">{{ folder.name }}</h2>
    <Icon
      v-if="folder.is_favorite"
      name="mdi:star"
      class="text-yellow-400"
    />
  </div>
</template>

<script setup lang="ts">
import type { Folder } from '~/types/folder'

defineProps<{
  folder: Folder
}>()
</script>
