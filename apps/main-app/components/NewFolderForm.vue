<!-- components/NewFolderForm.vue -->
<script setup lang="ts">
import type { Folder } from '@types/folder'

interface NewFolder {
  name: string
  parent_id: string | null
  color: string
  is_favorite: boolean
  is_default: boolean
}

const props = defineProps<{
  folders: Folder[]
}>()

const emit = defineEmits<{
  (e: 'submit', folder: NewFolder): void
  (e: 'cancel'): void
}>()

const newFolder = ref<NewFolder>({
  name: '',
  parent_id: null,
  color: '#94A3B8',
  is_favorite: false,
  is_default: false,
})

const handleSubmit = () => {
  emit('submit', { ...newFolder.value })
  // Reset form
  newFolder.value = {
    name: '',
    parent_id: null,
    color: '#94A3B8',
    is_favorite: false,
    is_default: false,
  }
}
</script>

<template>
  <form
    @submit.prevent="handleSubmit"
    class="space-y-4"
  >
    <div>
      <label class="block text-sm font-medium text-gray-700">Name</label>
      <input
        v-model="newFolder.name"
        type="text"
        class="mt-1 block w-full rounded-md border-gray-300"
        required
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Parent Folder</label>
      <select
        v-model="newFolder.parent_id"
        class="mt-1 block w-full rounded-md border-gray-300"
      >
        <option :value="null">No parent</option>
        <option
          v-for="folder in folders"
          :key="folder.id"
          :value="folder.id"
        >
          {{ folder.name }}
        </option>
      </select>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Color</label>
      <div class="mt-1 flex items-center gap-2">
        <input
          v-model="newFolder.color"
          type="color"
          class="h-8 w-8 rounded cursor-pointer"
        />
        <span class="text-sm text-gray-600">{{ newFolder.color }}</span>
      </div>
    </div>

    <div class="flex items-center gap-4">
      <label class="flex items-center">
        <input
          v-model="newFolder.is_favorite"
          type="checkbox"
          class="rounded border-gray-300"
        />
        <span class="ml-2 text-sm text-gray-600">Add to favorites</span>
      </label>

      <label class="flex items-center">
        <input
          v-model="newFolder.is_default"
          type="checkbox"
          class="rounded border-gray-300"
        />
        <span class="ml-2 text-sm text-gray-600">Set as default</span>
      </label>
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
        type="submit"
        class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
      >
        Create Folder
      </button>
    </div>
  </form>
</template>
