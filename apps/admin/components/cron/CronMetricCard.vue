<template>
  <PrimeCard class="text-center">
    <template #title>
      {{ title }}
    </template>
    <template #content>
      <div :class="['text-3xl font-bold', colorClass]">
        {{ formattedValue }}
      </div>
      <div
        v-if="trend"
        class="text-sm mt-2"
        :class="trendClass"
      >
        <Icon
          :name="trendIcon"
          class="mr-1"
        />
        {{ trend }}% from last period
      </div>
    </template>
  </PrimeCard>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  value: number
  format?: 'number' | 'percentage' | 'duration'
  trend?: number
  colorClass?: string
}>()

const formatDuration = (ms: number) => {
  if (ms < 1000) return `${ms}ms`
  const seconds = Math.floor(ms / 1000)
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  return `${minutes}m ${seconds % 60}s`
}

const formattedValue = computed(() => {
  if (props.format === 'percentage') return `${props.value.toFixed(1)}%`
  if (props.format === 'duration') return formatDuration(props.value)
  return props.value.toLocaleString()
})

const trendClass = computed(() => ({
  'text-green-500': props.trend && props.trend > 0,
  'text-red-500': props.trend && props.trend < 0,
}))

const trendIcon = computed(() =>
  props.trend && props.trend > 0 ? 'mdi:trending-up' : 'mdi:trending-down',
)
</script>
