<!-- BookmarksList -->
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
              class="rounded border border-color mr-2"
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
          @select="toggleBookmarkSelection(bookmark.id)"
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
  </div>
</template>

<script setup lang="ts">
const bookmarkStore = useBookmarkStore()
const folderStore = useFolderStore()

const currentFolderId = ref<string | null>(null)
const includeSubfolders = ref(true)
const searchQuery = ref('')
const selectedBookmarks = ref<string[]>([])
const showMoveDialog = ref(false)
const targetFolderId = ref<string | null>(null)

const currentFolder = computed(() =>
  folderStore.folders.find((f) => f.id === currentFolderId.value),
)

const displayedBookmarks = computed(() => {
  if (!searchQuery.value) return bookmarkStore.bookmarks
  return bookmarkStore.searchBookmarks(searchQuery.value)
})

const handleFolderSelect = async (folder: Folder) => {
  currentFolderId.value = folder.id
  await bookmarkStore.fetchBookmarks({
    folder_id: folder.id,
    include_subfolders: includeSubfolders.value,
  })
}

// Watch for changes and update bookmarks
watch(includeSubfolders, async () => {
  if (currentFolderId.value) {
    await bookmarkStore.fetchBookmarks({
      folder_id: currentFolderId.value,
      include_subfolders: includeSubfolders.value,
    })
  }
})

// Initialize data
onMounted(async () => {
  const defaultFolder = folderStore.getDefaultFolder
  if (defaultFolder) {
    currentFolderId.value = defaultFolder.id
    await handleFolderSelect(defaultFolder)
  }
})

const toggleBookmarkSelection = (bookmarkId: string) => {
  const index = selectedBookmarks.value.indexOf(bookmarkId)
  if (index === -1) {
    selectedBookmarks.value.push(bookmarkId)
  } else {
    selectedBookmarks.value.splice(index, 1)
  }
}
</script>
