<script setup lang="ts">
import type { PropType } from 'vue'

type TimelineObject = {
  date: string
  title: string
  body: string
  icon: string
}

const props = defineProps({
  timeline: {
    type: Array as PropType<TimelineObject[]>,
    required: true,
  },
})

// Alternate gradients to create visual interest
const getGradient = (index: number) => {
  const gradients = ['blue', 'purple', 'mixed', 'blue', 'purple'] as const
  return gradients[index % gradients.length]
}
</script>

<template>
  <div class="timeline relative grid w-full gap-6">
    <!-- Timeline connector line with animated gradient -->
    <div
      class="timeline-line absolute left-4 top-5 h-[calc(100%-40px)] w-0.5 bg-gradient-to-b from-primary-400 via-primary-600 to-primary-800"
    ></div>

    <!-- Timeline items -->
    <IBGlass
      v-for="(item, index) in timeline"
      :key="item.title"
      :gradient="getGradient(index)"
      intensity="low"
      interactive
      class="relative ml-8"
    >
      <!-- Timeline dot -->
      <div
        class="timeline-dot absolute -left-12 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary-700"
      >
        <Icon
          :name="item.icon || 'i-lucide-milestone'"
          class="h-4 w-4 text-white"
        />
      </div>

      <div class="flex w-full flex-col justify-center">
        <div class="flex items-baseline justify-between">
          <h2 class="text-lg font-semibold leading-7 xl:leading-9">
            {{ item.title }}
          </h2>
          <span class="text-sm text-primary-400">{{ item.date }}</span>
        </div>

        <p class="mt-4 text-sm font-normal leading-6">
          {{ item.body }}
        </p>
      </div>
    </IBGlass>
  </div>
</template>

<style scoped>
/* Add subtle animation for timeline dots */
.timeline-dot {
  box-shadow: 0 0 15px rgba(var(--color-primary-500), 0.5);
  transition: all 0.3s ease;
}

.group:hover .timeline-dot {
  box-shadow: 0 0 20px rgba(var(--color-primary-400), 0.8);
  transform: scale(1.1);
}

/* Subtle pulse animation for timeline line */
.timeline-line {
  animation: pulse 3s infinite alternate;
  position: relative;
  overflow: hidden;
}

.timeline-line::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(transparent, var(--color-primary-400), transparent);
  animation: flow 4s linear infinite;
}

@keyframes flow {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
}

@keyframes pulse {
  0% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}
</style>
