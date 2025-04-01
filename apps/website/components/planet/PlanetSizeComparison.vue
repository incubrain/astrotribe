<script setup lang="ts">
// 1. Imports
import { computed } from 'vue'

// 2. Component Options
defineOptions({
  name: 'PlanetSizeComparison',
})

// 3. Props and Emits
const props = defineProps<{
  planetId: string
  planetName: string
}>()

// 4. Data
// Planet size comparison (diameter in km)
const planetSizes = {
  mercury: 4879,
  venus: 12104,
  earth: 12756,
  mars: 6792,
  jupiter: 142984,
  saturn: 120536,
  uranus: 51118,
  neptune: 49528,
}

// 5. Computed Properties
const sizeRatio = computed(() => {
  const earthSize = planetSizes.earth
  const currentPlanetSize = planetSizes[props.planetId as keyof typeof planetSizes]
  return Math.round((currentPlanetSize / earthSize) * 10) / 10
})

const sizeComparison = computed(() => {
  const ratio = sizeRatio.value
  return ratio > 1 ? 'larger' : 'smaller'
})

const formattedSize = computed(() => {
  return planetSizes[props.planetId as keyof typeof planetSizes].toLocaleString()
})

// Calculate Earth's visual size relative to current planet
const earthSizePercent = computed(() => {
  const percent =
    (planetSizes.earth / planetSizes[props.planetId as keyof typeof planetSizes]) * 100
  // Ensure Earth is always visible with a minimum size
  return Math.max(
    20,
    50 * (planetSizes.earth / planetSizes[props.planetId as keyof typeof planetSizes]),
  )
})
</script>

<template>
  <div class="mb-16 bg-primary-900/30 backdrop-blur-sm rounded-lg p-6 border border-primary-800/30">
    <h2 class="text-2xl font-bold mb-6 text-primary-400">Size Comparison</h2>
    <div class="flex flex-col md:flex-row items-center justify-center gap-8">
      <!-- Visual representation -->
      <div class="relative h-32 w-full md:w-2/3 flex items-center justify-center">
        <!-- Earth for scale -->
        <div class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div
            class="rounded-full bg-blue-500"
            :style="{
              width: `${earthSizePercent}px`,
              height: `${earthSizePercent}px`,
              opacity: 0.7,
            }"
          ></div>
          <p class="text-xs text-center mt-1">Earth</p>
        </div>

        <!-- Current planet -->
        <div class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div
            class="rounded-full bg-purple-500"
            :style="{
              width: '50px',
              height: '50px',
              opacity: 0.7,
              zIndex: 10,
            }"
          ></div>
          <p class="text-xs text-center mt-1">{{ planetName }}</p>
        </div>
      </div>

      <!-- Size facts -->
      <div class="md:w-1/3">
        <p class="text-lg">
          {{ planetName }} has a diameter of
          <span class="text-primary-400 font-bold">{{ formattedSize }} km</span>, making it
          <span class="text-primary-400 font-bold">{{ sizeRatio }}× {{ sizeComparison }}</span> than
          Earth.
        </p>
      </div>
    </div>
  </div>
</template>
