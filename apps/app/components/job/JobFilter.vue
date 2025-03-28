<script setup lang="ts">
import type { JobFilter } from '~/types/jobs'

interface Option {
  value: string
  key: string
}

interface Options {
  value: string
  options: Option[]
}

interface Props {
  modelValue: JobFilter
  changeFilters: () => void
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: JobFilter): void
  (e: 'removeTag', tag: string): void
  (e: 'clearFilters'): void
}>()

const filters = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  },
})

// For dropdown inputs (location, company, employment type)
const dropDownInputs = ref(
  [
    { key: 'location', icon: 'uil:location-point', label: 'Location' },
    { key: 'company', icon: 'uil:building', label: 'Company' },
    { key: 'type', icon: 'uil:clock', label: 'Type' },
  ].reduce(
    (acc, { key, icon, label }) => ({
      ...acc,
      [key]: {
        showSuggestions: false,
        input: null,
        ref: null,
        label,
        icon,
      },
    }),
    {},
  ),
)

// For salary display
const formattedSalary = computed(() => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(filters.value.minSalary || 0)
})

// Sort options for dropdown
const sortOptions = ref([
  { label: 'Newest First', value: 'published_at', isAscending: false, icon: 'mdi:calendar' },
  { label: 'Salary (High to Low)', value: 'salary', isAscending: false, icon: 'mdi:currency-usd' },
  { label: 'Salary (Low to High)', value: 'salary', isAscending: true, icon: 'mdi:currency-usd' },
  {
    label: 'Upcoming Deadlines',
    value: 'expires_at',
    isAscending: true,
    icon: 'mdi:clock-outline',
  },
  {
    label: 'Company Name',
    value: 'company',
    isAscending: true,
    icon: 'mdi:sort-alphabetical-ascending',
  },
])

// View mode (grid or list)
const viewMode = ref<'grid' | 'list'>('grid')

// Active sort option
const activeSortOption = ref(sortOptions.value[0])

// Create filter chips for location, company, and type
const filterChips = computed(() => {
  const chips = []

  // Add location chips based on available options
  if (filters.value.location.options.length > 0) {
    filters.value.location.options.forEach((option) => {
      chips.push({
        id: `location-${option.key}`,
        label: option.value,
        value: option.key,
        type: 'location',
        active: filters.value.location.value?.key === option.key,
        icon: 'uil:location-point',
      })
    })
  }

  // Add company chips
  if (filters.value.company.options.length > 0) {
    filters.value.company.options.forEach((option) => {
      chips.push({
        id: `company-${option.key}`,
        label: option.value,
        value: option.key,
        type: 'company',
        active: filters.value.company.value?.key === option.key,
        icon: 'uil:building',
      })
    })
  }

  // Add employment type chips
  if (filters.value.type.options.length > 0) {
    filters.value.type.options.forEach((option) => {
      chips.push({
        id: `type-${option.key}`,
        label: option.value,
        value: option.key,
        type: 'type',
        active: filters.value.type.value?.key === option.key,
        icon: 'uil:clock',
      })
    })
  }

  // Add tag chips
  if (filters.value.tags && filters.value.tags.length > 0) {
    filters.value.tags.forEach((tag) => {
      chips.push({
        id: `tag-${tag}`,
        label: tag,
        value: tag,
        type: 'tag',
        active: true,
        icon: 'mdi:tag',
      })
    })
  }

  return chips
})

// Dropdown selection handler
const selectDropdown = (key: string, value: string) => {
  filters.value[key].value = value
  dropDownInputs.value[key].showSuggestions = false
  props.changeFilters()
}

// Filter chip selection handler
const handleChipSelect = (chip: any) => {
  if (chip.type === 'location') {
    filters.value.location.value = chip.active ? null : { key: chip.value, value: chip.label }
  } else if (chip.type === 'company') {
    filters.value.company.value = chip.active ? null : { key: chip.value, value: chip.label }
  } else if (chip.type === 'type') {
    filters.value.type.value = chip.active ? null : { key: chip.value, value: chip.label }
  } else if (chip.type === 'tag') {
    emit('removeTag', chip.value)
  }

  props.changeFilters()
}

// Clear all filters
const clearAllFilters = () => {
  filters.value = {
    location: { value: '', options: filters.value.location.options },
    company: { value: '', options: filters.value.company.options },
    type: { value: '', options: filters.value.type.options },
    tags: [],
  }

  emit('clearFilters')
  props.changeFilters()
}

// Handle sort change
const handleSortChange = (option: any) => {
  activeSortOption.value = option
  // You would typically emit an event here to handle sorting
}

// Handle view mode change
const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
  // You would typically emit an event here to handle view mode change
}

// Click outside handler for dropdowns
const onClickOutside = (event: MouseEvent) => {
  const fields = Object.keys(dropDownInputs.value)

  fields.forEach((field) => {
    if (
      !dropDownInputs.value[field].input?.contains(event.target as Node) &&
      !dropDownInputs.value[field].ref?.contains(event.target as Node)
    ) {
      dropDownInputs.value[field].showSuggestions = false
    }
  })
}

// Add and remove event listener
onMounted(() => {
  document.addEventListener('click', onClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
})
</script>

<template>
  <div class="space-y-4">
    <!-- Card with improved filter UI -->
    <div class="bg-primary-900/40 backdrop-blur-sm rounded-xl border border-primary-800/30 p-4">
      <div class="flex flex-col lg:flex-row gap-4">
        <!-- Quick filters -->
        <div class="flex-grow">
          <FilterChips
            :chips="filterChips"
            :multi-select="true"
            @select="handleChipSelect"
            @clear="clearAllFilters"
          />
        </div>

        <!-- View mode toggle and sort -->
        <div class="flex items-center gap-2 flex-shrink-0">
          <!-- View mode toggle -->
          <button
            class="p-2 rounded-lg bg-primary-900/50 border border-primary-800/30 hover:bg-primary-800/50 transition-colors"
            @click="toggleViewMode"
          >
            <Icon
              :name="viewMode === 'grid' ? 'mdi:view-grid' : 'mdi:view-list'"
              class="w-5 h-5 text-primary-300"
            />
          </button>

          <!-- Sort dropdown -->
          <SortDropdown
            :model-value="activeSortOption.value"
            :is-ascending="activeSortOption.isAscending"
            :options="sortOptions"
            @change="handleSortChange"
          />
        </div>
      </div>

      <!-- Advanced filters section (collapsible) -->
      <div class="mt-4 flex flex-col lg:flex-row gap-4">
        <!-- Location filter -->
        <div class="relative flex-grow">
          <label class="block text-xs font-medium mb-1 text-gray-400">Location</label>
          <div
            :ref="(ref) => (dropDownInputs.location.input = ref)"
            class="relative border border-primary-800/30 rounded-lg"
          >
            <Icon
              name="uil:location-point"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
            />
            <input
              v-model="filters.location.value.value"
              type="text"
              class="pl-10 w-full py-2 bg-primary-900/50 text-white rounded-lg border-none focus:ring-primary-500 transition-all hover:bg-primary-800/50"
              placeholder="Search location..."
              @focus="dropDownInputs.location.showSuggestions = true"
            />
          </div>
          <!-- Dropdown suggestions -->
          <div
            v-if="dropDownInputs.location.showSuggestions"
            :ref="(ref) => (dropDownInputs.location.ref = ref)"
            class="absolute z-10 mt-1 w-full bg-primary-900/90 rounded-lg shadow-lg border border-primary-800/30 py-1 max-h-[200px] overflow-y-auto backdrop-blur-md"
          >
            <button
              :key="'location_all'"
              class="w-full text-left px-4 py-2 hover:bg-primary-800/50 text-gray-300 text-sm transition-colors"
              @click="selectDropdown('location', '')"
            >
              <Icon
                name="uil:location-point"
                class="inline-block mr-2 w-4 h-4 text-gray-400"
              />
              All Locations
            </button>
            <button
              v-for="option in filters.location.options"
              :key="option.key"
              class="w-full text-left px-4 py-2 hover:bg-primary-800/50 text-gray-300 text-sm transition-colors"
              @click="selectDropdown('location', option)"
            >
              <Icon
                name="uil:location-point"
                class="inline-block mr-2 w-4 h-4 text-gray-400"
              />
              {{ option.value }}
            </button>
          </div>
        </div>

        <!-- Company filter -->
        <div class="relative flex-grow">
          <label class="block text-xs font-medium mb-1 text-gray-400">Company</label>
          <div
            :ref="(ref) => (dropDownInputs.company.input = ref)"
            class="relative border border-primary-800/30 rounded-lg"
          >
            <Icon
              name="uil:building"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
            />
            <input
              v-model="filters.company.value.value"
              type="text"
              class="pl-10 w-full py-2 bg-primary-900/50 text-white rounded-lg border-none focus:ring-primary-500 transition-all hover:bg-primary-800/50"
              placeholder="Search company..."
              @focus="dropDownInputs.company.showSuggestions = true"
            />
          </div>
          <!-- Dropdown suggestions -->
          <div
            v-if="dropDownInputs.company.showSuggestions"
            :ref="(ref) => (dropDownInputs.company.ref = ref)"
            class="absolute z-10 mt-1 w-full bg-primary-900/90 rounded-lg shadow-lg border border-primary-800/30 py-1 max-h-[200px] overflow-y-auto backdrop-blur-md"
          >
            <button
              :key="'company_all'"
              class="w-full text-left px-4 py-2 hover:bg-primary-800/50 text-gray-300 text-sm transition-colors"
              @click="selectDropdown('company', '')"
            >
              <Icon
                name="uil:building"
                class="inline-block mr-2 w-4 h-4 text-gray-400"
              />
              All Companies
            </button>
            <button
              v-for="option in filters.company.options"
              :key="option.key"
              class="w-full text-left px-4 py-2 hover:bg-primary-800/50 text-gray-300 text-sm transition-colors"
              @click="selectDropdown('company', option)"
            >
              <Icon
                name="uil:building"
                class="inline-block mr-2 w-4 h-4 text-gray-400"
              />
              {{ option.value }}
            </button>
          </div>
        </div>

        <!-- Type filter -->
        <div class="relative flex-grow">
          <label class="block text-xs font-medium mb-1 text-gray-400">Employment Type</label>
          <div
            :ref="(ref) => (dropDownInputs.type.input = ref)"
            class="relative border border-primary-800/30 rounded-lg"
          >
            <Icon
              name="uil:clock"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
            />
            <input
              v-model="filters.type.value.value"
              type="text"
              class="pl-10 w-full py-2 bg-primary-900/50 text-white rounded-lg border-none focus:ring-primary-500 transition-all hover:bg-primary-800/50"
              placeholder="Select type..."
              @focus="dropDownInputs.type.showSuggestions = true"
            />
          </div>
          <!-- Dropdown suggestions -->
          <div
            v-if="dropDownInputs.type.showSuggestions"
            :ref="(ref) => (dropDownInputs.type.ref = ref)"
            class="absolute z-10 mt-1 w-full bg-primary-900/90 rounded-lg shadow-lg border border-primary-800/30 py-1 max-h-[200px] overflow-y-auto backdrop-blur-md"
          >
            <button
              :key="'type_all'"
              class="w-full text-left px-4 py-2 hover:bg-primary-800/50 text-gray-300 text-sm transition-colors"
              @click="selectDropdown('type', '')"
            >
              <Icon
                name="uil:clock"
                class="inline-block mr-2 w-4 h-4 text-gray-400"
              />
              All Types
            </button>
            <button
              v-for="option in filters.type.options"
              :key="option.key"
              class="w-full text-left px-4 py-2 hover:bg-primary-800/50 text-gray-300 text-sm transition-colors"
              @click="selectDropdown('type', option)"
            >
              <Icon
                name="uil:clock"
                class="inline-block mr-2 w-4 h-4 text-gray-400"
              />
              {{ option.value }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease-out;
  max-height: 1000px;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
