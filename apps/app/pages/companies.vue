<script setup lang="ts">
import { storeToRefs } from 'pinia'

definePageMeta({ name: 'Companies' })

// Use our new store
const companiesStore = useCompaniesStore()
const {
  loading,
  error,
  companies,
  filteredCompanies,
  viewMode,
  filters,
  selectedCompany,
  showDetailModal,
  recentlyViewedCompaniesData,
} = storeToRefs(companiesStore)

// Initialize filter options
const searchQuery = ref('')
const searchFuseOptions = {
  keys: ['name', 'description', 'category', 'keywords', 'city', 'country'],
  threshold: 0.3,
  shouldSort: true,
}

// Handle search results
const handleSearchResults = (results: FuseResult<any>[]) => {
  companiesStore.handleSearch(searchQuery.value)
}

// Function to apply filter changes
const handleChangeFilters = () => {
  // In a real app, this would trigger refetching with new filters
  // For now, we're just going to rely on the computed property
  console.log('Filters changed:', filters.value)
}

// Add tag filter
const addTagFilter = (tag: string) => {
  companiesStore.addTagFilter(tag)
}

// Remove tag filter
const removeTagFilter = (tag: string) => {
  companiesStore.removeTagFilter(tag)
}

// Clear all filters
const clearAllFilters = () => {
  companiesStore.resetFilters()
}

// View company details
const viewCompanyDetails = (company: any) => {
  companiesStore.viewCompanyDetails(company)
}

// Fetch companies data on component mount
onMounted(() => {
  companiesStore.fetchCompanies()
})

// Sort options to display
const sortOptions = [
  { label: 'Name A-Z', value: 'name', isAscending: true },
  { label: 'Name Z-A', value: 'name', isAscending: false },
  { label: 'Founding Year (Oldest)', value: 'founding_year', isAscending: true },
  { label: 'Founding Year (Newest)', value: 'founding_year', isAscending: false },
]

// Handle sort change
const handleSortChange = (option: any) => {
  companiesStore.setSortPreference(option.value, option.isAscending)
}

// Show skeleton loader while loading
const showSkeletonGrid = computed(() => loading.value)
</script>

<template>
  <div class="p-4 lg:p-6">
    <!-- Search bar -->
    <div class="w-full mb-4">
      <FuzzySearch
        v-model="searchQuery"
        :data="companies"
        :fuse-options="searchFuseOptions"
        placeholder="Search companies..."
        class="w-full"
        @results="handleSearchResults"
      />
    </div>

    <!-- Recent views section if available -->
    <div
      v-if="recentlyViewedCompaniesData.length > 0"
      class="mb-6 bg-primary-900/30 rounded-lg p-4"
    >
      <h3 class="text-lg font-semibold mb-3">Recently Viewed</h3>
      <div class="flex space-x-4 overflow-x-auto pb-2">
        <div
          v-for="company in recentlyViewedCompaniesData"
          :key="company.id"
          class="flex-shrink-0 w-40 cursor-pointer bg-primary-800/30 hover:bg-primary-800/70 rounded-lg p-3 border border-primary-700/30 transition-colors"
          @click="viewCompanyDetails(company)"
        >
          <div class="flex flex-col items-center text-center">
            <div
              class="w-16 h-16 bg-primary-900/50 rounded-full flex items-center justify-center mb-2 overflow-hidden"
            >
              <img
                :src="company.logo_url || '/images/companies_fallback.png'"
                :alt="company.name"
                class="w-full h-full object-contain p-2"
                @error="$event.target.src = '/images/companies_fallback.png'"
              />
            </div>
            <h4 class="font-medium text-sm line-clamp-2">{{ company.name }}</h4>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and view toggles -->
    <div class="flex flex-col space-y-4 mb-4">
      <!-- Enhanced filter section -->
      <CompaniesFilters
        v-model="filters"
        :change-filters="handleChangeFilters"
        @remove-tag="removeTagFilter"
        @clear-filters="clearAllFilters"
      />

      <!-- Sorting and view options -->
      <div
        class="bg-primary-900/40 backdrop-blur-sm rounded-xl border border-primary-800/30 p-4 flex flex-wrap justify-between items-center gap-4"
      >
        <div class="text-gray-300">
          <span class="font-medium">{{ filteredCompanies.length }}</span> companies found
          <span
            v-if="searchQuery"
            class="ml-1"
            >for "<span class="text-primary-400">{{ searchQuery }}</span
            >"</span
          >
        </div>

        <div class="flex items-center gap-4">
          <!-- Sort dropdown -->
          <div class="relative">
            <PrimeDropdown
              v-model="companiesStore.sortPreference"
              :options="sortOptions"
              option-label="label"
              placeholder="Sort by"
              class="w-56"
              @change="handleSortChange"
            />
          </div>

          <!-- View mode toggle -->
          <CompaniesViewToggle
            v-model="viewMode"
            @update:model-value="companiesStore.setViewMode"
          />
        </div>
      </div>
    </div>

    <!-- Main content -->
    <Transition
      name="fade"
      mode="out-in"
    >
      <!-- Loading skeleton -->
      <CompaniesSkeleton v-if="showSkeletonGrid" />

      <!-- Main grid/list view -->
      <div v-else>
        <div
          v-if="filteredCompanies.length === 0"
          class="text-center py-12"
        >
          <div class="max-w-md mx-auto">
            <Icon
              name="mdi:office-building"
              class="w-16 h-16 mx-auto text-gray-600 mb-4"
            />
            <h3 class="text-xl font-semibold mb-2">No companies found</h3>
            <p class="text-gray-400 mb-4">Try adjusting your filters or search criteria</p>
            <PrimeButton
              label="Clear Filters"
              @click="clearAllFilters"
            />
          </div>
        </div>

        <!-- Grid view -->
        <div
          v-else-if="viewMode === 'grid'"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <CompanyCard
            v-for="company in filteredCompanies"
            :key="company.id"
            :company="company"
            mode="grid"
            @view="viewCompanyDetails"
            @tag="addTagFilter"
          />
        </div>

        <!-- List view -->
        <div
          v-else
          class="space-y-4"
        >
          <CompanyCard
            v-for="company in filteredCompanies"
            :key="company.id"
            :company="company"
            mode="list"
            @view="viewCompanyDetails"
            @tag="addTagFilter"
          />
        </div>
      </div>
    </Transition>

    <!-- Company detail modal -->
    <CompanyDetailView
      v-model:visible="showDetailModal"
      :company="selectedCompany"
    />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
