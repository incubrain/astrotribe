<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { useDebounce, useRoute, watch, ref } from '#imports'

interface Section {
  id: string
  title: string
  content: string
}

const showOverlay = ref(false)
const searchQuery = ref('')
const searchResults = ref<Section[]>([])
const isLoading = ref(false)

// Function to search blog sections
const queryCollectionSearchSections = async (collection: string) => {
  const sections = await queryContent(collection).find()
  return sections || []
}

// Debounced search function
const debouncedSearch = useDebounce(async () => {
  if (!searchQuery.value || searchQuery.value.length < 2) {
    searchResults.value = []
    return
  }

  isLoading.value = true
  try {
    const sections = await queryCollectionSearchSections('blog')
    const query = searchQuery.value.toLowerCase()

    // Filter and limit results
    searchResults.value = sections
      .filter(
        (section) =>
          section.title.toLowerCase().includes(query) ||
          section.content.toLowerCase().includes(query),
      )
      .slice(0, 5)
  } catch (error) {
    console.error('Search error:', error)
    searchResults.value = []
  } finally {
    isLoading.value = false
  }
}, 300)

// Watch for changes to search query
watch(searchQuery, () => {
  debouncedSearch()
})

// Close search on escape key
useEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    showOverlay.value = false
  }
})

// Close search on route change
watch(
  () => useRoute().fullPath,
  () => {
    showOverlay.value = false
  },
)
</script>

<template>
  <div>
    <!-- Search Button -->
    <button
      class="flex items-center gap-2 text-sm bg-primary-900 hover:bg-primary-800 text-white px-4 py-2 rounded-full"
      @click="showOverlay = true"
    >
      <Icon
        name="i-lucide-search"
        class="w-4 h-4"
      />
      <span>Search Blog</span>
    </button>

    <!-- Search Overlay -->
    <Teleport to="body">
      <div
        v-if="showOverlay"
        class="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-start justify-center pt-20"
        @click.self="showOverlay = false"
      >
        <div class="bg-primary-950 rounded-lg w-full max-w-2xl shadow-lg overflow-hidden">
          <!-- Search Input -->
          <div class="p-4 border-b border-primary-800">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search blog..."
                class="w-full bg-primary-900 text-white border-none rounded-md px-4 py-3 pl-10 focus:ring-2 focus:ring-primary-600 focus:outline-none"
                autofocus
                @keyup.escape="showOverlay = false"
              />
              <Icon
                name="i-lucide-search"
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
              />
            </div>
          </div>

          <!-- Search Results -->
          <div class="max-h-[70vh] overflow-y-auto">
            <div
              v-if="isLoading"
              class="p-6 text-center text-gray-400"
            >
              <Icon
                name="i-lucide-loader"
                class="w-6 h-6 animate-spin"
              />
              <p class="mt-2">Searching...</p>
            </div>

            <div
              v-else-if="searchQuery && !searchResults.length"
              class="p-6 text-center text-gray-400"
            >
              <Icon
                name="i-lucide-search-x"
                class="w-6 h-6 mx-auto"
              />
              <p class="mt-2">No results found</p>
            </div>

            <div
              v-else-if="!searchQuery"
              class="p-6 text-center text-gray-400"
            >
              <Icon
                name="i-lucide-search"
                class="w-6 h-6 mx-auto"
              />
              <p class="mt-2">Type to search</p>
            </div>

            <div
              v-else
              class="divide-y divide-primary-800"
            >
              <NuxtLink
                v-for="result in searchResults"
                :key="result.id"
                :to="result.id"
                class="block p-4 hover:bg-primary-900 transition"
                @click="showOverlay = false"
              >
                <h3 class="font-medium text-white">{{ result.title }}</h3>
                <p class="mt-1 text-sm text-gray-400 line-clamp-2">
                  {{ result.content.substring(0, 150) }}...
                </p>
              </NuxtLink>
            </div>
          </div>

          <!-- Footer -->
          <div class="p-3 bg-primary-900 text-center text-xs text-gray-400">
            Press <kbd class="px-2 py-1 bg-primary-800 rounded">ESC</kbd> to close
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
