<script setup lang="ts">
// 1. Imports
import { computed } from 'vue'

// 2. Component Options
defineOptions({
  name: 'PlanetGravityComparison',
})

// 3. Props and Emits
const props = defineProps<{
  planetId: string
  planetName: string
}>()

// 4. Data
// Gravity comparison (relative to Earth)
const planetGravity = {
  mercury: 0.38,
  venus: 0.91,
  earth: 1,
  mars: 0.38,
  jupiter: 2.34,
  saturn: 0.93,
  uranus: 0.89,
  neptune: 1.12,
}

// 5. Computed Properties
const gravityRatio = computed(() => {
  return planetGravity[props.planetId as keyof typeof planetGravity]
})

const weightOnPlanet = computed(() => {
  const earthWeight = 100 // 100 pounds on Earth
  return Math.round(earthWeight * gravityRatio.value)
})

const gravityEffectDescription = computed(() => {
  if (gravityRatio.value > 1) {
    return 'This stronger gravity would make you feel heavier and it would be harder to jump or move quickly.'
  } else {
    return 'This weaker gravity would make you feel lighter and you could jump higher and move faster.'
  }
})
</script>

<template>
  <div class="mb-16 bg-primary-900/30 backdrop-blur-sm rounded-lg p-6 border border-primary-800/30">
    <h2 class="text-2xl font-bold mb-6 text-primary-400">Gravity Comparison</h2>
    <div class="flex flex-col md:flex-row items-center gap-8">
      <!-- Visual representation -->
      <div class="md:w-1/2 flex items-center justify-center">
        <div class="relative">
          <img
            src="/tara/tara-astronaut.png"
            alt="Astronaut"
            class="w-32 h-32"
          />
          <div class="flex items-end justify-center gap-8 mt-4">
            <div class="text-center">
              <div
                class="h-16 w-16 flex items-center justify-center bg-blue-500/20 backdrop-blur-sm rounded-lg border border-blue-500/30"
              >
                <span class="font-bold text-2xl">100</span>
              </div>
              <p class="text-sm mt-2">On Earth</p>
            </div>
            <div class="text-center">
              <div
                class="h-16 w-16 flex items-center justify-center bg-purple-500/20 backdrop-blur-sm rounded-lg border border-purple-500/30"
              >
                <span class="font-bold text-2xl">{{ weightOnPlanet }}</span>
              </div>
              <p class="text-sm mt-2">On {{ planetName }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Gravity facts -->
      <div class="md:w-1/2">
        <p class="text-lg">
          On {{ planetName }}, gravity is
          <span class="text-primary-400 font-bold">{{ gravityRatio }}× that of Earth</span>. A
          person weighing 100 pounds on Earth would weigh
          <span class="text-primary-400 font-bold">{{ weightOnPlanet }} pounds</span> on
          {{ planetName }}.
        </p>
        <p class="text-lg mt-4">
          {{ gravityEffectDescription }}
        </p>
      </div>
    </div>
  </div>
</template>
