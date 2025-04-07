<script setup lang="ts">
import { ref, computed, watch, nextTick, watchEffect } from 'vue'

import { useDebounceFn, useEventListener } from '@vueuse/core'
import Fuse from 'fuse.js'
import type { IFuseOptions } from 'fuse.js'
// Import the composable if it's not auto-imported (usually it is)
// import { queryCollectionSearchSections } from '#imports' // Adjust if needed

// Function to highlight matches in the search result
function highlightMatches(text: string | undefined | null, query: string): string {
  // Add check for undefined/null text
  if (!text) {
    return ''
  }
  if (!query || query.length < 1) {
    return text // No highlighting for empty query
  }
  // Basic case-insensitive highlighting. Escapes regex characters in query.
  try {
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    // Ensure the regex is valid before creating it
    if (!escapedQuery) return text
    const regex = new RegExp(`(${escapedQuery})`, 'gi')
    // Apply a different, potentially less intense highlight class (e.g., light blue)
    // Ensure these Tailwind classes are available and not purged
    return text.replace(
      regex,
      '<mark class="bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 px-0.5 rounded">$1</mark>',
    )
  } catch (e) {
    console.error('Highlighting error:', e)
    return text // Return original text on error
  }
}

// Interface matching the output of queryCollectionSearchSections
interface Section {
  id: string // Unique identifier (often used for navigation path)
  title: string
  titles?: string[] // Hierarchy of parent titles
  level?: number // Heading level
  content: string
  // Allow potential extra fields Nuxt Content might add
  [key: string]: any
}

// Define collection types to support blog and/or global search
type CollectionName = string | string[]

// Import Collections type if available for better type safety, otherwise use 'any' or define locally
// Assuming Collections is globally available or imported from your content config setup
// import type { Collections } from 'your-types-or-generated' // Example import path

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
    collection: () => ['blog'], // Default to blog collection
    buttonLabel: 'Search Blog',
    autoNavigate: true,
    buttonClass:
      'flex items-center gap-2 text-sm bg-primary-900 hover:bg-primary-800 text-white px-4 py-2 rounded-full',
  },
)

const emit = defineEmits<{
  search: [query: string] // Emits the query itself when search is performed
  select: [result: Section] // Emits the selected section object
}>()

// States
const isShowOverlay = ref(false)
const searchQuery = ref('')
const searchResults = ref<Section[]>([])
const isLoadingSearch = ref(false) // State for active searching
const noResults = ref(false)
const searchError = ref<string | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)

// --- Data Fetching with Nuxt/Content ---
const allSections = ref<Section[]>([])
const isLoadingData = ref(true) // State for initial data loading
const dataFetchError = ref<string | null>(null)

// Fetch data using useAsyncData and queryCollectionSearchSections
// This runs once on setup or when the watched dependency (props.collection) changes.
const {
  data: fetchedSections,
  pending: loadingDataPending,
  error: fetchDataErrorRef,
  refresh: refreshSections, // Function to manually refetch if needed
} = await useAsyncData(
  `search-sections-${JSON.stringify(props.collection)}`,
  async () => {
    const names = Array.isArray(props.collection) ? props.collection : [props.collection]
    if (!names || names.length === 0) {
      return [] // Return empty if no collections specified
    }
    try {
      // Important: Ensure queryCollectionSearchSections is available.
      // The 'as any' might be needed if the Collections type isn't properly inferred/imported.
      // Replace 'any' with the specific keyof Collections if possible.
      const fetchPromises = names.map((name) => queryCollectionSearchSections(name as any))
      const resultsArrays = await Promise.all(fetchPromises)
      // Flatten the array of arrays into a single array of sections
      return resultsArrays.flat()
    } catch (err) {
      console.error(`Error fetching sections for collections [${names.join(', ')}]:`, err)
      // Rethrow or handle the error to be caught by useAsyncData
      throw new Error(`Failed to load search data for ${names.join(', ')}.`)
    }
  },
  {
    // Watch the collection prop. If it changes, useAsyncData will re-run.
    watch: [() => props.collection],
    // Provide a default value while loading or if fetch fails initially
    default: () => [],
    // server: false, // Set to false if you explicitly want client-side only fetching
  },
)

// Update local refs based on useAsyncData state changes
watch(
  loadingDataPending,
  (pending) => {
    isLoadingData.value = pending
  },
  { immediate: true },
)

watch(
  fetchDataErrorRef,
  (error) => {
    dataFetchError.value = error ? error.message || 'Failed to load search data.' : null
  },
  { immediate: true },
)

watch(
  fetchedSections,
  (sections) => {
    allSections.value = sections || []
    // Maybe trigger a search if query already exists and data just loaded?
    // if (searchQuery.value) {
    //   performSearch();
    // }
  },
  { immediate: true },
)
// --- End Data Fetching ---

// --- Fuse.js Search Logic ---
const fuse = computed(() => {
  // Ensure Fuse instance is recreated if data or options change
  return new Fuse(allSections.value, {
    keys: ['title', 'content', 'titles'], // Search in title, content, and parent titles
    threshold: 0.3, // Adjust sensitivity as needed
    includeScore: true,
    includeMatches: false, // Useful for highlighting matches later if desired
    minMatchCharLength: 2, // Don't match on single characters
    ...props.fuseOptions, // Allow overriding fuse options via props
  })
})

// The actual search function
const performSearch = () => {
  searchError.value = null // Clear previous errors
  if (!searchQuery.value) {
    searchResults.value = []
    noResults.value = false
    isLoadingSearch.value = false
    return
  }

  // Don't perform search if data is still loading or failed to load
  if (isLoadingData.value || dataFetchError.value || !fuse.value) {
    // Optionally set a state here, or just wait
    searchResults.value = []
    noResults.value = false // Not 'no results' technically, just 'not ready'
    isLoadingSearch.value = false // Not actively searching
    return
  }

  isLoadingSearch.value = true
  noResults.value = false

  // Use try/catch for safety during search
  try {
    const results = fuse.value.search(searchQuery.value)
    searchResults.value = results.slice(0, props.resultLimit).map((result) => result.item) // Extract the original Section object

    noResults.value = searchResults.value.length === 0
    emit('search', searchQuery.value) // Emit the performed query
  } catch (err: any) {
    console.error('Error during Fuse search:', err)
    searchError.value = 'An error occurred during search.'
    searchResults.value = []
    noResults.value = false
  } finally {
    isLoadingSearch.value = false
  }
}

// Debounced version of the search function
const debouncedSearch = useDebounceFn(performSearch, props.debounceMs)

// Watch for changes to search query and trigger debounced search
watch(searchQuery, (newQuery, oldQuery) => {
  // Only trigger search if query actually changed meaningfully
  if (newQuery !== oldQuery) {
    debouncedSearch()
  }
})
// --- End Fuse.js Search Logic ---

// --- Event Handlers and Lifecycle ---

// Close search on escape key
useEventListener(document, 'keydown', (e) => {
  if (e.key === 'Escape' && isShowOverlay.value) {
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
// Handle result selection
const handleResultSelect = (result: Section) => {
  emit('select', result)

  // Auto-navigate if enabled and ID is valid
  if (props.autoNavigate && result.id) {
    try {
      // Parse the result.id (assuming format collection:filepath:heading-slug)
      const parts = result.id.split(':')
      let path = ''
      let hash = ''

      if (parts.length === 3) {
        // Format: collection:filepath:heading-slug
        // Need to ensure filepath starts with / if it doesn't
        path = parts[1].startsWith('/') ? parts[1] : `/${parts[1]}`
        hash = `#${parts[2]}`
      } else if (parts.length === 2) {
        // Might be just collection:filepath (points to the page itself)
        path = parts[1].startsWith('/') ? parts[1] : `/${parts[1]}`
        // No hash in this case
      } else {
        // Fallback or unexpected format - maybe just try navigating to the raw id if it looks like a path?
        // Or log an error. For now, let's assume it might be a direct path in some cases.
        path = result.id.startsWith('/') ? result.id : `/${result.id}`
        console.warn(
          `Unexpected result.id format for navigation: ${result.id}. Attempting direct navigation.`,
        )
      }

      const navigationTarget = path + hash
      console.log('Navigating to:', navigationTarget) // Debug log

      // Use navigateTo for Nuxt routing
      navigateTo(navigationTarget)
      isShowOverlay.value = false // Close overlay after navigation attempt
    } catch (e) {
      console.error(`Navigation failed parsing ID "${result.id}":`, e)
      // Optionally show an error to the user
      isShowOverlay.value = false // Still close overlay on error
    }
  } else {
    isShowOverlay.value = false // Close overlay if not navigating
  }
}

// Focus search input when overlay is shown
watch(isShowOverlay, (newVal) => {
  if (newVal) {
    // Use nextTick to ensure the input element is rendered and visible
    nextTick(() => {
      searchInput.value?.focus()
    })
    // Optionally reset search when opening
    // searchQuery.value = '';
    // searchResults.value = [];
    // noResults.value = false;
    // searchError.value = null;
  }
})
</script>

<template>
  <div>
    <button
      :class="buttonClass"
      aria-label="Open search"
      class="flex"
      @click="isShowOverlay = true"
    >
      <Icon
        name="mdi:magnify"
        size="20"
        aria-hidden="true"
      />
      <span>{{ buttonLabel }}</span>
    </button>

    <ClientOnly>
      <Teleport to="body">
        <div
          v-if="isShowOverlay"
          class="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-start justify-center pt-16 sm:pt-20"
          @click.self="isShowOverlay = false"
        >
          <div
            class="bg-primary-950 rounded-lg w-full max-w-2xl shadow-lg overflow-hidden flex flex-col max-h-[80vh]"
            @click.stop
          >
            <div class="p-4 border-b border-primary-800 flex-shrink-0">
              <div class="relative">
                <input
                  ref="searchInput"
                  v-model="searchQuery"
                  type="search"
                  :placeholder="props.placeholder"
                  class="w-full bg-primary-900 text-white border-none rounded-md px-4 py-3 pl-10 focus:ring-2 focus:ring-primary-600 focus:outline-none"
                  aria-label="Search input"
                  @keydown.escape="isShowOverlay = false"
                />
                <Icon
                  name="mdi:magnify"
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none flex"
                  aria-hidden="true"
                />
                <button
                  v-if="searchQuery"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  aria-label="Clear search"
                  @click="searchQuery = ''"
                >
                  <Icon
                    name="mdi:close-circle"
                    size="20"
                  />
                </button>
              </div>
            </div>

            <div class="flex-grow overflow-y-auto">
              <div
                v-if="isLoadingData"
                class="p-6 text-center text-gray-400"
              >
                <Icon
                  name="mdi:loading"
                  class="w-6 h-6 animate-spin mx-auto"
                  aria-hidden="true"
                />
                <p class="mt-2">Loading search data...</p>
              </div>

              <div
                v-else-if="dataFetchError"
                class="p-6 text-center text-red-400"
              >
                <Icon
                  name="mdi:alert-circle"
                  class="w-6 h-6 mx-auto"
                  aria-hidden="true"
                />
                <p class="mt-2">Error loading data: {{ dataFetchError }}</p>
                <button
                  class="mt-4 px-4 py-2 bg-primary-700 hover:bg-primary-600 text-white rounded"
                  @click="refreshSections"
                >
                  Retry
                </button>
              </div>

              <template v-else>
                <div
                  v-if="isLoadingSearch"
                  class="p-6 text-center text-gray-400"
                >
                  <Icon
                    name="mdi:loading"
                    class="w-6 h-6 animate-spin mx-auto"
                    aria-hidden="true"
                  />
                  <p class="mt-2">Searching...</p>
                </div>

                <div
                  v-else-if="searchError"
                  class="p-6 text-center text-red-400"
                >
                  <Icon
                    name="mdi:alert-circle"
                    class="w-6 h-6 mx-auto"
                    aria-hidden="true"
                  />
                  <p class="mt-2">{{ searchError }}</p>
                </div>

                <div
                  v-else-if="searchQuery && noResults"
                  class="p-6 text-center text-gray-400"
                >
                  <Icon
                    name="mdi:alert-circle-outline"
                    class="w-6 h-6 mx-auto"
                    aria-hidden="true"
                  />
                  <p class="mt-2">No results found for "{{ searchQuery }}"</p>
                </div>

                <div
                  v-else-if="!searchQuery"
                  class="p-6 text-center text-gray-400"
                >
                  <Icon
                    name="mdi:magnify"
                    class="w-6 h-6 mx-auto"
                    aria-hidden="true"
                  />
                  <p class="mt-2">Type to start searching</p>
                </div>

                <div
                  v-else-if="searchResults.length > 0"
                  class="divide-y divide-primary-800"
                >
                  <button
                    v-for="result in searchResults"
                    :key="result.id"
                    class="block w-full text-left p-4 hover:bg-primary-900 transition focus:outline-none focus:bg-primary-900"
                    @click="handleResultSelect(result)"
                  >
                    <h3 class="font-medium text-white">{{ result.title }}</h3>
                    <p
                      v-if="result.titles && result.titles.length > 0"
                      class="text-xs text-primary-400 mt-1"
                    >
                      {{ result.titles.join(' > ') }}
                    </p>
                    <p
                      v-if="result.content"
                      class="mt-1 text-sm text-gray-400 line-clamp-2"
                    >
                      <span
                        v-html="highlightMatches(result.content.substring(0, 150), searchQuery)"
                      ></span
                      >...
                    </p>
                  </button>
                </div>
              </template>
            </div>

            <div
              class="p-3 bg-primary-900 text-center text-xs text-gray-400 border-t border-primary-800 flex-shrink-0"
            >
              Press
              <kbd
                class="px-2 py-1.5 text-xs font-semibold text-gray-200 bg-primary-800 border border-primary-700 rounded-md shadow-sm"
                >ESC</kbd
              >
              to close
            </div>
          </div>
        </div>
      </Teleport>
    </ClientOnly>
  </div>
</template>

<style scoped>
/* Add any specific styles if needed */
kbd {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
}
</style>
