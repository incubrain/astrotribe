<script setup lang="ts">
import { useDebounceFn, useEventListener } from '@vueuse/core'
import Fuse from 'fuse.js'
import type { IFuseOptions } from 'fuse.js'

interface Section {
  id: string
  title: string
  content: string
  [key: string]: any // Allow additional properties for flexibility
}

// Define collection types to support blog and/or global search
type CollectionName = string | string[]

const props = withDefaults(
  defineProps<{
    placeholder?: string
    resultLimit?: number
    debounceMs?: number
    fuseOptions?: IFuseOptions<Section>
    collection?: CollectionName // Collection(s) to search in
    buttonLabel?: string // Customizable button label
    autoNavigate?: boolean // Whether to automatically navigate on result selection
    buttonClass?: string // Custom button class
  }>(),
  {
    placeholder: 'Search blog...',
    resultLimit: 5,
    debounceMs: 300,
    collection: 'blog',
    buttonLabel: 'Search Blog',
    autoNavigate: true,
    buttonClass:
      'flex items-center gap-2 text-sm bg-primary-900 hover:bg-primary-800 text-white px-4 py-2 rounded-full',
  },
)

const emit = defineEmits<{
  search: [query: string]
  select: [result: Section]
}>()

// No need for default computed values as we're using withDefaults now

// States
const isShowOverlay = ref(false)
const resultLimit = ref(props.resultLimit)
const searchQuery = ref('')
const searchResults = ref<Section[]>([])
const isLoading = ref(false)

// Fetch sections from one or multiple collections
const fetchSections = async () => {
  try {
    // Handle both single collection and multiple collections
    if (Array.isArray(props.collection)) {
      // Fetch from multiple collections
      const results = await Promise.all(
        props.collection.map((col) => queryCollectionSearchSections(col)),
      )
      return results.flat() // Combine all results
    } else {
      // Fetch from single collection
      return await queryCollectionSearchSections(props.collection)
    }
  } catch (error) {
    console.error('Error fetching sections:', error)
    return []
  }
}

// Debounced search function using VueUse
const debouncedSearch = useDebounceFn(async () => {
  if (!searchQuery.value || searchQuery.value.length < 2) {
    searchResults.value = []
    return
  }

  isLoading.value = true
  emit('search', searchQuery.value)

  try {
    const sections = await fetchSections()
    const query = searchQuery.value.toLowerCase()

    // Use Fuse.js for better search results
    const fuse = new Fuse(sections, {
      keys: ['title', 'content'],
      threshold: 0.3,
      ...props.fuseOptions,
    })

    const results = fuse.search(query)
    searchResults.value = results.map((r) => r.item).slice(0, resultLimit.value)
  } catch (error) {
    console.error('Search error:', error)
    searchResults.value = []
  } finally {
    isLoading.value = false
  }
}, props.debounceMs)

// Watch for changes to search query
watch(searchQuery, () => {
  debouncedSearch()
})

// Close search on escape key
useEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    isShowOverlay.value = false
  }
})

// Close search on route change
watch(
  () => useRoute().fullPath,
  () => {
    isShowOverlay.value = false
  },
)

// Handle result selection
const handleResultSelect = (result: Section) => {
  emit('select', result)

  // Auto-navigate if no listeners for select event and ID is valid
  const hasSelectListeners = useEventListeners().select?.length > 0
  if (!hasSelectListeners && result.id) {
    navigateTo(result.id)
  }

  isShowOverlay.value = false
}

// Simple utility to check if emit has listeners
function useEventListeners() {
  // @ts-ignore - Access internal _events property
  return typeof emit === 'function' && emit.fns ? emit.fns : {}
}
</script>

<template>
  <div>
    <!-- Search Button -->
    <button
      :class="buttonClass"
      @click="isShowOverlay = true"
    >
      <Icon
        name="i-lucide-search"
        class="w-4 h-4"
      />
      <span>{{ buttonLabel }}</span>
    </button>

    <!-- Search Overlay -->
    <Teleport to="body">
      <div
        v-if="isShowOverlay"
        class="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-start justify-center pt-20"
        @click.self="isShowOverlay = false"
      >
        <div class="bg-primary-950 rounded-lg w-full max-w-2xl shadow-lg overflow-hidden">
          <!-- Search Input -->
          <div class="p-4 border-b border-primary-800">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="props.placeholder"
                class="w-full bg-primary-900 text-white border-none rounded-md px-4 py-3 pl-10 focus:ring-2 focus:ring-primary-600 focus:outline-none"
                autofocus
                @keyup.escape="isShowOverlay = false"
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
                class="w-6 h-6 animate-spin mx-auto"
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
              <button
                v-for="result in searchResults"
                :key="result.id"
                class="block w-full text-left p-4 hover:bg-primary-900 transition"
                @click="handleResultSelect(result)"
              >
                <h3 class="font-medium text-white">{{ result.title }}</h3>
                <p class="mt-1 text-sm text-gray-400 line-clamp-2">
                  {{ result.content?.substring(0, 150) }}...
                </p>
              </button>
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
