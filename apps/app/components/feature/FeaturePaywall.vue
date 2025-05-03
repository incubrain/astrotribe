<script setup lang="ts">
import { computed } from 'vue'
import { FEATURES, PlanType } from '#shared/constants'

const props = defineProps<{
  feature: string
  itemsShown: number
  itemsTotal: number
  show: boolean
}>()

// Import feature config directly from constants
const featureConfig = computed(() => FEATURES[props.feature])

// Calculate percentage for progress bar
const percentage = computed(() =>
  Math.min(100, Math.round((props.itemsShown / props.itemsTotal) * 100)),
)
</script>

<template>
  <div
    v-if="show"
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative min-h-[400px]"
  >
    <slot />
    <div
      class="backdrop-blur-xl bg-black/70 pointer-events-none flex flex-col justify-center items-center w-full h-full absolute inset-0 z-50 gap-8 p-8 border-t-2 border-amber-500/60"
    >
      <!-- Top gradient accent with gold for exclusivity -->
      <div
        class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500/80 via-amber-400/60 to-amber-500/80"
      ></div>

      <div class="text-center">
        <div class="text-white font-bold text-2xl md:text-3xl mb-2 drop-shadow-lg">
          {{ itemsShown }} of {{ itemsTotal }} {{ featureConfig.display.name }} shown
        </div>

        <!-- Progress bar with improved visibility -->
        <div
          class="h-4 bg-gray-900/70 rounded-full w-full max-w-md mx-auto overflow-hidden mb-6 border border-gray-800 shadow-inner shadow-black/50"
        >
          <div
            class="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
            :style="{ width: `${percentage}%` }"
          >
            <div class="text-xs font-semibold text-white drop-shadow-md"> {{ percentage }}% </div>
          </div>
        </div>
      </div>

      <!-- Enhanced lock icon with glow effect -->
      <div class="flex justify-center items-center mb-6">
        <div
          class="w-24 h-24 rounded-full bg-primary-900/80 flex items-center justify-center shadow-lg shadow-amber-500/30 border-2 border-amber-600/70 animate-pulse"
        >
          <Icon
            name="mdi:lock"
            class="w-14 h-14 text-amber-400"
          />
        </div>
      </div>

      <!-- Call to action message -->
      <div class="text-center text-white text-lg md:text-2xl font-medium max-w-md">
        <h3 class="text-3xl font-bold mb-3 text-amber-300 drop-shadow-lg">Content Locked</h3>
        <p>Upgrade to unlock all {{ itemsTotal }} {{ featureConfig.display.name.toLowerCase() }}</p>
      </div>
    </div>
  </div>
</template>
