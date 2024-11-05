<template>
  <div class="flex gap-6">
    <!-- Folder Sidebar -->
    <div class="w-64 flex-shrink-0">
      <FolderTree
        v-model:selected="currentFolderId"
        @select="handleFolderSelect"
      />
    </div>

    <!-- Bookmarks Content -->
    <div class="flex-1 space-y-4">
      <!-- Folder Header -->
      <div
        v-if="currentFolder"
        class="flex items-center justify-between"
      >
        <div class="flex items-center gap-2">
          <div
            class="w-3 h-3 rounded-full"
            :style="{ backgroundColor: currentFolder.color }"
          />
          <h2 class="text-lg font-medium">{{ currentFolder.name }}</h2>
          <span
            v-if="currentFolder.is_favorite"
            class="text-yellow-400"
          >
            <Icon
              name="mdi:star"
              class="w-4 h-4"
            />
          </span>
        </div>

        <!-- Folder Actions -->
        <div class="flex items-center gap-2">
          <label class="flex items-center text-sm text-gray-600">
            <input
              v-model="includeSubfolders"
              type="checkbox"
              class="rounded border-gray-300 mr-2"
            />
            Include subfolders
          </label>
        </div>
      </div>

      <!-- Search -->
      <div class="relative">
        <Icon
          name="mdi:magnify"
          class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
        />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search bookmarks..."
          class="w-full pl-10 pr-4 py-2 rounded-lg border"
        />
      </div>

      <!-- Bookmarks Grid -->
      <div
        v-if="!loading"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <BookmarkCard
          v-for="bookmark in displayedBookmarks"
          :key="bookmark.id"
          :bookmark="bookmark"
          :selected="selectedBookmarks.includes(bookmark.id)"
          @select="toggleBookmarkSelection"
          @move="showMoveDialog = true"
        />
      </div>

      <div
        v-else
        class="flex items-center justify-center h-64"
      >
        <Icon
          name="mdi:loading"
          class="w-8 h-8 text-gray-400 animate-spin"
        />
      </div>
    </div>

    <!-- Move Bookmarks Dialog -->
    <PrimeDialog v-model:show="showMoveDialog">
      <PrimeDialogContent>
        <PrimeDialogHeader>
          <PrimeDialogTitle>Move Bookmarks</PrimeDialogTitle>
        </PrimeDialogHeader>

        <div class="py-4">
          <FolderTree
            v-model:selected="targetFolderId"
            :exclude-folders="[currentFolderId]"
          />
        </div>

        <PrimeDialogFooter>
          <button
            @click="showMoveDialog = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="handleMoveBookmarks"
            :disabled="!targetFolderId"
            class="ml-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            Move
          </button>
        </PrimeDialogFooter>
      </PrimeDialogContent>
    </PrimeDialog>
  </div>
</template>

<script setup lang="ts">
const { bookmarks, loading, fetchBookmarks, moveBookmarks, searchBookmarks } = useBookmarks()

const { folders, getFavorites } = useFolderSystem()

const currentFolderId = ref<string | null>(null)
const includeSubfolders = ref(true)
const searchQuery = ref('')
const selectedBookmarks = ref<string[]>([])
const showMoveDialog = ref(false)
const targetFolderId = ref<string | null>(null)

const currentFolder = computed(() => folders.value.find((f) => f.id === currentFolderId.value))

const displayedBookmarks = computed(() => {
  if (!searchQuery.value) return bookmarks.value
  return searchBookmarks(searchQuery.value)
})

const handleFolderSelect = async (folder: Folder) => {
  currentFolderId.value = folder.id
  await fetchBookmarks({
    folder_id: folder.id,
    include_subfolders: includeSubfolders.value,
  })
}

const toggleBookmarkSelection = (bookmarkId: string) => {
  const index = selectedBookmarks.value.indexOf(bookmarkId)
  if (index === -1) {
    selectedBookmarks.value.push(bookmarkId)
  } else {
    selectedBookmarks.value.splice(index, 1)
  }
}

const handleMoveBookmarks = async () => {
  if (!targetFolderId.value) return

  await moveBookmarks(selectedBookmarks.value, targetFolderId.value)
  selectedBookmarks.value = []
  showMoveDialog.value = false
  targetFolderId.value = null
}

watch(includeSubfolders, async () => {
  if (currentFolderId.value) {
    await fetchBookmarks({
      folder_id: currentFolderId.value,
      include_subfolders: includeSubfolders.value,
    })
  }
})

onMounted(async () => {
  // Start with default folder if exists
  const defaultFolder = folders.value.find((f) => f.is_default)
  if (defaultFolder) {
    currentFolderId.value = defaultFolder.id
    await handleFolderSelect(defaultFolder)
  } else {
    await fetchBookmarks({})
  }
})
</script>
