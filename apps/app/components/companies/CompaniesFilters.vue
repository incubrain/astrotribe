<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface FilterOption {
  key: string
  value: string
}

interface CompanyFilter {
  location: { value: any; options: FilterOption[] }
  category: { value: any; options: FilterOption[] }
  type: { value: any; options: FilterOption[] }
  foundingYearRange: { min: number | null; max: number | null }
  tags?: string[]
}

interface Props {
  modelValue: CompanyFilter
  changeFilters: () => void
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: CompanyFilter): void
  (e: 'removeTag', tag: string): void
  (e: 'clearFilters'): void
}>()

const filters = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  },
})

// For dropdown inputs (location, company, type)
const dropDownInputs = ref(
  [
    { key: 'location', icon: 'uil:location-point', label: 'Location' },
    { key: 'category', icon: 'mdi:tag-outline', label: 'Category' },
    { key: 'type', icon: 'mdi:office-building-outline', label: 'Type' },
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

// Create filter chips for location, company, and type
const filterChips = computed(() => {
  const chips = []

  // Add location chips
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

  // Add category chips
  if (filters.value.category.options.length > 0) {
    filters.value.category.options.forEach((option) => {
      chips.push({
        id: `category-${option.key}`,
        label: option.value,
        value: option.key,
        type: 'category',
        active: filters.value.category.value?.key === option.key,
        icon: 'mdi:tag-outline',
      })
    })
  }

  // Add company type chips
  if (filters.value.type.options.length > 0) {
    filters.value.type.options.forEach((option) => {
      chips.push({
        id: `type-${option.key}`,
        label: option.value,
        value: option.key,
        type: 'type',
        active: filters.value.type.value?.key === option.key,
        icon: 'mdi:office-building-outline',
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

// Year range methods
const minYear = 1950
const maxYear = new Date().getFullYear()
const yearRange = ref([
  filters.value.foundingYearRange.min || minYear,
  filters.value.foundingYearRange.max || maxYear,
])

watch(
  yearRange,
  (newRange) => {
    filters.value.foundingYearRange.min = newRange[0]
    filters.value.foundingYearRange.max = newRange[1]
  },
  { deep: true },
)

// Dropdown selection handler
const selectDropdown = (key: string, value: any) => {
  filters.value[key].value = value
  dropDownInputs.value[key].showSuggestions = false
  props.changeFilters()
}

// Filter chip selection handler
const handleChipSelect = (chip: any) => {
  if (chip.type === 'location') {
    filters.value.location.value = chip.active ? null : { key: chip.value, value: chip.label }
  } else if (chip.type === 'category') {
    filters.value.category.value = chip.active ? null : { key: chip.value, value: chip.label }
  } else if (chip.type === 'type') {
    filters.value.type.value = chip.active ? null : { key: chip.value, value: chip.label }
  } else if (chip.type === 'tag') {
    emit('removeTag', chip.value)
  }

  props.changeFilters()
}

// Clear all filters
const clearAllFilters = () => {
  emit('clearFilters')
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
              v-model="filters.location.value"
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

        <!-- Category filter -->
        <div class="relative flex-grow">
          <label class="block text-xs font-medium mb-1 text-gray-400">Category</label>
          <div
            :ref="(ref) => (dropDownInputs.category.input = ref)"
            class="relative border border-primary-800/30 rounded-lg"
          >
            <Icon
              name="mdi:tag-outline"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
            />
            <input
              v-model="filters.category.value"
              type="text"
              class="pl-10 w-full py-2 bg-primary-900/50 text-white rounded-lg border-none focus:ring-primary-500 transition-all hover:bg-primary-800/50"
              placeholder="Search category..."
              @focus="dropDownInputs.category.showSuggestions = true"
            />
          </div>
          <!-- Dropdown suggestions -->
          <div
            v-if="dropDownInputs.category.showSuggestions"
            :ref="(ref) => (dropDownInputs.category.ref = ref)"
            class="absolute z-10 mt-1 w-full bg-primary-900/90 rounded-lg shadow-lg border border-primary-800/30 py-1 max-h-[200px] overflow-y-auto backdrop-blur-md"
          >
            <button
              :key="'category_all'"
              class="w-full text-left px-4 py-2 hover:bg-primary-800/50 text-gray-300 text-sm transition-colors"
              @click="selectDropdown('category', '')"
            >
              <Icon
                name="mdi:tag-outline"
                class="inline-block mr-2 w-4 h-4 text-gray-400"
              />
              All Categories
            </button>
            <button
              v-for="option in filters.category.options"
              :key="option.key"
              class="w-full text-left px-4 py-2 hover:bg-primary-800/50 text-gray-300 text-sm transition-colors"
              @click="selectDropdown('category', option)"
            >
              <Icon
                name="mdi:tag-outline"
                class="inline-block mr-2 w-4 h-4 text-gray-400"
              />
              {{ option.value }}
            </button>
          </div>
        </div>

        <!-- Type filter -->
        <div class="relative flex-grow">
          <label class="block text-xs font-medium mb-1 text-gray-400">Company Type</label>
          <div
            :ref="(ref) => (dropDownInputs.type.input = ref)"
            class="relative border border-primary-800/30 rounded-lg"
          >
            <Icon
              name="mdi:office-building-outline"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
            />
            <input
              v-model="filters.type.value"
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
                name="mdi:office-building-outline"
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
                name="mdi:office-building-outline"
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
