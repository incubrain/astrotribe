<script setup lang="ts">
import type { Folder } from '~/types/bookmark'

const props = defineProps<{
  folders: Folder[]
  selectedFolder: Folder | null
}>()

const emit = defineEmits<{
  (e: 'submit', folderId: string): void
  (e: 'cancel'): void
}>()

const targetFolderId = ref<string | null>(null)

const handleSubmit = () => {
  if (targetFolderId.value) {
    emit('submit', targetFolderId.value)
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="py-4">
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Select Destination Folder</label>
        <select
          v-model="targetFolderId"
          class="mt-1 block w-full rounded-md border-gray-300"
          required
        >
          <option
            v-for="folder in folders"
            :key="folder.id"
            :value="folder.id"
            :disabled="folder.id === selectedFolder?.id"
          >
            {{ folder.name }}
            {{ folder.id === selectedFolder?.id ? '(Current)' : '' }}
          </option>
        </select>
      </div>
    </div>

    <div class="flex justify-end gap-2">
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
      >
        Cancel
      </button>
      <button
        @click="handleSubmit"
        class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50"
        :disabled="!targetFolderId"
      >
        Move
      </button>
    </div>
  </div>
</template>
