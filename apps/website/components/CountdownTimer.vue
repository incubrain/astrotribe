<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { usePersona } from '~/composables/usePersona'

const { activePersona } = usePersona()

const props = defineProps<{
  targetDate: Date
  expiredCallback?: () => void
  color?: string
  animateDigits?: boolean
}>()

// Emit events
const emit = defineEmits<{
  expired: []
  tick: [{ days: number; hours: number; minutes: number; seconds: number }]
}>()

// Timer state
const countdown = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
})

// Timer interval
let countdownInterval: number | null = null

// Initialize countdown for selected event
const initializeCountdown = (targetDate: Date) => {
  try {
    // Clear any existing interval
    if (countdownInterval) {
      clearInterval(countdownInterval)
    }

    // Set up interval to update countdown every second
    countdownInterval = window.setInterval(() => {
      updateCountdown(targetDate)
    }, 1000)

    // Initial update
    updateCountdown(targetDate)
  } catch (error) {
    console.error('Error initializing countdown:', error)
  }
}

// Update countdown values
const updateCountdown = (targetDate: Date) => {
  try {
    const now = new Date().getTime()
    const targetTime = targetDate.getTime()
    const difference = targetTime - now

    // Handle expired countdown
    if (difference <= 0) {
      handleExpired()
      return
    }

    // Calculate time units
    const days = Math.floor(difference / (1000 * 60 * 60 * 24))
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((difference % (1000 * 60)) / 1000)

    // Update state
    countdown.value = { days, hours, minutes, seconds }

    // Emit tick event
    emit('tick', countdown.value)
  } catch (error) {
    console.error('Error updating countdown:', error)
  }
}

// Handle expired countdown
const handleExpired = () => {
  try {
    if (countdownInterval) {
      clearInterval(countdownInterval)
      countdownInterval = null
    }

    countdown.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }

    // Call callback if provided
    if (props.expiredCallback) {
      props.expiredCallback()
    }

    // Emit expired event
    emit('expired')
  } catch (error) {
    console.error('Error handling expired countdown:', error)
  }
}

// Watch for target date changes
watch(
  () => props.targetDate,
  (newDate) => {
    initializeCountdown(newDate)
  },
)

// Get color to use
const themeColor = computed(() => {
  return props.color || activePersona.value.color || 'blue'
})

// Set up countdown on mount
onMounted(() => {
  if (import.meta.client) {
    initializeCountdown(props.targetDate)
  }
})

// Clean up on unmount
onBeforeUnmount(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
    countdownInterval = null
  }
})
</script>

<template>
  <div class="grid grid-cols-4 gap-4 text-center">
    <div
      v-for="(value, unit) in countdown"
      :key="unit"
      class="countdown-unit p-4 sm:p-6 rounded-lg border border-slate-800/30 bg-slate-800/50 relative overflow-hidden"
    >
      <!-- Subtle background glow matching theme color -->
      <div
        class="absolute inset-0 opacity-20 transition-colors duration-500"
        :class="`bg-${themeColor}-900/20`"
      />

      <div
        class="text-4xl sm:text-5xl font-bold mb-1 relative z-10 transition-colors duration-500"
        :class="`text-${themeColor}-400`"
      >
        {{ value }}
      </div>
      <div class="text-xs text-gray-400 uppercase relative z-10">{{ unit }}</div>
    </div>
  </div>
</template>

<style scoped>
.countdown-unit {
  position: relative;
  overflow: hidden;
  transform: translateZ(0);
}

.countdown-unit::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to right, transparent, rgba(99, 102, 241, 0.1), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.countdown-unit:hover::after {
  transform: translateX(100%);
}
</style>
