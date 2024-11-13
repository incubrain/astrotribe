<template>
  <form
    class="flex flex-col gap-8"
    @submit.prevent="handleSubmit"
  >
    <div>
      <label class="block text-sm font-medium">Name</label>
      <PrimeInputText
        v-model="folderData.name"
        type="text"
        class="mt-1 block w-full rounded-md"
        required
      />
    </div>

    <div v-if="!existingFolder">
      <label class="block text-sm font-medium">Parent Folder</label>
      <PrimeSelect
        v-model="folderData.parent_id"
        class="w-full rounded-md border-color mt-1"
      >
        <option :value="null">No parent</option>
        <option
          v-for="folder in folders"
          :key="folder.id"
          :value="folder.id"
        >
          {{ folder.name }}
        </option>
      </PrimeSelect>
    </div>

    <div class="flex items-center gap-4">
      <label class="block text-sm font-medium">Color</label>
      <div class="mt-1 flex items-center gap-2">
        <PrimeColorPicker v-model="folderData.color" />
        <span class="text-sm">{{ folderData.color }}</span>
      </div>
      <label class="flex items-center">
        <PrimeCheckbox v-model="folderData.is_favorite" />
        <span class="ml-2 text-sm">Add to favorites</span>
      </label>

      <label class="flex items-center">
        <PrimeCheckbox v-model="folderData.is_default" />
        <span class="ml-2 text-sm">Set as default</span>
      </label>
    </div>

    <div class="flex justify-between">
      <PrimeButton
        v-if="existingFolder"
        severity="danger"
        @click="confirmDelete"
      >
        Delete Folder
      </PrimeButton>
      <div
        v-else
        class="flex-grow"
      />

      <div class="flex gap-2">
        <PrimeButton
          severity="secondary"
          @click="$emit('cancel')"
        >
          Cancel
        </PrimeButton>
        <PrimeButton>
          {{ existingFolder ? 'Save Changes' : 'Create Folder' }}
        </PrimeButton>
      </div>
    </div>
  </form>

  <!-- Delete Confirmation Dialog -->
  <PrimeDialog
    v-if="existingFolder"
    v-model:visible="showDeleteConfirm"
    modal
    header="Delete Folder"
    :style="{ width: '90vw', maxWidth: '400px' }"
  >
    <p class="mb-4">Are you sure you want to delete this folder? This action cannot be undone.</p>
    <template #footer>
      <PrimeButton
        severity="secondary"
        text
        @click="showDeleteConfirm = false"
      >
        Cancel
      </PrimeButton>
      <PrimeButton
        severity="danger"
        @click="handleDelete"
      >
        Delete
      </PrimeButton>
    </template>
  </PrimeDialog>
</template>

<script setup lang="ts">
import type { Folder } from '~/types/folder'

interface Props {
  folders?: Folder[]
  existingFolder?: Folder
}

const props = withDefaults(defineProps<Props>(), {
  folders: () => [],
  existingFolder: undefined,
})

interface FolderData {
  id?: string
  name: string
  parent_id: string | null
  color: string
  is_favorite: boolean
  is_default: boolean
}

const emit = defineEmits<{
  (e: 'submit', folder: FolderData): void
  (e: 'delete', id: string): void
  (e: 'cancel'): void
}>()

// Initialize form data based on whether we're editing or creating
const folderData = ref<FolderData>(
  props.existingFolder
    ? { ...props.existingFolder }
    : {
        name: '',
        parent_id: null,
        color: '#94A3B8',
        is_favorite: false,
        is_default: false,
      },
)

const showDeleteConfirm = ref(false)

const handleSubmit = () => {
  emit('submit', folderData.value)
}

const confirmDelete = () => {
  showDeleteConfirm.value = true
}

const handleDelete = () => {
  if (props.existingFolder) {
    emit('delete', props.existingFolder.id)
    showDeleteConfirm.value = false
  }
}
</script>
