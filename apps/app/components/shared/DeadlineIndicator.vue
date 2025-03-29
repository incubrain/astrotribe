<template>
  <div
    v-if="daysRemaining !== null"
    class="flex items-center gap-2"
    :class="[sizeClass]"
  >
    <div
      class="flex items-center justify-center rounded-full"
      :class="[statusClass, size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4']"
    >
      <Icon
        v-if="showIcon && (status === 'urgent' || status === 'expired')"
        :name="status === 'expired' ? 'mdi:close' : 'mdi:alert'"
        :class="size === 'sm' ? 'w-1.5 h-1.5' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3'"
      />
    </div>
    <span
      v-if="!indicatorOnly"
      :class="[textClass]"
    >
      {{ statusText }}
    </span>
    <template v-if="showTooltip">
      <teleport to="body">
        <div
          v-if="isTooltipVisible"
          class="absolute z-50 bg-gray-800 text-white px-2 py-1 rounded text-xs shadow-lg"
          :style="tooltipStyle"
        >
          {{ tooltipText }}
        </div>
      </teleport>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps({
  deadline: {
    type: [String, Date],
    required: true,
  },
  size: {
    type: String,
    default: 'md', // 'sm', 'md', 'lg'
    validator: (value: string) => ['sm', 'md', 'lg'].includes(value),
  },
  indicatorOnly: {
    type: Boolean,
    default: false,
  },
  showIcon: {
    type: Boolean,
    default: true,
  },
  showTooltip: {
    type: Boolean,
    default: true,
  },
  textClass: {
    type: String,
    default: 'text-sm',
  },
})

// State for tooltip
const isTooltipVisible = ref(false)
const tooltipX = ref(0)
const tooltipY = ref(0)

const tooltipStyle = computed(() => ({
  left: `${tooltipX.value}px`,
  top: `${tooltipY.value}px`,
}))

// Calculate days remaining until deadline
const daysRemaining = computed(() => {
  if (!props.deadline) return null

  const deadlineDate = new Date(props.deadline)
  if (isNaN(deadlineDate.getTime())) return null

  const now = new Date()
  const timeDiff = deadlineDate.getTime() - now.getTime()
  return Math.ceil(timeDiff / (1000 * 3600 * 24))
})

// Determine status based on days remaining
const status = computed(() => {
  if (daysRemaining.value === null) return null
  if (daysRemaining.value < 0) return 'expired'
  if (daysRemaining.value <= 2) return 'urgent'
  if (daysRemaining.value <= 7) return 'approaching'
  return 'open'
})

// Classes based on status
const statusClass = computed(() => {
  if (status.value === 'expired') return 'bg-red-600 animate-pulse'
  if (status.value === 'urgent') return 'bg-orange-500'
  if (status.value === 'approaching') return 'bg-yellow-400'
  return 'bg-green-500'
})

// Text to display
const statusText = computed(() => {
  if (status.value === 'expired') return 'Expired'
  if (status.value === 'urgent')
    return `${daysRemaining.value} day${daysRemaining.value !== 1 ? 's' : ''} left`
  if (status.value === 'approaching') return `Closes in ${daysRemaining.value} days`
  return 'Open'
})

// Text for tooltip
const tooltipText = computed(() => {
  if (!props.deadline) return ''

  const deadlineDate = new Date(props.deadline)
  const formattedDate = deadlineDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  if (status.value === 'expired') return `Expired on ${formattedDate}`
  return `Application deadline: ${formattedDate}`
})

// Dynamic size class
const sizeClass = computed(() => {
  if (props.size === 'sm') return 'text-xs'
  if (props.size === 'lg') return 'text-base'
  return 'text-sm'
})

// Methods to handle tooltip
const showTooltipHandler = (event: MouseEvent) => {
  isTooltipVisible.value = true
  // Position tooltip near the cursor
  tooltipX.value = event.clientX + 10
  tooltipY.value = event.clientY + 10
}

const hideTooltipHandler = () => {
  isTooltipVisible.value = false
}

// Add event listeners for tooltip if enabled
defineExpose({
  showTooltipHandler,
  hideTooltipHandler,
})
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s infinite;
}
</style>
