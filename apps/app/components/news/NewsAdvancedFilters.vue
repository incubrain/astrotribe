<script setup lang="ts">
import { ref, computed } from 'vue'
import { useNewsStore, type NewsDateRange } from '@/stores/useNewsStore'

const newsStore = useNewsStore()
const searchQuery = ref(newsStore.filters.searchQuery)

// Date range picker values
const dateRange = ref<NewsDateRange>({
  start: newsStore.filters.dateRange.start,
  end: newsStore.filters.dateRange.end,
})

// Applied filters count for badge
const filtersCount = computed(() => {
  let count = 0
  if (newsStore.filters.sources.length) count++
  if (newsStore.filters.tags.length) count++
  if (newsStore.filters.dateRange.start || newsStore.filters.dateRange.end) count++
  if (newsStore.filters.searchQuery) count++
  return count
})

// Submit search
const handleSearch = () => {
  newsStore.setSearchQuery(searchQuery.value)
}

// Clear all filters
const clearAllFilters = () => {
  searchQuery.value = ''
  dateRange.value = { start: null, end: null }
  newsStore.clearFilters()
}

// Reset date range
const clearDateRange = () => {
  dateRange.value = { start: null, end: null }
  newsStore.setDateRange(dateRange.value)
}

// Apply date range
const applyDateRange = () => {
  newsStore.setDateRange(dateRange.value)
}
</script>

<template>
  <div class="bg-primary-900/40 backdrop-blur-sm border border-primary-800/30 rounded-xl p-4 mb-6">
    <div class="flex flex-col gap-4">
      <!-- Header with toggle -->
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold">Advanced Filters</h3>
        <div class="flex items-center gap-2">
          <PrimeButton
            v-if="filtersCount > 0"
            size="small"
            text
            @click="clearAllFilters"
          >
            Clear All
          </PrimeButton>
          <PrimeButton
            size="small"
            @click="newsStore.toggleAdvancedFilters"
          >
            <template #icon>
              <Icon
                :name="newsStore.isAdvancedFiltersVisible ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                class="mr-2"
              />
            </template>
            {{ newsStore.isAdvancedFiltersVisible ? 'Hide Filters' : 'Show Filters' }}
            <PrimeBadge
              v-if="filtersCount > 0"
              :value="filtersCount"
              class="ml-2"
            />
          </PrimeButton>
        </div>
      </div>

      <!-- Expandable filter section -->
      <div
        v-show="newsStore.isAdvancedFiltersVisible"
        class="space-y-4"
      >
        <!-- Search bar -->
        <div class="flex gap-2">
          <span class="p-input-icon-right flex-grow">
            <Icon name="mdi:magnify" />
            <PrimeInputText
              v-model="searchQuery"
              placeholder="Search news..."
              class="w-full"
              @keyup.enter="handleSearch"
            />
          </span>
          <PrimeButton @click="handleSearch"> Search </PrimeButton>
        </div>

        <!-- Filter grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Date range filter -->
          <div class="bg-primary-950/50 rounded-lg p-4 border border-primary-800/30">
            <h4 class="text-sm font-medium mb-2 flex justify-between">
              <span>Date Range</span>
              <PrimeButton
                v-if="dateRange.start || dateRange.end"
                text
                size="small"
                severity="secondary"
                @click="clearDateRange"
              >
                Clear
              </PrimeButton>
            </h4>
            <div class="space-y-3">
              <div>
                <label class="text-xs text-gray-400 mb-1 block">From</label>
                <PrimeDatePicker
                  v-model="dateRange.start"
                  class="w-full"
                  date-format="dd/mm/yy"
                  placeholder="Start date"
                />
              </div>
              <div>
                <label class="text-xs text-gray-400 mb-1 block">To</label>
                <PrimeDatePicker
                  v-model="dateRange.end"
                  class="w-full"
                  date-format="dd/mm/yy"
                  placeholder="End date"
                />
              </div>
              <PrimeButton
                class="w-full mt-2"
                size="small"
                @click="applyDateRange"
              >
                Apply Date Range
              </PrimeButton>
            </div>
          </div>

          <!-- Sources filter -->
          <div class="bg-primary-950/50 rounded-lg p-4 border border-primary-800/30">
            <h4 class="text-sm font-medium mb-2 flex justify-between">
              <span>Sources</span>
              <PrimeButton
                v-if="newsStore.filters.sources.length"
                text
                size="small"
                severity="secondary"
                @click="newsStore.filters.sources = []"
              >
                Clear
              </PrimeButton>
            </h4>
            <div class="max-h-60 overflow-y-auto pr-1 space-y-1">
              <div
                v-for="source in newsStore.availableSources"
                :key="source.id"
                class="flex items-center"
              >
                <PrimeCheckbox
                  :id="`source-${source.id}`"
                  :model-value="newsStore.filters.sources.includes(source.id)"
                  :binary="true"
                  @update:model-value="newsStore.toggleSource(source.id)"
                />
                <label
                  :for="`source-${source.id}`"
                  class="ml-2 text-sm"
                  >{{ source.name }}</label
                >
              </div>
              <div
                v-if="!newsStore.availableSources.length"
                class="text-gray-400 text-sm italic"
              >
                No sources available
              </div>
            </div>
          </div>

          <!-- Tags filter -->
          <div class="bg-primary-950/50 rounded-lg p-4 border border-primary-800/30">
            <h4 class="text-sm font-medium mb-2 flex justify-between">
              <span>Tags</span>
              <PrimeButton
                v-if="newsStore.filters.tags.length"
                text
                size="small"
                severity="secondary"
                @click="newsStore.filters.tags = []"
              >
                Clear
              </PrimeButton>
            </h4>
            <div class="flex flex-wrap gap-2">
              <PrimeChip
                v-for="tag in newsStore.availableTags"
                :key="tag"
                :class="
                  newsStore.filters.tags.includes(tag) ? 'bg-primary-800' : 'bg-primary-950/70'
                "
                @click="newsStore.toggleTag(tag)"
              >
                {{ tag }}
                <template
                  v-if="newsStore.filters.tags.includes(tag)"
                  #icon
                >
                  <Icon
                    name="mdi:check"
                    class="ml-1"
                  />
                </template>
              </PrimeChip>
              <div
                v-if="!newsStore.availableTags.length"
                class="text-gray-400 text-sm italic"
              >
                No tags available
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
