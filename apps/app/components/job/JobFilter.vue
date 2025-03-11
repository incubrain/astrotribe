<script setup lang="ts">
interface Options {
  value: string
  options: string[]
}

interface Filters {
  location: Options
  company: Options
  type: Options
  minSalary: number
}

const props = defineProps<{
  modelValue: Filters
  changeFilters: () => void
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Filters): void
  (e: 'removeTag', tag: string): void
}>()

const filters = computed({
  get: () => props.modelValue,
  set: (value) => {
    console.log('EMITTING')
    return emit('update:modelValue', value)
  },
})

const dropDownInputs = ref(
  [
    { key: 'location', icon: 'uil:location-point' },
    { key: 'company', icon: 'uil:building' },
    { key: 'type', icon: 'uil:clock' },
  ].reduce(
    (acc, { key, icon }) => ({
      ...acc,
      [key]: {
        showSuggestions: false,
        input: null,
        ref: null,
        label: `${key[0].toUpperCase()}${key.slice(1)}`,
        icon,
      },
    }),
    {},
  ),
)

// Add new refs for salary display
const formattedSalary = computed(() => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(filters.value.minSalary || 0)
})

const selectDropdown = (key: string, value: string) => {
  filters.value[key].value = value
  dropDownInputs.value[key].showSuggestions = false
  props.changeFilters()
}

// Add click outside handler
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
  <div class="bg-white rounded-xl shadow-sm p-6">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="[field, value] in Object.entries(dropDownInputs)"
        class="relative"
      >
        <label class="block text-sm font-medium text-gray-700 mb-2"> {{ value.label }} </label>
        <div
          :ref="(ref) => (value.input = ref)"
          class="relative border border-gray-300 rounded-md"
        >
          <Icon
            :name="value.icon"
            class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
          />
          <input
            v-model="filters[field].value"
            type="text"
            class="pl-10 w-full rounded-lg border-gray-300 focus:border-jobs-primary focus:ring-jobs-primary transition-all duration-200 hover:border-gray-400"
            placeholder="Search location..."
            @focus="value.showSuggestions = true"
          />
        </div>
        <!-- Popular Locations Dropdown -->
        <div
          v-if="value.showSuggestions"
          :ref="(ref) => (value.ref = ref)"
          class="absolute h-full overflow-y-scroll z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-1"
        >
          <button
            :key="`${field}_all`"
            class="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm transition-colors duration-150"
            @click="selectDropdown(field, '')"
          >
            <Icon
              :name="value.icon"
              class="inline-block mr-2 w-4 h-4 text-gray-400"
            />
            All
          </button>
          <button
            v-for="option in modelValue[field].options"
            :key="option"
            class="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm transition-colors duration-150"
            @click="selectDropdown(field, option)"
          >
            <Icon
              :name="value.icon"
              class="inline-block mr-2 w-4 h-4 text-gray-400"
            />
            {{ option }}
          </button>
        </div>
      </div>
      <!-- Salary Input -->
      <!-- <div>
        <label class="block text-sm font-medium text-gray-700 mb-2"> Minimum salary </label>
        <div class="relative group">
          <div class="flex items-center gap-2 mt-3">
            <Icon
              name="uil:euro"
              class="text-gray-400 w-5 h-5 group-hover:text-jobs-primary transition-colors duration-200"
            />
            <input
              v-model.number="filters.minSalary"
              type="range"
              min="20000"
              max="200000"
              step="1000"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-jobs-primary"
            />
          </div>
          <div class="absolute -top-1 left-0 w-full">
            <div class="relative">
              <div class="absolute left-0 right-0 -top-8 text-center">
                <span class="bg-jobs-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                  {{ formattedSalary }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-between mt-1 text-xs text-gray-500">
          <span>€20,000</span>
          <span>€200,000</span>
        </div>
      </div> -->
    </div>

    <!-- <JobTags
      :tags="tags"
      @select="handleTagSelect"
    /> -->

    <!-- <div
      v-if="filters.tags.length"
      class="mt-6 flex flex-wrap gap-2"
    >
      <div
        v-for="tag in filters.tags"
        :key="tag"
        class="bg-jobs-primary/10 text-jobs-primary px-3 py-1 rounded-full text-sm flex items-center gap-2 animate-fadeIn"
      >
        {{ tag }}
        <button
          class="hover:text-jobs-accent transition-colors"
          @click="removeTagFilter(tag)"
        >
          <Icon
            name="uil:times"
            class="w-4 h-4"
          />
        </button>
      </div>
    </div> -->
  </div>
</template>

<style scoped>
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: #fff;
  border: 2px solid var(--jobs-primary-color);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}

input[type='range']::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

input[type='range']::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #fff;
  border: 2px solid var(--jobs-primary-color);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}

input[type='range']::-moz-range-thumb:hover {
  transform: scale(1.2);
}
</style>
