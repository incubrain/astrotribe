<template>
  <span
    :class="[textClass, compact ? 'text-xs' : 'text-sm', singleLine ? 'whitespace-nowrap' : '']"
    :title="fullDate"
  >
    {{ displayText }}
  </span>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  date: string | Date
  prefix?: string
  suffix?: string
  compact?: boolean
  singleLine?: boolean
  textClass?: string
  updateInterval?: number
}>()

const date = computed(() => new Date(props.date))
const fullDate = computed(() =>
  date.value.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }),
)

// Reactive refreshing display text
const now = ref(new Date())
const timer = ref(null as number | null)

// Calculate how long ago
const timeAgo = computed(() => {
  const seconds = Math.floor((now.value.getTime() - date.value.getTime()) / 1000)

  // Future date
  if (seconds < 0) {
    const absSeconds = Math.abs(seconds)
    if (absSeconds < 60) return props.compact ? 'soon' : 'just now'
    if (absSeconds < 3600) return `in ${Math.floor(absSeconds / 60)}m`
    if (absSeconds < 86400) return `in ${Math.floor(absSeconds / 3600)}h`
    if (absSeconds < 2592000) return `in ${Math.floor(absSeconds / 86400)}d`
    if (absSeconds < 31536000) return `in ${Math.floor(absSeconds / 2592000)}mo`
    return `in ${Math.floor(absSeconds / 31536000)}y`
  }

  // Past date
  if (seconds < 60) return props.compact ? 'now' : 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d`
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)}mo`
  return `${Math.floor(seconds / 31536000)}y`
})

// Full display text with optional prefix/suffix
const displayText = computed(() => {
  let text = timeAgo.value
  if (props.prefix) text = `${props.prefix} ${text}`
  if (props.suffix) text = `${text} ${props.suffix}`
  return text
})

// Update time every minute by default or based on prop
const startTimer = () => {
  timer.value = window.setInterval(() => {
    now.value = new Date()
  }, props.updateInterval || 60000) // Default 1 minute
}

onMounted(() => {
  // Initialize current time
  now.value = new Date()
  startTimer()
})

onBeforeUnmount(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})
</script>
