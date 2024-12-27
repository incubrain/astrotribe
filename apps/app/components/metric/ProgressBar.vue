<!-- components/metrics/ProgressBar.vue -->
<script setup lang="ts">
interface Props {
  value: number
  max: number
  color?: 'purple' | 'green'
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  color: 'green',
  loading: false,
})

const percentage = computed(() => (props.value / props.max) * 100)

const colorClasses = computed(() => ({
  purple: 'bg-purple-400',
  green: 'bg-green-400',
}))
</script>

<template>
  <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
    <div
      v-if="!loading"
      class="h-full rounded-full transition-all duration-500"
      :class="colorClasses[color]"
      :style="{ width: `${percentage}%` }"
    />
    <div
      v-else
      class="h-full w-1/2 animate-pulse bg-gray-600 rounded-full"
    />
  </div>
</template>
