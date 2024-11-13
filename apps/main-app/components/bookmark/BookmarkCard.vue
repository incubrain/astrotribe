<!-- BookmarksCard -->
<template>
  <div
    :class="[
      'relative group p-4 border border-color rounded-lg hover:shadow-sm transition-shadow',
      selected ? 'ring-2 ring-primary-500 border-transparent' : 'hover:border-color',
    ]"
  >
    <!-- Selection Checkbox -->
    <div class="absolute top-2 left-2 z-10">
      <input
        type="checkbox"
        :checked="selected"
        class="rounded border-color"
        @change="$emit('select', bookmark.id)"
      />
    </div>

    <!-- Content -->
    <div class="space-y-2">
      <NuxtImg
        :src="bookmark.metadata.thumbnail"
        :alt="bookmark.metadata.title"
        class="w-full h-48 object-cover rounded"
      />

      <h3 class="font-medium line-clamp-2">
        {{ bookmark.metadata.title }}
      </h3>

      <p class="text-sm text-gray-600 line-clamp-2">
        {{ bookmark.metadata.description }}
      </p>

      <!-- Folder Badge -->
      <div
        v-if="bookmark.folder"
        class="flex items-center gap-1.5 text-sm text-gray-600"
      >
        <div
          class="w-2 h-2 rounded-full"
          :style="{ backgroundColor: bookmark.folder.color }"
        />
        <span class="truncate">{{ bookmark.folder.name }}</span>
        <Icon
          v-if="bookmark.folder.is_favorite"
          name="mdi:star"
          class="w-4 h-4 text-yellow-400"
        />
      </div>
    </div>

    <!-- Actions -->
    <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        class="p-1.5 text-gray-400 hover:text-gray-600"
        @click="$emit('move')"
      >
        <Icon
          name="mdi:folder-move"
          class="w-5 h-5"
        />
      </button>
      <button
        class="p-1.5 text-gray-400 hover:text-red-600"
        @click="$emit('delete')"
      >
        <Icon
          name="mdi:trash"
          class="w-5 h-5"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Bookmark } from '../../types/bookmarks'

interface Props {
  bookmark: Bookmark
  selected?: boolean
  showSelect?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selected: false,
  showSelect: false,
})

const emit = defineEmits<{
  (e: 'select', id: string): void
  (e: 'move'): void
  (e: 'delete'): void
}>()
</script>
