<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

interface SortOption {
  value: string
  label: string
  icon: string
}

const props = defineProps<{
  modelValue: string
  isAscending: boolean
  options?: SortOption[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'update:isAscending', value: boolean): void
  (e: 'change', payload: { sort: string; order: boolean }): void
}>()

// Dropdown state
const isOpen = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const menuRef = ref<HTMLElement | null>(null)

// Default sort options if not provided
const sortOptions = computed(
  () =>
    props.options || [
      { value: 'published_at', label: 'Publication Date', icon: 'mdi:calendar' },
      { value: 'title', label: 'Title', icon: 'mdi:sort-alphabetical-ascending' },
      { value: 'hot_score', label: 'Relevance', icon: 'mdi:fire' },
      { value: 'salary', label: 'Salary', icon: 'mdi:currency-usd' },
      { value: 'expires_at', label: 'Deadline', icon: 'mdi:clock-outline' },
    ],
)

// Current label text based on selected option
const labelText = computed(() => {
  const option = sortOptions.value.find((option) => option.value === props.modelValue)
  return option ? option.label : 'Sort'
})

// Select a sort option
const selectOption = (value: string) => {
  emit('update:modelValue', value)
  emit('change', { sort: value, order: props.isAscending })
  isOpen.value = false
}

// Toggle sort order
const toggleOrder = () => {
  const newOrder = !props.isAscending
  emit('update:isAscending', newOrder)
  emit('change', { sort: props.modelValue, order: newOrder })
}

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (
    isOpen.value &&
    triggerRef.value &&
    menuRef.value &&
    !triggerRef.value.contains(target) &&
    !menuRef.value.contains(target)
  ) {
    isOpen.value = false
  }
}

// Close dropdown on escape key
const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isOpen.value) {
    isOpen.value = false
  }
}

// Set up event listeners
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscapeKey)
})

// Clean up event listeners
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscapeKey)
})

// Update local state if props change
watch(
  () => props.modelValue,
  () => {
    // Could add additional logic here if needed
  },
)

// Persist sort preferences to localStorage
const persistPreferences = () => {
  try {
    localStorage.setItem(
      'job_sort_preference',
      JSON.stringify({
        sort: props.modelValue,
        order: props.isAscending,
      }),
    )
  } catch (error: any) {
    console.error('Failed to save sort preferences:', error)
  }
}

// Call persistPreferences when changes happen
watch([() => props.modelValue, () => props.isAscending], () => persistPreferences(), { deep: true })
</script>

<template>
  <div class="relative">
    <button
      ref="triggerRef"
      class="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors focus:outline-none"
      @click="isOpen = !isOpen"
    >
      <Icon
        :name="sortOptions.find((option) => option.value === modelValue)?.icon || 'mdi:sort'"
        class="w-5 h-5"
      />
      <span class="text-sm">{{ labelText }}</span>
      <Icon
        name="mdi:chevron-down"
        class="w-4 h-4 transition-transform"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        ref="menuRef"
        class="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-20 overflow-hidden"
      >
        <!-- Dropdown header -->
        <div class="px-4 py-2 border-b border-gray-700 text-xs font-medium text-gray-400">
          Sort By
        </div>

        <!-- Options list -->
        <div class="py-1">
          <button
            v-for="option in sortOptions"
            :key="option.value"
            class="w-full text-left px-4 py-2 flex items-center gap-2 text-sm transition-colors"
            :class="[
              modelValue === option.value
                ? 'bg-primary-900/50 text-primary-400'
                : 'text-gray-300 hover:bg-gray-700',
            ]"
            @click="selectOption(option.value)"
          >
            <Icon
              :name="option.icon"
              class="w-5 h-5"
            />
            <span>{{ option.label }}</span>

            <!-- Show checkmark for selected option -->
            <Icon
              v-if="modelValue === option.value"
              name="mdi:check"
              class="w-4 h-4 ml-auto text-primary-400"
            />
          </button>
        </div>

        <!-- Order toggle (ascending/descending) -->
        <div class="border-t border-gray-700">
          <button
            class="w-full text-left px-4 py-2 flex items-center justify-between text-sm text-gray-300 hover:bg-gray-700 transition-colors"
            @click="toggleOrder"
          >
            <span>{{ isAscending ? 'Ascending' : 'Descending' }}</span>
            <Icon
              :name="isAscending ? 'mdi:sort-ascending' : 'mdi:sort-descending'"
              class="w-5 h-5"
            />
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>
