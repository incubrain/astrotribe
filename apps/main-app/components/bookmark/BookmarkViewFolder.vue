<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold">Folders</h2>
      <PrimeButton
        class="p-button-primary"
        @click="showNewFolderModal = true"
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
        @click="handleEditFolder(folder)"
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

    <!-- New Folder Modal -->
    <PrimeDialog
      v-model:visible="showNewFolderModal"
      modal
      header="New Folder"
      :style="{ width: '90vw', maxWidth: '500px' }"
    >
      <FolderForm
        :folders="folders"
        @submit="handleNewFolder"
        @cancel="showNewFolderModal = false"
      />
    </PrimeDialog>

    <!-- Edit Folder Modal -->
    <PrimeDialog
      v-model:visible="showEditFolderModal"
      modal
      header="Edit Folder"
      :style="{ width: '90vw', maxWidth: '500px' }"
    >
      <FolderForm
        :folders="folders"
        :existing-folder="selectedFolder"
        @submit="handleUpdateFolder"
        @delete="handleDeleteFolder"
        @cancel="showEditFolderModal = false"
      />
    </PrimeDialog>
  </div>
</template>

<script setup lang="ts">
import type { Folder } from '~/types/folder'

const { folders, updateFolder, deleteFolder } = useFolderSystem()
const { bookmarks } = useBookmarks()
const { getFeatureUsage } = usePlan()

const showNewFolderModal = ref(false)
const showEditFolderModal = ref(false)
const selectedFolder = ref<Folder | null>(null)

const folderUsage = computed(() => getFeatureUsage('BOOKMARK_FOLDERS', folders.value.length))

// Compute bookmark count for each folder
const getFolderBookmarkCount = (folderId: string) => {
  return bookmarks.value.filter((bookmark) => bookmark.folder_id === folderId).length
}

// Handle folder edit
const handleEditFolder = (folder: Folder) => {
  selectedFolder.value = folder
  showEditFolderModal.value = true
}

// Handle folder update
const handleUpdateFolder = async (updatedFolder: Folder) => {
  await updateFolder(updatedFolder.id, updatedFolder)
  showEditFolderModal.value = false
  selectedFolder.value = null
}

// Handle folder deletion
const handleDeleteFolder = async (folderId: string) => {
  await deleteFolder(folderId)
  showEditFolderModal.value = false
  selectedFolder.value = null
}

// Handle new folder creation
const handleNewFolder = async (folderData: Partial<Folder>) => {
  const { createFolder } = useFolderSystem()
  await createFolder(folderData)
  showNewFolderModal.value = false
}
</script>
