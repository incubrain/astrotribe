<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { Job, JobFilter } from '~/types/jobs'
import {
  applyFilters,
  getUniqueLocations,
  getUniqueEmploymentTypes,
  getUniqueCompanies,
} from '~/utils/jobFilters'
import { formatDate, formatEmploymentType } from '~/utils/jobFormatters'

// Current user data
const currentUser = useCurrentUser()
const { profile } = storeToRefs(currentUser)

// User access level check
const isUserBasic = profile.value.user_plan === 'free'
const showDialog = ref(isUserBasic)

// Loading states
const isLoadingInitial = ref(true)
const isLoadingMore = ref(false)

// Fetch job filter options
const { store: jobFiltersStore } = useSelectData('job_filters', {
  columns: '*',
  initialFetch: true,
  storeKey: 'jobsFilters',
})

const { items: jobFilterItems } = storeToRefs(jobFiltersStore)

// Search functionality
const searchQuery = ref('')
const searchResults = ref<any[]>([])
const searchFuseOptions = {
  keys: ['title', 'description', 'companies.name', 'location', 'employment_type'],
  threshold: 0.3,
  shouldSort: true,
}

// Job storage composable for preferences
const jobStorage = useJobStore()

// Initialize filters from stored preferences or defaults
const filters = ref<JobFilter>(
  jobStorage.filters.value || {
    location: { value: '', options: [] },
    company: { value: '', options: [] },
    type: { value: '', options: [] },
    tags: [],
  },
)

// View mode (grid or list)
const viewMode = ref<'grid' | 'list'>(jobStorage.viewPreference.value.mode || 'grid')

// Sort preferences
const sortBy = ref(jobStorage.sortPreference.value.sortBy || 'published_at')
const sortAscending = ref(jobStorage.sortPreference.value.isAscending || false)

// Fetch jobs with filtering and sorting
const { store, loadMore, changeFilters } = useSelectData('jobs', {
  columns: '*, companies(name)',
  orderBy: {
    column: sortBy.value,
    ascending: sortAscending.value,
    nullsFirst: false,
  },
  pagination: {
    page: 1,
    limit: 20,
  },
  initialFetch: true,
  storeKey: 'jobsFeed',
})

const { items: rawJobs, isSelecting: isLoadingJobs } = storeToRefs(store)

// Format and process job data
const jobs = computed(
  () => {
    const formattedJobs = rawJobs.value.map((item) => {
      // Format dates for display
      const publishedAt = item.published_at && formatDate(item.published_at)
      const expiresAt = item.expires_at && formatDate(item.expires_at)

      // Format employment type
      const employmentType = formatEmploymentType(item.employment_type)

      return {
        ...item,
        publishedAt,
        expiresAt,
        employmentType,
        company: item.companies?.name,
      }
    })

    // Apply any additional filters from search results
    if (searchQuery.value && searchResults.value?.length) {
      const searchIds = new Set(searchResults.value.map((result) => result.id))
      return formattedJobs.filter((job) => searchIds.has(job.id))
    }

    return formattedJobs
  },
  { deep: true },
)

// Location grouping for filter options
const { locationFilterOptions, topLocations, recommendedLocations } = useLocationGrouping(jobs)

// Initialize filter options
watch(
  jobs,
  (newJobs) => {
    if (!newJobs?.length) return

    // Get unique locations
    const locations = getUniqueLocations(newJobs)

    // Get unique companies
    const companies = getUniqueCompanies(newJobs)

    // Get unique employment types
    const types = getUniqueEmploymentTypes(newJobs)

    // Update filter options
    filters.value.location.options = locations.map((location) => ({
      key: location,
      value: location,
    }))
    filters.value.company.options = companies.map(({ id, name }) => ({ key: id, value: name }))
    filters.value.type.options = types.map((type) => ({
      key: type,
      value: formatEmploymentType(type),
    }))

    // Save to job storage
    jobStorage.filters.value = filters.value

    // Hide initial loading state
    isLoadingInitial.value = false
  },
  { deep: true },
)

// Update filters when search results change
const handleSearchResults = (results: FuseResult<any>[]) => {
  searchResults.value = results.map((result) => result.item)

  // Add search term to recent searches
  if (searchQuery.value) {
    jobStorage.addToRecentSearches(searchQuery.value)
  }
}

// Apply filter changes
const handleChangeFilters = () => {
  changeFilters({
    location: filters.value.location.value ? { eq: filters.value.location.value.key } : null,
    company_id: filters.value.company.value ? { eq: filters.value.company.value.key } : null,
    employment_type: filters.value.type.value ? { eq: filters.value.type.value.key } : null,
  })

  // Save filters to storage
  jobStorage.filters.value = filters.value
}

// Add tag filter
const addTagFilter = (tag: string) => {
  if (!filters.value.tags) {
    filters.value.tags = []
  }

  if (!filters.value.tags.includes(tag)) {
    filters.value.tags.push(tag)
    handleChangeFilters()
  }
}

// Remove tag filter
const removeTagFilter = (tag: string) => {
  if (!filters.value.tags) return

  filters.value.tags = filters.value.tags.filter((t) => t !== tag)
  handleChangeFilters()
}

// Clear all filters
const clearAllFilters = () => {
  jobStorage.resetFilters()
  filters.value = jobStorage.filters.value
  handleChangeFilters()
}

// Toggle view mode
const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
  jobStorage.viewPreference.value.mode = viewMode.value
}

// Handle sort change
const handleSortChange = (payload: { sort: string; order: boolean }) => {
  sortBy.value = payload.sort
  sortAscending.value = payload.order

  // Update sorting in the store
  changeFilters({
    column: sortBy.value,
    ascending: sortAscending.value,
  })

  // Save sort preference
  jobStorage.sortPreference.value = {
    sortBy: sortBy.value,
    isAscending: sortAscending.value,
  }
}

// Load more jobs with infinite scroll
const handleLoadMore = async () => {
  if (isLoadingMore.value || isUserBasic) return

  isLoadingMore.value = true
  try {
    await loadMore()
  } catch (error: any) {
    console.error('Error loading more jobs:', error)
  } finally {
    isLoadingMore.value = false
  }
}

const selectedRecentJob = ref(null)

// Track initial component load
onMounted(() => {
  // Load saved preferences
  jobStorage.loadPreferences()
})
</script>

<template>
  <div
    :class="{ 'h-full overflow-hidden blur-sm pointer-events-none': isUserBasic }"
    @wheel="(event) => isUserBasic && event.preventDefault()"
    @touchmove="(event) => isUserBasic && event.preventDefault()"
  >
    <!-- Hero Section with search -->
    <div
      class="relative w-full py-16 flex flex-col items-center justify-center bg-primary-900/30 border-b border-primary-800/30"
    >
      <div class="container mx-auto text-center px-4">
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
          Find Your Next Space Career Opportunity
        </h1>
        <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Explore job openings in space technology, astronomy, and related fields.
        </p>

        <!-- Search input -->
        <div class="max-w-2xl mx-auto mb-8">
          <FuzzySearch
            v-model="searchQuery"
            :data="jobs"
            :fuse-options="searchFuseOptions"
            placeholder="Search jobs by title, company, skills..."
            class="w-full"
            @results="handleSearchResults"
          />
        </div>

        <!-- Top locations quick filters -->
        <div
          v-if="topLocations.length"
          class="flex flex-wrap justify-center gap-2"
        >
          <div class="text-gray-400 font-medium flex items-center">
            <Icon
              name="heroicons:map-pin"
              class="w-4 h-4 mr-1"
            />
            <span>Top locations:</span>
          </div>
          <button
            v-for="location in topLocations"
            :key="location.normalized"
            class="px-3 py-1 bg-primary-800/50 hover:bg-primary-700/50 border border-primary-700/30 rounded-full text-sm text-gray-300 transition-colors"
            @click="
              ((filters.location.value = { key: location.normalized, value: location.name }),
              handleChangeFilters())
            "
          >
            {{ location.name }}
            <span class="text-xs text-gray-400 ml-1">({{ location.count }})</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="flex flex-col gap-2 max-w-7xl mx-auto px-4 py-8">
      <!-- Enhanced filter section -->
      <JobFilter
        v-model="filters"
        :change-filters="handleChangeFilters"
        @remove-tag="removeTagFilter"
        @clear-filters="clearAllFilters"
      />

      <!-- Recent searches if available -->
      <div
        v-if="jobStorage.recentSearches.value.length"
        class="bg-primary-900/30 rounded-lg p-4 mb-4"
      >
        <h3 class="text-sm text-gray-400 mb-2">Recent searches:</h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="term in jobStorage.recentSearches.value"
            :key="term"
            class="px-3 py-1 bg-primary-800/50 hover:bg-primary-700/50 border border-primary-700/30 rounded-full text-xs text-gray-300 transition-colors"
            @click="searchQuery = term"
          >
            {{ term }}
          </button>
          <button
            v-if="jobStorage.recentSearches.value.length"
            class="text-xs text-gray-400 hover:text-gray-300 underline"
            @click="jobStorage.clearRecentSearches()"
          >
            Clear history
          </button>
        </div>
      </div>

      <!-- Job statistics bar -->
      <div class="bg-primary-900/30 rounded-lg p-4 mb-4 flex justify-between items-center">
        <div class="text-gray-300">
          <span class="font-medium">{{ jobs.length }}</span> opportunities found
          <span
            v-if="searchQuery"
            class="ml-1"
            >for "<span class="text-primary-400">{{ searchQuery }}</span
            >"</span
          >
        </div>

        <!-- Recently viewed jobs dropdown -->
        <div
          v-if="jobStorage.recentlyViewedJobs.value.length"
          class="relative"
        >
          <PrimeSelect
            v-model="selectedRecentJob"
            :options="jobStorage.recentlyViewedJobs.value"
            option-label="title"
            placeholder="Recently viewed jobs"
            class="w-56"
          />
        </div>
      </div>

      <!-- Job listings with infinite scroll -->
      <Transition
        name="fade"
        mode="out-in"
      >
        <IBInfiniteScroll
          :threshold="1400"
          :disabled="isUserBasic"
          @update:scroll-end="handleLoadMore"
        >
          <JobListing
            :jobs="jobs"
            :loading="isLoadingInitial || isLoadingJobs"
            :view-mode="viewMode"
            @filter-tag="addTagFilter"
          />

          <!-- Loading indicator for infinite scroll -->
          <div
            v-if="isLoadingMore && !isUserBasic"
            class="flex justify-center py-8"
          >
            <Icon
              name="mdi:loading"
              class="w-8 h-8 text-primary-500 animate-spin"
            />
          </div>
        </IBInfiniteScroll>
      </Transition>
    </div>
  </div>

  <!-- Pro upgrade dialog -->
  <PrimeDialog
    v-model:visible="showDialog"
    :modal="true"
    header="🚀 Upgrade Your Plan"
    class="w-[80vw] md:w-[30vw] rounded-md"
  >
    <div class="flex flex-col items-center gap-4 p-6 text-center">
      <!-- Upgrade Icon -->
      <Icon
        name="mdi:crown"
        size="48px"
        class="text-yellow-500"
      />

      <!-- Upgrade Message -->
      <h3 class="text-lg font-semibold text-white"> Unlock Premium Features! </h3>
      <p class="text-white text-sm">
        Upgrade your plan to access all job opportunities and premium insights.
      </p>

      <!-- Buttons -->
      <div class="flex gap-3 mt-4">
        <NuxtLink to="/settings/payments">
          <PrimeButton
            severity="success"
            class="px-6 py-2 flex items-center gap-2"
          >
            <Icon
              name="mdi:star"
              size="20px"
              class="text-yellow-400"
            />
            Upgrade Now
          </PrimeButton>
        </NuxtLink>
      </div>
    </div>
  </PrimeDialog>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Map styles */
.leaflet-container {
  width: 100% !important;
  height: 100% !important;
  filter: grayscale(100%) brightness(105%) contrast(90%);
}

/* Hide map controls */
.leaflet-control-container {
  display: none;
}

/* Hide marker shadow */
.leaflet-shadow-pane {
  display: none;
}

/* Entry animation for elements */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slideUp 0.5s ease-out forwards;
}
</style>
