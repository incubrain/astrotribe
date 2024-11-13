<!-- FolderItem.vue -->
<template>
  <div
    :class="[
      'group flex items-center px-2 py-1.5 rounded-md cursor-pointer',
      isSelected ? 'border' : 'hover:border-primary-950 border border-color foreground',
    ]"
    :style="{ paddingLeft: `${depth * 1.5 + 0.5}rem` }"
  >
    <div class="flex-1 flex items-center min-w-0">
      <div
        class="w-2 h-2 rounded-full mr-2"
        :style="{ backgroundColor: folder.color }"
      />
      <Icon
        v-if="folder.is_favorite"
        name="mdi:star"
        class="w-4 h-4 text-yellow-400 mr-1"
      />
      <span class="truncate">{{ folder.name }}</span>
      <span
        v-if="folder.is_default"
        class="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-primary-900"
      >
        Default
      </span>
    </div>

    <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100">
      <button
        class="p-1"
        @click.stop="$emit('edit', folder)"
      >
        <Icon
          name="mdi:pencil"
          class="w-4 h-4"
        />
      </button>
      <button
        v-if="!folder.is_default"
        class="p-1 hover:text-red-600"
        @click.stop="$emit('delete', folder)"
      >
        <Icon
          name="mdi:trash"
          class="w-4 h-4"
        />
      </button>
    </div>
  </div>

  <div v-if="folder.children?.length">
    <FolderItem
      v-for="child in folder.children"
      :key="child.id"
      :folder="child"
      :depth="depth + 1"
      :selected-id="selectedId"
      @select="$emit('select', $event)"
      @edit="$emit('edit', $event)"
      @delete="$emit('delete', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import type { Folder } from '../../types/bookmarks'

const props = defineProps<{
  folder: Folder
  depth?: number
  selectedId?: string
}>()

defineEmits<{
  (e: 'select' | 'edit' | 'delete', folder: Folder): void
}>()

const isSelected = computed(() => props.folder.id === props.selectedId)
</script>
