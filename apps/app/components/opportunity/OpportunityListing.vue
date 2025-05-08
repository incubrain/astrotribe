<script setup lang="ts">
import { ref, computed } from 'vue'
import { FilterMatchMode } from '@primevue/core/api'
import type { Job } from '~/types/opportunities'

interface Props {
  jobs: Job[]
  loading?: boolean
  viewMode?: 'grid' | 'list'
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'filterTag', tag: string): void
  (e: 'viewModeChange', mode: 'grid' | 'list'): void
}>()

// Local viewMode state with default from props or 'grid'
const currentViewMode = ref(props.viewMode || 'grid')

// Watch for prop changes and update local state
watch(
  () => props.viewMode,
  (newMode) => {
    if (newMode) {
      currentViewMode.value = newMode
    }
  },
)

// Toggle view mode
const toggleViewMode = () => {
  const newMode = currentViewMode.value === 'grid' ? 'list' : 'grid'
  currentViewMode.value = newMode
  emit('viewModeChange', newMode)
}

// Sort jobs to show featured ones first
const sortedJobs = computed(() => {
  return [...props.jobs].sort((a, b) => {
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    return 0
  })
})

// Empty state message
const emptyStateMessage = computed(() => {
  if (props.loading) return 'Loading job opportunities...'
  if (!props.jobs.length) return 'No job opportunities match your criteria'
  return ''
})

// Class based on view mode
const containerClass = computed(() => {
  return currentViewMode.value === 'list'
    ? 'grid grid-cols-1 gap-4'
    : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
})

// DataTable pagination
const rows = ref(100)
const first = ref(0)

// Table filters
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

// Handle tag click in DataTable
const handleTagClick = (tag: string) => {
  emit('filterTag', tag)
}

// Format date for DataTable
const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Clear filters
const clearFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  }
}
</script>

<template>
  <div>
    <!-- View Toggle Controls -->
    <div class="flex justify-end gap-4 mb-4">
      <PrimeButton
        :class="{ 'p-button-outlined': currentViewMode !== 'grid' }"
        severity="primary"
        :outlined="currentViewMode !== 'grid'"
        aria-label="Grid view"
        @click="((currentViewMode = 'grid'), emit('viewModeChange', 'grid'))"
      >
        <Icon
          name="i-mdi:apps"
          size="24"
        />
      </PrimeButton>
      <PrimeButton
        :class="{ 'p-button-outlined': currentViewMode !== 'list' }"
        severity="primary"
        :outlined="currentViewMode !== 'list'"
        aria-label="List view"
        @click="((currentViewMode = 'list'), emit('viewModeChange', 'list'))"
      >
        <Icon
          name="i-mdi:format-list-bulleted"
          size="24"
        />
      </PrimeButton>
    </div>

    <!-- Empty State -->
    <div
      v-if="emptyStateMessage && !jobs.length"
      class="flex flex-col items-center justify-center py-12 text-center"
    >
      <div class="bg-primary-900/50 p-8 rounded-xl border border-primary-800/30 w-full max-w-md">
        <div class="mb-4">
          <i
            v-if="loading"
            class="pi pi-spin pi-spinner text-4xl text-primary-500"
          ></i>
          <i
            v-else
            class="pi pi-search text-4xl text-primary-500"
          ></i>
        </div>
        <h3 class="text-xl font-medium mb-2">{{ emptyStateMessage }}</h3>
        <p
          v-if="!loading && !jobs.length"
          class="text-gray-400"
        >
          Try adjusting your filters or search criteria
        </p>
      </div>
    </div>

    <!-- Grid View -->
    <ClientOnly>
      <TransitionGroup
        v-if="(!emptyStateMessage || jobs.length) && currentViewMode === 'grid'"
        id="job-list"
        name="job-cards"
        tag="div"
        :class="[containerClass, { 'opacity-50': loading }]"
      >
        <template v-if="loading">
          <OpportunityCardSkeleton
            v-for="index in 6"
            :key="`skeleton-${index}`"
          />
        </template>
        <OpportunityCard
          v-for="job in sortedJobs"
          v-else
          :key="job.id"
          :job="job"
          class="job-card-item"
          @filter-tag="emit('filterTag', $event)"
        />
      </TransitionGroup>

      <!-- List View -->
      <div
        v-if="currentViewMode === 'list'"
        class="card"
      >
        <PrimeDataTable
          v-model:filters="filters"
          v-model:first="first"
          :value="sortedJobs"
          :rows="rows"
          :loading="loading"
          paginator
          data-key="id"
          :row-hover="true"
          striped-rows
          show-gridlines
          paginator-template="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          current-page-report-template="{first} to {last} of {totalRecords}"
          :rows-per-page-options="[50, 100, 200]"
          table-style="min-width: 50rem"
        >
          <template #header>
            <div class="flex flex-wrap items-center justify-between gap-2">
              <span class="text-xl font-bold">Job Opportunities</span>
              <span>
                <PrimeButton
                  v-if="filters.global.value"
                  icon="pi pi-filter-slash"
                  severity="secondary"
                  text
                  class="mr-2"
                  @click="clearFilters"
                >
                  <Icon
                    name="i-mdi:close"
                    size="16"
                  />
                </PrimeButton>

                <PrimeInputGroup>
                  <PrimeInputText
                    v-model="filters['global'].value"
                    placeholder="Search..."
                  />
                  <PrimeInputGroupAddon>
                    <Icon
                      name="i-mdi:magnify"
                      size="16"
                    />
                  </PrimeInputGroupAddon>
                </PrimeInputGroup>
              </span>
            </div>
          </template>

          <!-- Featured Status Template -->
          <PrimeColumn
            field="featured"
            header="Featured"
            style="width: 6rem"
          >
            <template #body="{ data }">
              <PrimeTag
                v-if="data.featured"
                severity="info"
                value="Featured"
              />
            </template>
          </PrimeColumn>

          <!-- Job Title Template -->
          <PrimeColumn
            field="title"
            header="Title"
            sortable
          >
            <template #body="{ data }">
              <div class="font-medium">{{ data.title }}</div>
              <div class="text-sm text-slate-400">{{ data.company }}</div>
            </template>
          </PrimeColumn>

          <!-- Location Template -->
          <PrimeColumn
            field="location"
            header="Location"
            sortable
            style="width: 14rem"
          >
            <template #body="{ data }">
              <div class="flex items-center">
                <i class="pi pi-map-marker mr-2 text-primary-500"></i>
                <span>{{ data.location || 'Remote' }}</span>
              </div>
            </template>
          </PrimeColumn>

          <!-- Posted Date Template -->
          <PrimeColumn
            field="postedDate"
            header="Posted"
            sortable
            style="width: 10rem"
          >
            <template #body="{ data }">
              {{ formatDate(data.postedDate) }}
            </template>
          </PrimeColumn>

          <!-- Tags Template -->
          <PrimeColumn
            field="tags"
            header="Tags"
            style="width: 22rem"
          >
            <template #body="{ data }">
              <div class="flex flex-wrap gap-1">
                <PrimeTag
                  v-for="tag in (data.tags || []).slice(0, 3)"
                  :key="tag"
                  :value="tag"
                  class="cursor-pointer"
                  @click="handleTagClick(tag)"
                />
                <span
                  v-if="(data.tags || []).length > 3"
                  class="text-xs text-slate-400 flex items-center"
                >
                  +{{ data.tags.length - 3 }} more
                </span>
              </div>
            </template>
          </PrimeColumn>

          <!-- Actions Template -->
          <PrimeColumn style="width: 5rem">
            <template #body="{ data }">
              <div class="flex justify-center">
                <PrimeButton
                  icon="pi pi-arrow-right"
                  rounded
                  text
                  severity="primary"
                  @click="$router.push(`/jobs/${data.id}`)"
                />
              </div>
            </template>
          </PrimeColumn>

          <!-- Empty Template -->
          <template #empty>
            <div class="text-center p-4">
              <i class="pi pi-inbox text-3xl mb-2 text-slate-500"></i>
              <p>No job opportunities found.</p>
            </div>
          </template>

          <!-- Loading Template -->
          <template #loading>
            <div class="text-center p-4">
              <i class="pi pi-spin pi-spinner text-3xl mb-2 text-primary-500"></i>
              <p>Loading job opportunities...</p>
            </div>
          </template>
        </PrimeDataTable>
      </div>

      <template #fallback>
        <div :class="containerClass">
          <OpportunityCardSkeleton
            v-for="index in 6"
            :key="`skeleton-${index}`"
          />
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<style scoped>
.job-cards-move,
.job-cards-enter-active,
.job-cards-leave-active {
  transition: all 0.5s ease;
}

.job-cards-enter-from,
.job-cards-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.job-cards-leave-active {
  position: absolute;
}

.job-card-item {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
