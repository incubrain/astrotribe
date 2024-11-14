<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold">Folders</h2>
      <PrimeButton
        class="p-button-primary"
        @click="showModal = true"
      >
        <div class="flex items-center gap-2">
          <Icon name="mdi:folder-plus" />
          <span
            >New Folder ({{ folderUsage.used }}/{{
              folderUsage.isUnlimited ? '∞' : folderUsage.limit
            }})</span
          >
        </div>
      </PrimeButton>
    </div>

    <!-- Folders Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div
        v-for="folder in folders"
        :key="folder.id"
        class="p-4 hover:shadow-md transition-shadow bg-card border border-color rounded-lg cursor-pointer group"
        @click="handleEditClick(folder)"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div
              class="w-3 h-3 rounded-full"
              :style="{ backgroundColor: folder.color }"
            />
            <h3 class="font-medium">{{ folder.name }}</h3>
            <Icon
              v-if="folder.is_favorite"
              name="mdi:star"
              class="w-4 h-4 text-yellow-400"
            />
          </div>
          <div class="flex items-center gap-2">
            <span
              v-if="folder.is_default"
              class="text-sm text-muted-foreground"
            >
              Default
            </span>
            <Icon
              name="mdi:pencil"
              class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
        <p class="mt-2 text-sm text-muted-foreground">
          {{ getFolderBookmarkCount(folder.id) }} bookmarks
        </p>
      </div>
    </div>

    <!-- Modal for both create and edit -->
    <PrimeDialog
      v-model:visible="showModal"
      :modal="true"
      :header="selectedFolder ? 'Edit Folder' : 'New Folder'"
      :style="{ width: '90vw', maxWidth: '500px' }"
    >
      <FolderForm
        :folder="selectedFolder"
        @submit="handleSubmit"
        @delete="handleDelete"
        @cancel="closeModal"
      />
    </PrimeDialog>
  </div>
</template>

<script setup lang="ts">
import type { Folder } from '~/types/folder'

const { folders, createFolder, updateFolder, deleteFolder } = useFolderSystem()
const { bookmarks } = useBookmarks()
const { getFeatureUsage } = usePlan()

const showModal = ref(false)
const selectedFolder = ref<Folder | null>(null)

const folderUsage = computed(() => getFeatureUsage('BOOKMARK_FOLDERS', folders.value.length))

const getFolderBookmarkCount = (folderId: string) => {
  return bookmarks.value.filter((bookmark) => bookmark.folder_id === folderId).length
}

const handleEditClick = (folder: Folder) => {
  selectedFolder.value = folder
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedFolder.value = null
}

const handleSubmit = async (data: Partial<Folder>) => {
  if (selectedFolder.value) {
    await updateFolder(selectedFolder.value.id, data)
  } else {
    await createFolder(data)
  }
  closeModal()
}

const handleDelete = async () => {
  if (selectedFolder.value) {
    await deleteFolder(selectedFolder.value.id)
    closeModal()
  }
}
</script>
