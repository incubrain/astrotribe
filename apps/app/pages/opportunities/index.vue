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

// Get feature limit info using the same composable as companies page
const {
  limitedItems,
  lastRowItems,
  showPaywall,
  totalCount,
  remainingItems,
  viewMode: featureViewMode,
} = useFeatureLimit({
  feature: 'JOB_LISTINGS',
  contentType: 'jobs',
  items: computed(() => jobs.value),
})

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
  if (isLoadingMore.value || showPaywall.value) return

  isLoadingMore.value = true
  try {
    await loadMore()
  } catch (error: any) {
    console.error('Error loading more jobs:', error)
  } finally {
    isLoadingMore.value = false
  }
}

// Track initial component load
onMounted(() => {
  // Load saved preferences
  jobStorage.loadPreferences()
})
</script>

<template>
  <div>
    <!-- Hero Section with search -->
    <div
      class="relative w-full py-16 flex flex-col items-center justify-center bg-primary-900/30 border-b border-primary-800/30"
    >
      <div class="container mx-auto text-center px-4">
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4"> Career Opportunities </h1>
        <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Explore job openings in space technology, astronomy, and related fields.
        </p>

        <!-- Search input -->
        <div class="max-w-3xl mx-auto mb-8 w-full">
          <FuzzySearch
            v-model="searchQuery"
            :data="jobs"
            :fuse-options="searchFuseOptions"
            placeholder="Search jobs by title, company, skills..."
            class="w-full"
            @results="handleSearchResults"
          />
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

      <!-- Job statistics bar -->
      <div class="bg-primary-900/30 rounded-lg p-4 mb-4 flex justify-between items-center">
        <div class="text-gray-300">
          <span class="font-medium">{{ jobs.length }}</span> opportunities found
          <span v-if="showPaywall"> (showing {{ limitedItems.length }}) </span>
          <span
            v-if="searchQuery"
            class="ml-1"
            >for "<span class="text-primary-400">{{ searchQuery }}</span
            >"</span
          >
        </div>
      </div>

      <!-- Job listings with infinite scroll -->
      <Transition
        name="fade"
        mode="out-in"
      >
        <!-- Loading state -->
        <div
          v-if="isLoadingInitial || isLoadingJobs"
          class="py-8"
        >
          <JobListingSkeleton :count="10" />
        </div>

        <div v-else>
          <ViewWrapper
            :show-paywall="showPaywall"
            :items-shown="limitedItems.length"
            feature="JOB_LISTINGS"
            :total="totalCount"
          >
            <template #items>
              <JobCard
                v-for="job in limitedItems"
                :key="job.id"
                :job="job"
                class="job-card-item"
              />
            </template>

            <template #last-row-items>
              <JobCard
                v-for="job in lastRowItems"
                :key="job.id"
                :job="job"
                class="job-card-item"
              />
            </template>
          </ViewWrapper>

          <!-- Loading indicator for infinite scroll -->
          <div
            v-if="isLoadingMore && !showPaywall"
            class="flex justify-center py-8"
          >
            <Icon
              name="mdi:loading"
              class="w-8 h-8 text-primary-500 animate-spin"
            />
          </div>
        </div>
      </Transition>

      <!-- Feature CTA -->
      <FeatureCTA
        v-if="showPaywall"
        feature="JOB_LISTINGS"
        :remaining="remainingItems"
        :show="showPaywall"
      />
    </div>
  </div>
</template>
