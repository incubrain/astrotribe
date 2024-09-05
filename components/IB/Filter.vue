<script setup lang="ts">
type DataType = 'news' | 'products' | 'events'

interface FilterConfig {
  source?: string[]
  category?: string[]
  dateOption?: string
}

const props = defineProps<{ dataType: DataType }>()

const filters = ref<FilterConfig>({})

// Assuming PrimeVue components are globally registered or import them if needed

const dateOptions = [
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'This Year', value: 'year' },
]

// Reactive data for filter values

// Example of filter options that could change based on dataType
const filterOptions = computed(() => {
  switch (props.dataType) {
    case 'news':
      console.log('newsCase')
      return {
        sources: ['nasa', 'isro', 'esa'],
        categories: ['Technology', 'Health', 'Business'],
        dateRange: { start: new Date(2020, 0, 1), end: new Date(Date.now()) },
      }
    case 'products':
      return {
        categories: ['Electronics', 'Books', 'Clothing'],
        dateRange: { start: new Date(2020, 0, 1), end: new Date() },
      }
    case 'events':
      return {
        sources: ['Eventbrite', 'Meetup', 'Local'],
        dateRange: { start: new Date(2020, 0, 1), end: new Date() },
      }
    default:
      return {}
  }
})

const emit = defineEmits(['update-filters'])
function submitFilters() {
  // Emit an event to the parent component with the current filter settings
  emit('update-filters', filters.value)
}
</script>

<template>
  <div class="flex flex-col justify-between gap-4 p-4 lg:flex-row lg:p-0">
    <div>
      <h2 class="text-lg pb-2 font-semibold">
        Filters
      </h2>
      <div class="flex flex-row gap-4 lg:justify-between xl:gap-8">
        <!-- Source filter with PrimeVue Select -->
        <div
          v-if="filterOptions.sources"
          class="flex flex-col gap-2"
        >
          <label class="block text-sm font-medium">Source</label>
          <PrimeMultiSelect
            v-model="filters.source"
            :options="filterOptions.sources"
            placeholder="Select Source(s)"
            :max-selected-labels="3"
            multiple
            class="w-full max-w-48"
          />
        </div>

        <!-- Category filter with PrimeVue Checkbox Group -->
        <div
          v-if="filterOptions.categories"
          class="flex flex-col gap-2"
        >
          <label class="block text-sm font-medium">Category</label>
          <div class="flex flex-wrap gap-x-4 gap-y-2">
            <PrimeMultiSelect
              v-model="filters.category"
              :options="filterOptions.categories"
              placeholder="Select Category(s)"
              :max-selected-labels="3"
              multiple
              class="w-full max-w-48"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="flex min-h-full w-auto flex-row gap-4 lg:flex-col lg:justify-between">
      <PrimeButton
        :pt="{ root: 'text-center items-center justify-center' }"
        @click="submitFilters"
      >
        Apply Filters
      </PrimeButton>
      <PrimeMessage severity="info">
        More filters soon
      </PrimeMessage>
    </div>
  </div>
</template>

<style scoped>
/* Tailwind CSS is utility-first, so additional styles can be minimal */
</style>
