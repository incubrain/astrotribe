<!-- components/BortleScaleSimulation.vue -->
<template>
  <div class="relative min-h-[600px] bg-primary-900 p-6 rounded-lg shadow-lg overflow-hidden">
    <!-- Night Sky Canvas -->
    <h3 class="text-xl font-bold text-white mb-4">The Bortle Scale</h3>

    <!-- Info Text -->
    <p class="py-4 text-gray-300">
      Observe how light pollution impacts star visibility at different Bortle scale levels. Class 1
      represents pristine dark skies, while Class 9 shows severe light pollution.
    </p>
    <div class="relative w-full h-96 rounded-md overflow-hidden">
      <div class="absolute top-4 right-4 flex flex-col gap-2 z-30">
        <div class="relative">
          <button
            class="flex items-center justify-center w-8 h-8 bg-blue-900/70 hover:bg-blue-800 text-white rounded-full border border-blue-700"
            @click="isScaleInfoOpen = !isScaleInfoOpen"
          >
            <span class="text-lg font-bold">i</span>
          </button>

          <transition name="fade">
            <div
              v-if="isScaleInfoOpen"
              class="absolute right-0 top-10 w-64 md:w-80 bg-blue-900/90 backdrop-blur-md rounded-lg p-4 border border-blue-800/50 shadow-lg"
            >
              <div class="flex justify-between items-center mb-2">
                <h4 class="text-lg font-bold text-white">Understanding the Bortle Scale</h4>
                <button
                  class="text-gray-400 hover:text-white"
                  @click="isScaleInfoOpen = false"
                >
                  ✕
                </button>
              </div>
              <p class="text-sm text-gray-300 mb-2">
                The Bortle Scale is a nine-level numeric scale that measures the night sky's
                brightness at a particular location. It helps astronomers and stargazers assess
                light pollution's impact on visibility.
              </p>
              <p class="text-sm text-gray-300">
                Lower numbers on the scale (1-3) indicate darker, higher-quality skies with better
                star visibility, while higher numbers (7-9) indicate heavily light-polluted areas
                where few stars are visible.
              </p>
            </div>
          </transition>
        </div>

        <div class="relative">
          <button
            class="flex items-center justify-center w-8 h-8 bg-blue-900/70 hover:bg-blue-800 text-white rounded-full border border-blue-700"
            @click="isSkyQualityInfoOpen = !isSkyQualityInfoOpen"
          >
            <span class="text-lg font-bold">?</span>
          </button>

          <transition name="fade">
            <div
              v-if="isSkyQualityInfoOpen"
              class="absolute right-0 top-10 w-64 md:w-80 bg-blue-900/90 backdrop-blur-md rounded-lg p-4 border border-blue-800/50 shadow-lg"
            >
              <div class="flex justify-between items-center mb-2">
                <h4 class="text-lg font-bold text-white">How to Determine Your Sky Quality</h4>
                <button
                  class="text-gray-400 hover:text-white"
                  @click="isSkyQualityInfoOpen = false"
                >
                  ✕
                </button>
              </div>
              <ul class="list-disc pl-5 text-sm text-gray-300 space-y-1">
                <li>Observe on a clear, moonless night</li>
                <li>Let your eyes adapt to darkness for 20+ minutes</li>
                <li>Look for the faintest visible stars</li>
                <li>Check the visibility of the Milky Way</li>
                <li>Note the appearance of constellations</li>
                <li>Look for light domes from nearby cities</li>
              </ul>
              <p class="text-sm text-gray-300 mt-2">
                Compare your observations with the Bortle Scale descriptions to determine your
                area's light pollution level.
              </p>
            </div>
          </transition>
        </div>
      </div>
      <!-- Base Sky Background -->
      <div
        ref="skyRef"
        class="absolute inset-0 transition-all duration-300"
        :style="skyStyle"
      >
        <!-- Stars -->
        <div
          v-for="star in stars"
          :key="star.id"
          class="absolute rounded-full bg-white"
          :style="star.style"
        />

        <!-- Crescent Moon -->
        <div
          class="absolute top-8 left-8 w-20 h-20"
          :style="{ opacity: moonOpacity }"
        >
          <!-- Moon body (white circle) -->
          <div class="absolute w-20 h-20 rounded-full bg-gray-200"></div>
          <!-- Crescent shadow (overlapping dark circle) -->
          <div class="absolute top-0 left-4 w-16 h-20 rounded-full bg-primary-900"></div>
        </div>

        <!-- Milky Way (visible only in dark skies) -->
        <div
          class="absolute inset-0 transition-opacity duration-500"
          :style="milkyWayStyle"
        >
          <div
            class="absolute h-full w-36 top-0 left-1/3 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -rotate-45"
          ></div>
          <div
            class="absolute h-full w-24 top-0 left-1/2 bg-gradient-to-r from-transparent via-white/3 to-transparent transform -rotate-45"
          ></div>
        </div>

        <!-- Light Pollution Overlay -->
        <div
          class="absolute inset-0 pointer-events-none transition-all duration-500"
          :style="lightPollutionStyle"
        ></div>
      </div>
    </div>

    <!-- Bortle Scale Selector -->
    <div class="mt-6">
      <div class="grid grid-cols-5 gap-2">
        <button
          v-for="level in bortleScaleLevels"
          :key="level.value"
          class="flex flex-col items-center p-3 rounded-lg transition-all duration-300"
          :class="[
            level.value === selectedBortleScale
              ? 'ring-2 ring-blue-400 bg-blue-900/70'
              : 'bg-blue-900/50 hover:bg-blue-800/50',
          ]"
          @click="selectBortleLevel(level.value)"
        >
          <div
            class="w-10 h-10 mb-2 rounded-full flex items-center justify-center text-white font-bold"
            :class="level.bgColor"
          >
            {{ level.value }}
          </div>
          <span class="text-white text-xs text-center">{{ level.name }}</span>
        </button>
      </div>
    </div>

    <!-- Selected Bortle Scale Description -->
    <div class="mt-6 bg-blue-900/50 p-4 rounded-lg border border-blue-800/30">
      <h4 class="text-lg font-bold text-white mb-2">
        {{ selectedBortleInfo.name }} (Class {{ selectedBortleScale }})
      </h4>
      <p class="text-gray-300">{{ selectedBortleInfo.description }}</p>
    </div>

    <!-- Practical Steps Section -->
    <div class="mt-12">
      <h3 class="text-2xl font-bold mb-12 text-white">
        Practical Steps to Fight Light Pollution
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-blue-900/50 rounded-lg p-6 border border-blue-800/30">
          <div class="mb-4 flex justify-center">
            <div
              class="w-12 h-12 bg-blue-700 text-white rounded-full flex items-center justify-center"
            >
              <span class="text-2xl">🛡️</span>
            </div>
          </div>
          <h4 class="text-lg font-bold text-blue-400 mb-2 text-center">Shield Your Lights</h4>
          <ul class="list-disc pl-5 text-gray-300 space-y-2">
            <li>Use fully-shielded fixtures that direct light downward</li>
            <li>Cover bare bulbs to prevent light from shining upward</li>
            <li>Install motion sensors for security lighting</li>
            <li>Adjust existing fixtures with shields or hoods</li>
          </ul>
        </div>

        <div class="bg-blue-900/50 rounded-lg p-6 border border-blue-800/30">
          <div class="mb-4 flex justify-center">
            <div
              class="w-12 h-12 bg-blue-700 text-white rounded-full flex items-center justify-center"
            >
              <span class="text-2xl">💡</span>
            </div>
          </div>
          <h4 class="text-lg font-bold text-blue-400 mb-2 text-center">Use the Right Lights</h4>
          <ul class="list-disc pl-5 text-gray-300 space-y-2">
            <li>Choose warm-colored bulbs (under 3000K)</li>
            <li>Use the minimum brightness necessary</li>
            <li>Replace cool white LEDs with warm alternatives</li>
            <li>Select dark-sky friendly fixtures for outdoor lighting</li>
          </ul>
        </div>

        <div class="bg-blue-900/50 rounded-lg p-6 border border-blue-800/30">
          <div class="mb-4 flex justify-center">
            <div
              class="w-12 h-12 bg-blue-700 text-white rounded-full flex items-center justify-center"
            >
              <span class="text-2xl">⏱️</span>
            </div>
          </div>
          <h4 class="text-lg font-bold text-blue-400 mb-2 text-center"
            >Control When Lights Are On</h4
          >
          <ul class="list-disc pl-5 text-gray-300 space-y-2">
            <li>Install timers to turn off lights when not needed</li>
            <li>Use motion sensors for security and walkway lighting</li>
            <li>Turn off decorative lighting after business hours</li>
            <li>Advocate for smart lighting systems in your community</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

// Bortle Scale Levels
interface BortleLevel {
  value: number
  name: string
  bgColor: string
  description: string
  lightPollution: {
    color: string
    starVisibility: number
    milkyWayVisibility: number
  }
}

const bortleScaleLevels: BortleLevel[] = [
  {
    value: 1,
    name: 'Excellent Dark Sky',
    bgColor: 'bg-blue-900',
    description:
      'A pristine night sky with the Zodiacal light, gegenschein, and airglow visible. The Milky Way casts shadows and thousands of stars are visible to the naked eye.',
    lightPollution: {
      color: 'rgba(20, 30, 70, 0)',
      starVisibility: 1,
      milkyWayVisibility: 1,
    },
  },
  {
    value: 3,
    name: 'Rural Sky',
    bgColor: 'bg-blue-700',
    description:
      'Some light pollution evident at the horizon. The Milky Way still shows much structure and is visible across the entire sky. About 5000 stars visible to the naked eye.',
    lightPollution: {
      color: 'rgba(40, 40, 80, 0.15)',
      starVisibility: 0.9,
      milkyWayVisibility: 0.9,
    },
  },
  {
    value: 5,
    name: 'Suburban Sky',
    bgColor: 'bg-blue-600',
    description:
      'Significant light pollution. The Milky Way is only visible near the zenith. Clouds are noticeably brighter than the sky. About 500 stars visible to the naked eye.',
    lightPollution: {
      color: 'rgba(60, 60, 100, 0.4)',
      starVisibility: 0.5,
      milkyWayVisibility: 0.3,
    },
  },
  {
    value: 7,
    name: 'City Sky',
    bgColor: 'bg-blue-500',
    description:
      'The entire sky has a grayish-white hue. The Milky Way is completely invisible. Strong light sources are evident in all directions. Only about 50 stars visible.',
    lightPollution: {
      color: 'rgba(80, 80, 120, 0.7)',
      starVisibility: 0.2,
      milkyWayVisibility: 0,
    },
  },
  {
    value: 9,
    name: 'Inner City Sky',
    bgColor: 'bg-blue-400',
    description:
      'Entire sky is brightly lit. Most people never experience natural darkness and rarely see any stars at all. Even the brightest celestial objects are difficult to see.',
    lightPollution: {
      color: 'rgba(100, 100, 140, 0.85)',
      starVisibility: 0.05,
      milkyWayVisibility: 0,
    },
  },
]

// State
const selectedBortleScale = ref<number>(3) // Default to rural sky
const stars = ref<any[]>([])
const skyRef = ref<HTMLElement | null>(null)
const isScaleInfoOpen = ref(false)
const isSkyQualityInfoOpen = ref(false)

// Get current Bortle info
const selectedBortleInfo = computed(() => {
  return (
    bortleScaleLevels.find((level) => level.value === selectedBortleScale.value) ||
    bortleScaleLevels[1]
  )
})

// Sky background style
const skyStyle = computed(() => ({
  backgroundColor: 'rgb(10, 20, 40)', // Base dark sky
}))

// Light pollution overlay
const lightPollutionStyle = computed(() => ({
  backgroundColor: selectedBortleInfo.value.lightPollution.color,
}))

// Moon opacity
const moonOpacity = computed(() => {
  return Math.max(0.3, selectedBortleInfo.value.lightPollution.starVisibility)
})

// Milky Way visibility
const milkyWayStyle = computed(() => ({
  opacity: selectedBortleInfo.value.lightPollution.milkyWayVisibility,
}))

// Star generation
const generateStars = () => {
  const starCount = 500
  stars.value = Array.from({ length: starCount }, (_, i) => {
    const size = Math.random() * 2 + 0.5
    const brightness = Math.random()
    const isBright = Math.random() > 0.9

    return {
      id: i,
      style: {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${isBright ? size * 1.5 : size}px`,
        height: `${isBright ? size * 1.5 : size}px`,
        opacity: `${brightness}`,
        animation: isBright ? 'twinkle 4s ease-in-out infinite' : 'none',
        position: 'absolute',
      },
      brightness: brightness, // Store original brightness
    }
  })
}

// Update stars based on Bortle scale
const updateStars = () => {
  const visibilityFactor = selectedBortleInfo.value.lightPollution.starVisibility

  stars.value.forEach((star) => {
    const adjustedVisibility = star.brightness * visibilityFactor
    star.style.opacity = Math.max(0, adjustedVisibility).toString()
  })
}

// Select a Bortle level
const selectBortleLevel = (level: number) => {
  selectedBortleScale.value = level
  updateStars()
}

// Watch for changes to update stars
watch(selectedBortleScale, updateStars)

// Initialize stars on mount
onMounted(() => {
  generateStars()
  updateStars()
})
</script>

<style scoped>
@keyframes twinkle {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
