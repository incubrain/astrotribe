<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'

interface BortleLevel {
  level: number
  name: string
  description: string
}

// Bortle Scale Levels
const bortleScaleLevels: BortleLevel[] = [
  {
    level: 1,
    name: 'Excellent Dark Sky',
    description:
      'A pristine night sky with the Zodiacal light, gegenschein, and airglow visible. The Milky Way casts shadows and thousands of stars are visible to the naked eye.',
  },
  {
    level: 3,
    name: 'Rural Sky',
    description:
      'Some light pollution evident at the horizon. The Milky Way still shows much structure and is visible across the entire sky. About 5000 stars visible to the naked eye.',
  },
  {
    level: 5,
    name: 'Suburban Sky',
    description:
      'Significant light pollution. The Milky Way is only visible near the zenith. Clouds are noticeably brighter than the sky. About 500 stars visible to the naked eye.',
  },
  {
    level: 7,
    name: 'City Sky',
    description:
      'The entire sky has a grayish-white hue. The Milky Way is completely invisible. Strong light sources are evident in all directions. Only about 50 stars visible.',
  },
  {
    level: 9,
    name: 'Inner City Sky',
    description:
      'Entire sky is brightly lit. Most people never experience natural darkness and rarely see any stars at all. Even the brightest celestial objects are difficult to see.',
  },
]

// State
const selectedBortleScale = ref<number>(3) // Default to rural sky
const skyRef = ref<HTMLElement | null>(null)
const isScaleInfoOpen = ref(false)
const isSkyQualityInfoOpen = ref(false)

// Get current Bortle info
const selectedBortleInfo = computed(() => {
  return (
    bortleScaleLevels.find((level) => level.level === selectedBortleScale.value) ||
    bortleScaleLevels[1]
  )
})

// Calculate opacity based on Bortle scale
const opacity = computed(() => (selectedBortleScale.value - 1) / 9)

// Light pollution overlay style
const lightPollutionStyle = computed(() => {
  // Maps Bortle level 1-9 to increasingly opaque light pollution
  const opacityValue = (selectedBortleScale.value - 1) / 9
  return { opacity: opacityValue }
})

// Update stars based on Bortle scale
const updateStars = () => {
  const visibilityFactor = 1 - (selectedBortleScale.value - 1) / 8

  stars.value.forEach((star) => {
    const adjustedVisibility = star.brightness * visibilityFactor
    star.style.opacity = Math.max(0, adjustedVisibility)
  })
}

// Select a Bortle level
const selectBortleLevel = (level: number) => {
  selectedBortleScale.value = level
}

// Watch for changes to update stars
watch(selectedBortleScale, updateStars)

const { stars, isClient } = useStarfield(30)

// Initialize stars on mount
onMounted(() => {
  updateStars()
})
</script>

<template>
  <section class="py-16 my-8">
    <LandingTitle
      title="Light Pollution Simulator"
      subtitle="See how light pollution affects our view of the night sky"
      class="mb-12"
    />

    <div class="px-6">
      <div class="relative min-h-[400px] overflow-hidden rounded-xl background">
        <!-- Info Buttons -->
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
              </div>
            </transition>
          </div>
        </div>

        <!-- Night sky background with stars -->
        <div
          v-if="isClient"
          ref="skyRef"
          class="absolute inset-0 bg-primary-950"
        >
          <!-- Stars -->
          <div
            v-for="star in stars"
            :key="star.id"
            class="absolute rounded-full bg-white"
            :style="star.style"
          />

          <!-- Light pollution overlay with variable opacity -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-orange-500/80 to-blue-900/60 pointer-events-none transition-opacity duration-700"
            :style="lightPollutionStyle"
          ></div>

          <!-- Info overlay -->
          <div class="absolute left-4 bottom-4 max-w-md">
            <div class="bg-black/70 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <h3 class="text-white text-lg font-bold mb-2"
                >Bortle Scale: Level {{ selectedBortleScale }}</h3
              >
              <p class="text-white text-sm">{{ selectedBortleInfo.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8">
        <h3 class="text-lg font-semibold mb-4 text-center">Select a Bortle Scale Level</h3>
        <div class="flex justify-between items-center">
          <template
            v-for="level in [1, 3, 5, 7, 9]"
            :key="level"
          >
            <button
              class="flex flex-col items-center"
              :class="{
                'opacity-100': selectedBortleScale === level,
                'opacity-60': selectedBortleScale !== level,
              }"
              @click="selectBortleLevel(level)"
            >
              <div
                class="w-12 h-12 rounded-full mb-2 flex items-center justify-center text-white font-bold"
                :class="
                  selectedBortleScale === level
                    ? 'ring-2 ring-primary-400 ring-offset-2 ring-offset-primary-900'
                    : ''
                "
                :style="{
                  background: `rgba(${level * 20}, ${Math.max(0, 150 - level * 10)}, ${Math.max(0, 255 - level * 25)})`,
                }"
              >
                {{ level }}
              </div>
              <span class="text-xs text-white">{{
                bortleScaleLevels.find((l) => l.level === level)?.name
              }}</span>
            </button>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

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
