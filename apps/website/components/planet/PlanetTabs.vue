<script setup lang="ts">
// 1. Imports
import { ref } from 'vue'
import type { Planet } from '~/types/solarsystem'

// 2. Component Options
defineOptions({
  name: 'PlanetTabs',
})

// 3. Props and Emits
const props = defineProps<{
  planets: Planet[]
  selectedPlanet: string
}>()

const emit = defineEmits<{
  'update:selectedPlanet': [value: string]
}>()

// 4. Methods
const changePlanet = (planetId: string) => {
  if (planetId === props.selectedPlanet) return
  emit('update:selectedPlanet', planetId)
}
</script>

<template>
  <div class="wrapper py-4 border-b border-primary-800">
    <div class="flex justify-center space-x-4 md:space-x-8 overflow-x-auto no-scrollbar">
      <button
        v-for="planet in planets"
        :key="planet.id"
        class="px-4 py-2 text-sm md:text-base transition-all duration-300"
        :class="
          selectedPlanet === planet.id
            ? 'text-primary-400 border-b-2 border-primary-400'
            : 'text-gray-400 hover:text-primary-300'
        "
        @click="changePlanet(planet.id)"
      >
        {{ planet.name }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
