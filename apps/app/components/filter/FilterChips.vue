<template>
  <div class="relative">
    <!-- Left shadow gradient for indicating scroll -->
    <div
      v-if="canScrollLeft"
      class="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none"
    ></div>

    <!-- Scrollable chips container -->
    <div
      ref="containerRef"
      class="flex overflow-x-auto py-2 px-1 scrollbar-hide relative"
      @scroll="handleScroll"
    >
      <!-- Clear all filter chip - shown when at least one filter is active -->
      <ClientOnly>
        <button
          v-if="clientSideOnly && hasActiveFilters"
          class="flex-shrink-0 px-3 py-2 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-medium mr-2 focus:outline-none hover:bg-red-500/20 transition-colors"
          @click="$emit('clear')"
        >
          <div class="flex items-center gap-1">
            <Icon
              name="mdi:close"
              class="w-4 h-4"
            />
            <span>Clear All</span>
          </div>
        </button>
      </ClientOnly>

      <!-- Filter chips -->
      <button
        v-for="(chip, index) in chips"
        :key="`filter-chip-${index}`"
        class="flex-shrink-0 px-3 py-2 rounded-full text-sm font-medium mr-2 focus:outline-none transition-colors border"
        :class="[
          chip.active
            ? 'border-primary-500/30 bg-primary-500/10 text-primary-400 hover:bg-primary-500/20'
            : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:bg-gray-700/50',
        ]"
        @click="handleChipClick(chip)"
      >
        <div class="flex items-center gap-1">
          <Icon
            v-if="chip.icon"
            :name="chip.icon"
            class="w-4 h-4"
          />
          <span>{{ chip.label }}</span>
          <span
            v-if="chip.count"
            class="bg-gray-700 text-gray-300 px-1.5 rounded-full text-xs"
          >
            {{ chip.count }}
          </span>
        </div>
      </button>
    </div>

    <!-- Right shadow gradient for indicating scroll -->
    <div
      v-if="canScrollRight"
      class="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onBeforeUnmount, nextTick } from 'vue'

interface FilterChip {
  id: string
  label: string
  value: string | number
  active?: boolean
  count?: number
  icon?: string
  type?: string
}

const props = defineProps<{
  chips: FilterChip[]
  multiSelect?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:chips', chips: FilterChip[]): void
  (e: 'select', chip: FilterChip): void
  (e: 'clear'): void
}>()

// Refs for scroll shadows
const containerRef = ref<HTMLElement | null>(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)
const clientSideOnly = ref(false)

// Compute if any filter is active to show clear button
const hasActiveFilters = computed(() => props.chips.some((chip) => chip.active))

// Handle scroll events to show/hide shadows
const handleScroll = () => {
  if (!containerRef.value) return

  const { scrollLeft, scrollWidth, clientWidth } = containerRef.value
  canScrollLeft.value = scrollLeft > 0
  canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 5 // Small buffer
}

// Handle chip click
const handleChipClick = (clickedChip: FilterChip) => {
  let updatedChips: FilterChip[]

  if (props.multiSelect) {
    // Toggle this chip's active state
    updatedChips = props.chips.map((chip) =>
      chip.id === clickedChip.id ? { ...chip, active: !chip.active } : chip,
    )
  } else {
    // Single select: activate only this chip
    updatedChips = props.chips.map((chip) => ({
      ...chip,
      active: chip.id === clickedChip.id ? !chip.active : false,
    }))
  }

  emit('update:chips', updatedChips)
  emit('select', { ...clickedChip, active: !clickedChip.active })
}

// Check scroll state on mount and when chips change
onMounted(() => {
  clientSideOnly.value = true
  if (containerRef.value) {
    // Initial check
    handleScroll()

    // Use ResizeObserver to detect container size changes
    const resizeObserver = new ResizeObserver(() => {
      handleScroll()
    })

    resizeObserver.observe(containerRef.value)

    // Cleanup
    onBeforeUnmount(() => {
      if (containerRef.value) {
        resizeObserver.unobserve(containerRef.value)
      }
      resizeObserver.disconnect()
    })
  }
})

watch(
  () => props.chips.length,
  () => {
    // Wait for DOM update
    nextTick(() => {
      handleScroll()
    })
  },
)
</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
