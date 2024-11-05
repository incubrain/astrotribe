<script setup lang="ts">
const { getFeatureUsage } = usePlan()

const { folders, loading: foldersLoading } = useFolderSystem()
const { bookmarks, loading: bookmarksLoading, fetchBookmarks, searchBookmarks } = useBookmarks()

const {
  selectedBookmarks,
  showMoveModal,
  handleNewFolder,
  handleMoveSubmit,
  handleDeleteBookmark,
  handleMoveBookmarks,
} = useBookmarkManager()

const {
  viewMode,
  searchQuery,
  includeSubfolders,
  showFolderPanel,
  showNewFolderModal,
  currentFolder,
  handleFolderSelect,
  toggleFolderPanel,
} = useBookmarkView()

// Only keep computed props and onMounted in the page
const folderUsage = computed(() => getFeatureUsage('BOOKMARK_FOLDERS', folders.value.length))
const displayedBookmarks = ref(bookmarks.value)

const toggleSelection = (id: string) => {
  const index = selectedBookmarks.value.indexOf(id)
  if (index === -1) {
    selectedBookmarks.value.push(id)
  } else {
    selectedBookmarks.value.splice(index, 1)
  }
}

const clearSelection = () => {
  selectedBookmarks.value = []
}

const handleBulkDelete = async () => {
  if (!selectedBookmarks.value.length) return

  await handleDeleteBookmark(selectedBookmarks.value)

  clearSelection()
}

const loading = computed(() => foldersLoading.value || bookmarksLoading.value)

onMounted(async () => {
  const session = await useSupabaseSession()

  // Only fetch if session is authenticated
  if (session.value) {
    await fetchBookmarks({})
  }
})

watch(useSupabaseUser(), async (newUser) => {
  if (newUser) {
    await fetchBookmarks({})
  } else {
    bookmarks.value = [] // Clear bookmarks when user logs out
  }
})

watch(searchQuery, () => {
  if (searchQuery.value) {
    const results = searchBookmarks(searchQuery.value)
    displayedBookmarks.value = results.map((result) => result.item)
  } else {
    displayedBookmarks.value = bookmarks.value
  }
})

watch(
  () => bookmarks.value,
  (newBookmarks) => {
    if (!searchQuery.value) {
      displayedBookmarks.value = newBookmarks
    }
  },
)
</script>

<template>
  <div class="min-h-screen p-4 space-y-4">
    <!-- Mobile Header -->
    <PrimeToolbar class="md:hidden background border-b">
      <template #start>
        <button
          class="p-2 text-gray-600 hover:text-gray-900"
          @click="toggleFolderPanel"
        >
          <Icon
            name="mdi:menu"
            size="24px"
          />
        </button>
      </template>
      <template #center>
        <h1 class="text-lg font-semibold">Bookmarks</h1>
      </template>
    </PrimeToolbar>

    <PrimeToolbar class="sticky top-0 z-40">
      <template #start>
        <button
          class="p-2 text-gray-600 hover:text-gray-900 hidden md:block"
          @click="toggleFolderPanel"
        >
          <Icon
            name="mdi:menu"
            size="24px"
          />
        </button>
      </template>

      <template #center>
        <div class="relative flex-1 max-w-md w-full">
          <PrimeInputText
            v-model="searchQuery"
            placeholder="Search bookmarks..."
            class="w-full flex-grow"
          >
            <template #end>
              <Icon
                name="mdi:magnify"
                class="text-gray-400"
              />
            </template>
          </PrimeInputText>
        </div>
      </template>

      <template #end>
        <div class="flex items-center gap-4">
          <!-- Selection Actions - Show when items are selected -->
          <template v-if="selectedBookmarks.length > 0">
            <span class="text-sm text-gray-600"> {{ selectedBookmarks.length }} selected </span>
            <PrimeButton
              severity="danger"
              size="small"
              @click="handleBulkDelete"
            >
              Delete
            </PrimeButton>
            <PrimeButton
              size="small"
              @click="showMoveModal = true"
            >
              Move to Folder
            </PrimeButton>
            <PrimeButton
              size="small"
              text
              @click="clearSelection"
            >
              Clear
            </PrimeButton>
          </template>

          <!-- Regular Actions -->
          <template v-else>
            <PrimeCheckbox
              v-if="currentFolder"
              v-model="includeSubfolders"
              :binary="true"
              label="Include subfolders"
            />
            <PrimeButton
              class="p-button-text hidden md:block"
              @click="toggleFolderPanel"
            >
              <Icon
                name="mdi:folder"
                class="mr-2"
              />
            </PrimeButton>
          </template>
        </div>
      </template>
    </PrimeToolbar>

    <div class="flex">
      <!-- Folder Sidebar - Hidden on mobile, shown in sidebar -->
      <PrimeDrawer
        v-model:visible="showFolderPanel"
        :modal="true"
        class="w-full max-w-xs"
        position="left"
      >
        <template #header>
          <h2 class="text-xl font-semibold">Folders</h2>
        </template>

        <div class="p-4 space-y-4">
          <!-- Folder Usage -->
          <div class="text-sm text-gray-600 mb-4">
            <span
              >{{ folderUsage.used }}/{{ folderUsage.isUnlimited ? '∞' : folderUsage.limit }}</span
            >
            folders used
          </div>

          <!-- Folder Tree -->
          <FolderTree
            :folders="folders"
            :selected-folder="currentFolder"
            @select="handleFolderSelect"
          />
        </div>
      </PrimeDrawer>

      <!-- Main Content -->
      <div class="flex-1 overflow-auto">
        <div class="max-w-7xl mx-auto space-y-6">
          <!-- Action Bar - Only show when items are selected -->

          <!-- Current Folder Info -->
          <div
            v-if="currentFolder"
            class="flex items-center gap-2"
          >
            <div
              class="w-3 h-3 rounded-full"
              :style="{ backgroundColor: currentFolder.color }"
            />
            <h2 class="text-xl font-semibold">{{ currentFolder.name }}</h2>
            <Icon
              v-if="currentFolder.is_favorite"
              name="mdi:star"
              class="text-yellow-400"
            />
          </div>

          <!-- Loading State -->
          <div
            v-if="loading"
            class="flex items-center justify-center h-64"
          >
            <PrimeProgressSpinner />
          </div>

          <!-- Bookmarks Grid -->
          <div
            v-else
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            <TransitionGroup
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 transform scale-95"
              enter-to-class="opacity-100 transform scale-100"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 transform scale-100"
              leave-to-class="opacity-0 transform scale-95"
            >
              <div
                v-for="bookmark in bookmarks"
                :key="bookmark.id"
                class="relative group flex"
              >
                <!-- Selection Overlay -->
                <div
                  class="absolute w-full h-10 inset-0 z-10 flex items-start justify-end p-2 bg-black/5"
                  :class="
                    selectedBookmarks.includes(bookmark.id)
                      ? 'opacity-100'
                      : 'opacity-0 group-hover:opacity-100 transition-opacity'
                  "
                >
                  <PrimeCheckbox
                    :model-value="selectedBookmarks.includes(bookmark.id)"
                    :binary="true"
                    @update:model-value="toggleSelection(bookmark.id)"
                  />
                </div>

                <!-- Use original NewsCard -->
                <NewsCard
                  :news="{
                    id: bookmark.content_id,
                    title: bookmark.metadata.title,
                    description: bookmark.metadata.description,
                    authorName: bookmark.metadata.author || 'Unknown',
                    featured_image: bookmark.metadata.thumbnail,
                    url: bookmark.metadata.url,
                    comments: 0,
                    score: 0,
                  }"
                  :class="{ 'opacity-75': selectedBookmarks.includes(bookmark.id) }"
                />
              </div>
            </TransitionGroup>
          </div>

          <!-- Empty State - Update condition -->
          <div
            v-if="!loading && (!bookmarks || bookmarks.length === 0)"
            class="flex flex-col items-center justify-center h-64 text-gray-500"
          >
            <Icon
              name="mdi:bookmark-outline"
              size="48"
            />
            <p class="mt-4 text-lg">No bookmarks found</p>
            <p class="text-sm">
              {{
                searchQuery ? 'Try a different search term' : 'Start by bookmarking some articles'
              }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- New Folder Modal -->
    <PrimeDialog
      v-model:visible="showNewFolderModal"
      modal
      header="New Folder"
      :style="{ width: '90vw', maxWidth: '500px' }"
    >
      <NewFolderForm
        :folders="folders"
        @submit="handleNewFolder"
        @cancel="showNewFolderModal = false"
      />
    </PrimeDialog>

    <!-- Move Bookmark Modal -->
    <PrimeDialog
      v-model:visible="showMoveModal"
      modal
      header="Move Bookmark"
      :style="{ width: '90vw', maxWidth: '500px' }"
    >
      <MoveBookmarkForm
        :folders="folders"
        :selected-folder="currentFolder"
        @submit="handleMoveSubmit"
        @cancel="showMoveModal = false"
      />
    </PrimeDialog>
  </div>
</template>

<style scoped>
@media (min-width: 768px) {
  :deep(.p-drawer) {
    position: relative;
    height: 100%;
    transform: none !important;
  }

  :deep(.p-drawer-mask) {
    display: none;
  }
}
</style>
