<script setup lang="ts">
// 1. Imports
import type { Timeline } from '~/types/solarsystem'

// 2. Component Options
defineOptions({
  name: 'DiscoveryTimeline',
})

// 3. Props and Emits
const props = defineProps<{
  events: Timeline[]
  title?: string
}>()
</script>

<template>
  <div class="mb-16">
    <h2 class="text-3xl font-bold mb-6">{{ title || 'Discovery & Exploration Timeline' }}</h2>
    <div class="relative">
      <!-- Timeline line -->
      <div class="absolute left-0 right-0 h-1 top-8 bg-primary-800"></div>

      <!-- Timeline events -->
      <div class="relative py-10 overflow-x-auto">
        <div
          class="flex justify-between items-start"
          :style="{ width: events.length > 4 ? `${events.length * 10}rem` : '100%' }"
        >
          <div
            v-for="(event, index) in events"
            :key="index"
            class="flex flex-col items-center"
            :style="{ minWidth: '10rem' }"
          >
            <div class="w-4 h-4 rounded-full bg-primary-400 mb-2 z-10"></div>
            <p class="font-bold text-primary-400 text-center">{{ event.year }}</p>
            <p class="text-sm text-center mt-2 max-w-xs px-2">{{ event.event }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* For WebKit browsers (Chrome, Safari) */
::-webkit-scrollbar {
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.5);
}

/* For Firefox */
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1);
}
</style>
