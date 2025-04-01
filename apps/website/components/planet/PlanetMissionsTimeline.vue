<script setup lang="ts">
// 1. Imports
import type { Mission } from '~/types/solarsystem'

// 2. Component Options
defineOptions({
  name: 'PlanetMissionsTimeline',
})

// 3. Props and Emits
const props = defineProps<{
  previousMissions: Mission[]
  upcomingMissions: Mission[]
}>()
</script>

<template>
  <div class="mb-16">
    <h2 class="text-3xl font-bold mb-8">Space Missions</h2>

    <!-- Previous Missions -->
    <h3 class="text-2xl font-semibold mb-4 text-primary-400">Previous Missions</h3>
    <div class="mb-8 relative overflow-x-auto pb-4">
      <!-- Timeline line -->
      <div class="absolute left-0 right-0 h-1 top-20 bg-primary-800 max-w-[2000px]"></div>

      <!-- Timeline events -->
      <div
        class="flex space-x-8 mb-4"
        :class="previousMissions.length > 3 ? 'min-w-max' : ''"
      >
        <div
          v-for="mission in previousMissions"
          :key="mission.name"
          class="min-w-[200px] max-w-[300px]"
        >
          <div class="flex flex-col items-center">
            <div class="w-4 h-4 rounded-full bg-primary-400 mb-2 z-10"></div>
            <p class="font-bold text-primary-400 text-center">{{ mission.year }}</p>
            <div
              class="text-center mt-4 bg-primary-900/30 backdrop-blur-sm p-4 rounded-lg border border-primary-800/30"
            >
              <h4 class="font-bold text-lg">{{ mission.name }}</h4>
              <p class="text-gray-300 text-sm mt-2">{{ mission.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upcoming Missions -->
    <template v-if="upcomingMissions.length > 0">
      <h3 class="text-2xl font-semibold mb-4 text-primary-400">Upcoming Missions</h3>
      <div class="relative overflow-x-auto pb-4">
        <!-- Timeline line -->
        <div class="absolute left-0 right-0 h-1 top-20 bg-primary-800 max-w-[2000px]"></div>

        <!-- Timeline events -->
        <div
          class="flex space-x-8 mb-4"
          :class="upcomingMissions.length > 3 ? 'min-w-max' : ''"
        >
          <div
            v-for="mission in upcomingMissions"
            :key="mission.name"
            class="min-w-[200px] max-w-[300px]"
          >
            <div class="flex flex-col items-center">
              <div class="w-4 h-4 rounded-full bg-primary-400 mb-2 z-10"></div>
              <p class="font-bold text-primary-400 text-center">{{ mission.year }}</p>
              <div
                class="text-center mt-4 bg-primary-800/30 backdrop-blur-sm p-4 rounded-lg border border-primary-700/30"
              >
                <h4 class="font-bold text-lg">{{ mission.name }}</h4>
                <p class="text-gray-300 text-sm mt-2">{{ mission.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div
      v-else
      class="text-gray-300 text-center py-4"
    >
      No upcoming missions planned for this planet yet.
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
