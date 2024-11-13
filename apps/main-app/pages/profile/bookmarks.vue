<script setup lang="ts">
import type { FuseResult } from 'fuse.js'
import type { Folder } from '~/composables/useFolderSystem'

const { getFeatureUsage } = usePlan()
const { folders, loading: foldersLoading } = useFolderSystem()
const { bookmarks, loading: bookmarksLoading, fetchBookmarks } = useBookmarks()
const {
  selectedBookmarks,
  showMoveModal,
  handleNewFolder,
  handleMoveSubmit,
  handleDeleteBookmark,
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

const folderUsage = computed(() => getFeatureUsage('BOOKMARK_FOLDERS', folders.value.length))
const displayedBookmarks = ref<typeof bookmarks.value>([])

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

// Search configuration
const searchFuseOptions = {
  keys: ['metadata.title', 'metadata.description', 'metadata.author'],
  threshold: 0.3,
  shouldSort: true,
}

// Handle search results
const handleSearchResults = (results: FuseResult<any>[]) => {
  if (results.length === 0 && !searchQuery.value) {
    displayedBookmarks.value = bookmarks.value
  } else {
    displayedBookmarks.value = results.map((result) => result.item)
  }
}

const loading = computed(() => foldersLoading.value || bookmarksLoading.value)

onMounted(async () => {
  const session = await useSupabaseSession()
  if (session.value) {
    await fetchBookmarks({})
  }
})

// Update initial display when bookmarks change
watch(
  () => bookmarks.value,
  (newBookmarks) => {
    if (!searchQuery.value) {
      displayedBookmarks.value = newBookmarks
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="min-h-screen p-4 space-y-4">
    <BookmarkViewFolder v-if="!searchQuery" />

    <!-- Simplified toolbar without left hamburger -->
    <PrimeToolbar
      class="sticky top-0 z-40"
      :pt="{
        start: 'flex-grow',
      }"
    >
      <template #start>
        <div class="w-full max-w-xl">
          <FuzzySearch
            v-model="searchQuery"
            :data="bookmarks"
            :fuse-options="searchFuseOptions"
            placeholder="Search bookmarks..."
            class="w-full"
            @results="handleSearchResults"
          />
        </div>
      </template>

      <template #end>
        <div class="flex items-center gap-4">
          <!-- Selection Actions -->
          <template v-if="selectedBookmarks.length > 0">
            <span class="text-sm text-gray-600">{{ selectedBookmarks.length }} selected</span>
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
          </template>
        </div>
      </template>
    </PrimeToolbar>

    <div class="flex">
      <!-- Main Content -->
      <div class="flex-1 overflow-auto">
        <div class="max-w-7xl mx-auto space-y-6">
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
                v-for="bookmark in displayedBookmarks"
                :key="bookmark.id"
                class="relative group flex"
              >
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

          <!-- Empty State -->
          <div
            v-if="!loading && (!displayedBookmarks || displayedBookmarks.length === 0)"
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

    <PrimeDialog
      v-model:visible="showMoveModal"
      modal
      header="Move Bookmark"
      :style="{ width: '90vw', maxWidth: '500px' }"
    >
      <BookmarkFormMove
        :folders="folders"
        :selected-folder="currentFolder"
        @submit="(folder: Folder) => handleMoveSubmit(folder)"
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
