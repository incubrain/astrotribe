<template>
  <div class="space-y-6">
    <PrimeConfirmPopup />

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
        v-for="folder in folderStore.folders"
        :key="folder.id"
        class="p-4 hover:shadow-md transition-shadow bg-card border border-color rounded-lg cursor-pointer group"
        :class="{ 'bg-primary-900': currentFolderId === folder.id }"
        @click="handleFolderSelect(folder)"
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
            <button
              class="p-1 hover:text-primary-500"
              @click.stop="handleEditClick(folder)"
            >
              <Icon
                name="mdi:pencil"
                class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </button>
          </div>
        </div>
        <p class="mt-2 text-sm text-muted-foreground">
          {{ bookmarkStore.getBookmarkCount(folder.id) }} bookmarks
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

const folderStore = useFolderStore()
const bookmarkStore = useBookmarkStore()
const { getFeatureUsage } = usePlan()

const showModal = ref(false)
const selectedFolder = ref<Folder | null>(null)
const currentFolderId = ref<string | null>(null)

const folderUsage = computed(() => getFeatureUsage('BOOKMARK_FOLDERS', folderStore.folders.length))

const handleFolderSelect = async (folder: Folder) => {
  currentFolderId.value = folder.id
  folderStore.setSelectedFolder(folder.id)

  // Fetch bookmarks for this folder
  await bookmarkStore.fetchBookmarks({
    folder_id: folder.id,
    include_subfolders: true,
  })
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
  try {
    if (selectedFolder.value) {
      await folderStore.updateFolder(selectedFolder.value.id, data)
    } else {
      await folderStore.createFolder(data)
    }
    closeModal()
  } catch (error) {
    console.error('Error handling folder submission:', error)
  }
}

const handleDelete = async () => {
  if (selectedFolder.value) {
    const success = await folderStore.deleteFolder(selectedFolder.value.id)
    if (success) {
      if (currentFolderId.value === selectedFolder.value.id) {
        currentFolderId.value = null
      }
      await bookmarkStore.fetchBookmarks()
      closeModal()
    }
  }
}

onMounted(async () => {
  try {
    // Fetch folders first
    await folderStore.fetchFolders()

    // Then fetch all bookmarks to get initial counts
    await bookmarkStore.fetchBookmarks()
  } catch (error) {
    console.error('Error initializing data:', error)
  }
})
</script>
