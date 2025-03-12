<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useConfirm } from 'primevue/useconfirm'
import EmptyState from '../../components/EmptyState.vue'

const confirm = useConfirm()
const bookmarkStore = useBookmarkStore()
const folderStore = useFolderStore()
const bookmarkManager = useBookmarkManager()

const { selectedFolderId, includeSubfolders, folders } = storeToRefs(folderStore)
const { bookmarks, loading } = storeToRefs(bookmarkStore)

const searchQuery = ref('')
const searchResults = ref<any[]>([])
const isMoving = ref(false)
const movingFolderId = ref()

const searchFuseOptions = {
  keys: ['metadata.title', 'metadata.description', 'metadata.author'],
  threshold: 0.3,
  shouldSort: true,
}

// Computed properties
const currentFolder = computed(() => {
  const folder = folders.value?.find((f) => f.id === selectedFolderId.value)
  console.log('Current folder computed:', {
    selectedId: selectedFolderId.value,
    folder,
  })
  return folder
})

const filteredBookmarks = computed(() => {
  console.log('Computing filtered bookmarks:', {
    hasBookmarks: bookmarks.value?.length,
    selectedFolder: selectedFolderId.value,
    includeSubfolders: includeSubfolders.value,
    searchQuery: searchQuery.value,
  })

  let filtered = bookmarks.value ?? []

  // Filter by folder
  if (selectedFolderId.value) {
    filtered = filtered.filter((bookmark) => {
      const matches = bookmark.folder_id === selectedFolderId.value
      return matches
    })
  }

  console.log('After folder filter:', filtered.length)

  // Filter by search
  if (searchQuery.value && searchResults.value?.length) {
    return searchResults.value
  }

  return filtered
})

// Methods
const clearSelection = () => {
  bookmarkManager.clearSelection()
  movingFolderId.value = null
}

const handleMoveSelected = async () => {
  if (!movingFolderId.value || !bookmarkManager.selectedIds.value.length) return

  isMoving.value = true
  try {
    await bookmarkManager.handleMove(movingFolderId.value)
    bookmarkManager.clearSelection()
  } finally {
    movingFolderId.value = null
    isMoving.value = false
  }
}

const handleDeleteSelected = () => {
  confirm.require({
    message: `Delete ${bookmarkManager.selectedIds.value.length} bookmark${bookmarkManager.selectedIds.value.length > 1 ? 's' : ''}?`,
    header: 'Confirm Delete',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      await bookmarkManager.handleDelete(bookmarkManager.selectedIds.value)
      clearSelection()
    },
  })
}

const handleSearchResults = (results: FuseResult<any>[]) => {
  console.log('Search results:', results.length)
  searchResults.value = results.map((result) => result.item)
}

onMounted(async () => {
  console.log('Component mounted, fetching data...')
  await Promise.all([folderStore.fetchFolders(), bookmarkStore.fetchBookmarks()])
  console.log('Initial data loaded:', {
    folders: folders.value?.length,
    bookmarks: bookmarks.value?.length,
  })

  const defaultFolder = folderStore.getDefaultFolder
  console.log('Default folder:', defaultFolder)

  if (defaultFolder) {
    folderStore.setSelectedFolder(defaultFolder.id)
    console.log('Set default folder:', defaultFolder.id)
  }
})

// Also modify the empty check to add logging
const isEmpty = computed(() => {
  const empty =
    !loading.value && (!filteredBookmarks.value?.length || filteredBookmarks.value.length === 0)
  console.log('Checking empty state:', {
    loading: loading.value,
    filteredLength: filteredBookmarks.value?.length,
    isEmpty: empty,
  })
  return empty
})
</script>

<template>
  <div class="min-h-screen p-4 gap-4 max-w-[940px] flex flex-col mx-auto lg:p-8 lg:gap-8">
    <!-- <BookmarkViewFolder v-if="!searchQuery" /> -->

    <!-- Search Bar & Actions -->
    <div
      class="flex flex-col gap-4 items-center justify-between z-40 bg-card p-4 border border-color rounded-lg foreground"
    >
      <div class="w-full">
        <FuzzySearch
          v-model="searchQuery"
          :data="bookmarks"
          :fuse-options="searchFuseOptions"
          placeholder="Search bookmarks..."
          class="w-full"
          @results="handleSearchResults"
        />
      </div>

      <!-- Selection Actions -->
      <template v-if="bookmarkManager.selectionCount">
        <div class="flex w-full justify-between flex-row">
          <div
            v-if="currentFolder"
            class="flex items-center gap-2 flex-grow"
          >
            <div
              class="w-3 h-3 rounded-full"
              :style="{ backgroundColor: currentFolder.color }"
            />
            <h2 class="text-xl font-semibold">{{ currentFolder.name }}</h2>
          </div>
          <div class="flex items-center gap-2 lg:gap-4">
            <!-- Selection count -->
            <span class="text-sm text-gray-600 hidden sm:inline">
              {{ bookmarkManager.selectionCount }} selected
            </span>
            <span class="text-sm text-gray-600 sm:hidden">
              {{ bookmarkManager.selectionCount }}
            </span>

            <!-- Move to folder dropdown -->
            <!-- <PrimeSelect
              v-model="movingFolderId"
              :options="folders.filter((folder) => folder.id !== currentFolder?.id)"
              option-label="name"
              option-value="id"
              placeholder="Move to..."
              class="min-w-[120px] lg:min-w-[200px]"
            /> -->

            <!-- Move button -->
            <!-- <PrimeButton
              :disabled="!movingFolderId || !bookmarkManager.selectedIds.value.length || isMoving"
              :loading="isMoving"
              class="!p-2 lg:!p-3"
              @click="handleMoveSelected"
            >
              <Icon
                name="mdi:folder-move"
                class="w-5 h-5 lg:mr-2"
              />
              <span class="hidden lg:inline">
                {{ isMoving ? 'Moving...' : 'Move' }}
              </span>
            </PrimeButton> -->

            <!-- Delete button -->
            <PrimeButton
              :disabled="!bookmarkManager.selectedIds.value.length"
              severity="danger"
              class="!p-2 lg:!p-3"
              @click="handleDeleteSelected"
            >
              <Icon
                name="mdi:trash-can"
                class="w-5 h-5 lg:mr-2"
              />
              <span class="hidden lg:inline">Delete</span>
            </PrimeButton>

            <!-- Clear selection button -->
            <PrimeButton
              :disabled="!bookmarkManager.selectedIds.value.length && !movingFolderId"
              severity="secondary"
              class="!p-2 lg:!p-3"
              @click="clearSelection"
            >
              <Icon
                name="mdi:close"
                class="w-5 h-5 lg:mr-2"
              />
              <span class="hidden lg:inline">Clear</span>
            </PrimeButton>
          </div>
        </div>
      </template>
    </div>

    <!-- Content -->
    <div class="space-y-6">
      <!-- Loading State -->
      <div
        v-if="bookmarkStore.loading"
        class="flex items-center justify-center h-64"
      >
        <Icon
          name="mdi:loading"
          class="w-8 h-8 text-gray-400 animate-spin"
        />
      </div>

      <!-- Bookmarks Grid -->
      <BookmarkGridAnimated
        v-else
        :bookmarks="filteredBookmarks"
        :is-selected="bookmarkManager.isSelected"
        :toggle-selection="bookmarkManager.toggleSelection"
      />

      <!-- Empty State -->
      <EmptyState
        v-show="isEmpty"
        :is-searching="searchQuery !== ''"
        class="flex flex-col items-center justify-center h-64 text-gray-500"
      />

      <!-- Confirmation Dialog -->
    </div>
    <PrimeConfirmPopup />
  </div>
</template>
