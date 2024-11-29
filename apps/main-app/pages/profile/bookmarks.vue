<script setup lang="ts">
import { useConfirm } from 'primevue/useconfirm'
import type { BaseBookmark } from '~/types/bookmark'

const { bookmarks, loading, fetchBookmarks } = useBookmarks()
const { folders, currentFolder } = useFolderSystem()
const { selectedIds, toggleSelection, handleMove, handleDelete } = useBookmarkManager()

const searchQuery = ref('')
const selectedFolderId = ref<string | null>(null)
const isMoving = ref(false)
const includeSubfolders = ref(true)
const confirm = useConfirm()

// Computed
const availableFolders = computed(() => {
  if (!folders.value || !currentFolder.value) return []

  return folders.value
    .filter((f) => f.id !== currentFolder.value?.id)
    .map((f) => ({
      id: f.id,
      name: f.name,
    }))
})

// Methods
const clearSelection = () => {
  selectedIds.value = []
  selectedFolderId.value = null
}

const handleMoveSelected = async () => {
  if (!selectedFolderId.value || !selectedIds.value.length) return

  isMoving.value = true
  try {
    await handleMove(selectedFolderId.value)
    clearSelection()
  } finally {
    isMoving.value = false
  }
}

const handleDeleteSelected = () => {
  confirm.require({
    message: `Delete ${selectedIds.value.length} bookmark${selectedIds.value.length > 1 ? 's' : ''}?`,
    header: 'Confirm Delete',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      await handleDelete(selectedIds.value)
      clearSelection()
    },
  })
}

// Search handling
const handleSearchResults = (results: any[]) => {
  if (results.length === 0 && !searchQuery.value) {
    displayedBookmarks.value = bookmarks.value
  } else {
    displayedBookmarks.value = results.map((result) => result.item)
  }
}

const searchFuseOptions = {
  keys: [
    'metadata.title',
    'metadata.description',
    'metadata.author',
    'metadata.abstract',
    'metadata.name',
  ],
  threshold: 0.3,
  shouldSort: true,
}

// Use normalized bookmarks for display
const displayedBookmarks = ref<BaseBookmark[]>([])

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

// Initialize
onMounted(async () => {
  const session = await useSupabaseSession()
  if (session.value) {
    await fetchBookmarks({})
  }
})
</script>

<template>
  <div class="min-h-screen p-4 gap-4 max-w-[940px`x] flex flex-col mx-auto lg:p-8 lg:gap-8">
    <BookmarkViewFolder v-if="!searchQuery" />

    <!-- Search Bar & Actions -->
    <div
      class="flex items-center justify-between sticky top-4 z-40 bg-card p-4 border border-color rounded-lg foreground"
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

      <div class="flex items-center gap-4">
        <!-- Selection Actions -->
        <template v-if="selectedIds.length > 0">
          <span class="text-sm text-gray-600">{{ selectedIds.length }} selected</span>

          <div class="flex items-center gap-2">
            <PrimeSelect
              v-model="selectedFolderId"
              :options="availableFolders"
              option-label="name"
              option-value="id"
              placeholder="Move to folder..."
            />
            <PrimeButton
              size="small"
              :disabled="!selectedFolderId || isMoving"
              :loading="isMoving"
              @click="handleMoveSelected"
            >
              {{ isMoving ? 'Moving...' : 'Move' }}
            </PrimeButton>
          </div>

          <PrimeButton
            variant="destructive"
            size="sm"
            @click="handleDeleteSelected"
          >
            Delete
          </PrimeButton>

          <PrimeButton
            variant="ghost"
            size="sm"
            @click="clearSelection"
          >
            Clear
          </PrimeButton>
        </template>

        <Checkbox
          v-else-if="currentFolder"
          v-model="includeSubfolders"
          label="Include subfolders"
        />
      </div>
    </div>

    <!-- Content -->
    <div class="space-y-6">
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
      </div>

      <!-- Loading State -->
      <div
        v-if="loading"
        class="flex items-center justify-center h-64"
      >
        <Spinner class="w-8 h-8" />
      </div>

      <!-- Bookmarks Grid -->
      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8"
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
            class="relative group"
          >
            <BookmarkCard
              :bookmark="bookmark"
              :selectable="true"
              :is-selected="selectedIds.includes(bookmark.id)"
              @select="toggleSelection"
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
          class="w-12 h-12"
        />
        <p class="mt-4 text-lg">No bookmarks found</p>
        <p class="text-sm">
          {{ searchQuery ? 'Try a different search term' : 'Start by bookmarking some articles' }}
        </p>
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <PrimeConfirmPopup />
  </div>
</template>
