<!-- components/metrics/LevelProgress.vue -->
<script setup lang="ts">
interface Props {
  level: number
  progress: number
  title?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Vote Master',
  loading: false,
})

// Circular progress calculations
const radius = 30
const circumference = 2 * Math.PI * radius
const progressOffset = computed(() => ((100 - props.progress) / 100) * circumference)
</script>

<template>
  <div
    class="foreground rounded-xl p-4 border-4 border-blue-500/20 bg-blue-500/5 shadow-lg shadow-blue-500/10"
  >
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold flex items-center gap-2">
          <Icon
            name="game-icons:star-medal"
            size="34px"
            class="h-6 w-6 text-yellow-400"
          />
          <span v-if="!loading">Level {{ level }}</span>
          <div
            v-else
            class="h-8 w-20 animate-pulse bg-gray-700 rounded"
          />
        </h2>
        <p class="text-sm opacity-70">{{ title }}</p>
      </div>
      <div class="relative w-20 h-20">
        <svg class="w-full h-full -rotate-90 transform">
          <circle
            cx="40"
            cy="40"
            :r="radius"
            stroke="currentColor"
            stroke-width="4"
            fill="transparent"
            class="text-gray-700"
          />
          <circle
            cx="40"
            cy="40"
            :r="radius"
            stroke="currentColor"
            stroke-width="4"
            fill="transparent"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="progressOffset"
            class="text-blue-500 transition-all duration-500"
          />
        </svg>
        <div
          v-if="!loading"
          class="absolute inset-0 flex items-center justify-center text-blue-500 font-semibold"
        >
          {{ progress }}%
        </div>
        <div
          v-else
          class="absolute inset-0 flex items-center justify-center"
        >
          <div class="h-8 w-8 animate-pulse bg-gray-700 rounded-full" />
        </div>
      </div>
    </div>
  </div>
</template>
