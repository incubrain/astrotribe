<script setup lang="ts">
import { computed } from 'vue'
import { FEATURES } from '#shared/constants'
import { useContentCounts } from '~/composables/useContentCounts'

const props = defineProps<{
  feature: string
  remaining: number
  show: boolean
}>()

// Get content counts composable
const contentCounts = useContentCounts()

// Import feature config directly from constants
const featureConfig = computed(() => FEATURES[props.feature])

// Get all benefits from the composable
const allBenefits = computed(() => contentCounts.benefits.value ?? [])

// Split benefits into left and right columns
const leftBenefits = computed(() => {
  const midpoint = Math.ceil(allBenefits.value.length / 2)
  return allBenefits.value.slice(0, midpoint)
})

const rightBenefits = computed(() => {
  const midpoint = Math.ceil(allBenefits.value.length / 2)
  return allBenefits.value.slice(midpoint)
})

// Get planet type from composable
const planetType = computed(() => contentCounts.getPlanetType(props.feature))
const isModelLoaded = ref(false)
const handleModelLoaded = () => {
  isModelLoaded.value = true
}

// 9. Lifecycle Hooks
onMounted(() => {
  // Add animation class to body when component mounts
  document.body.classList.add('stars-background')

  // Simulate model loading in 1 second
  setTimeout(() => {
    isModelLoaded.value = true
  }, 1000)
})
</script>

<template>
  <div
    v-if="show"
    class="mt-6 bg-primary-800/90 backdrop-blur-sm rounded-lg p-8 border-2 border-amber-700/30 shadow-lg shadow-black/50 overflow-hidden"
  >
    <!-- Top gradient accent to match overlay -->
    <div
      class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500/80 via-amber-400/60 to-amber-500/80"
    ></div>

    <div class="text-center mb-8">
      <h3 class="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
        <span class="text-amber-300 drop-shadow-lg"
          >Access the Definitive Space Industry Database</span
        >
      </h3>
      <p class="text-gray-300 text-lg md:text-xl">
        Unlock <span class="text-amber-400 font-semibold">{{ contentCounts.fullTotal }}</span> more
        items and get unlimited access to all content.
      </p>
    </div>

    <div class="mb-8">
      <h4 class="font-medium text-white text-xl mb-6 text-center flex items-center justify-center">
        <Icon
          name="mdi:star"
          class="text-amber-300 mr-2"
        />
        Pro Benefits
      </h4>

      <!-- Three-column layout with planet in center -->
      <div class="grid grid-cols-[1fr,240px,1fr] items-center justify-center gap-8">
        <!-- Left column - text aligned right -->
        <div class="space-y-4 flex flex-grow flex-col lg:text-right lg:items-end">
          <div
            v-for="(benefit, index) in leftBenefits"
            :key="`left-${index}`"
            class="flex items-start text-right"
          >
            <span class="text-gray-300 text-base">{{ benefit.text }}</span>
            <Icon
              :name="benefit.icon"
              class="w-5 h-5 text-amber-400 mx-2 flex-shrink-0 mt-0.5"
            />
          </div>
        </div>

        <!-- Center column with planet -->
        <div
          v-motion
          :initial="{ opacity: 0, scale: 0.9 }"
          :visibleOnce="{
            opacity: 1,
            scale: 1,
            transition: { type: 'spring', stiffness: 150, damping: 15 },
          }"
          class="flex justify-center"
        >
          <div
            class="relative w-full aspect-square rounded-full overflow-hidden bg-primary-900/30 shadow-xl shadow-amber-900/10 transition-colors duration-700"
          >
            <IBPlanetModel
              :planet-id="planetType"
              :auto-rotate="true"
              @model-loaded="handleModelLoaded"
            />
          </div>
        </div>

        <!-- Right column - text aligned left -->
        <div class="flex flex-grow flex-col space-y-4 lg:text-left">
          <div
            v-for="(benefit, index) in rightBenefits"
            :key="`right-${index}`"
            class="flex items-start"
          >
            <Icon
              :name="benefit.icon"
              class="w-5 h-5 text-amber-400 mr-2 flex-shrink-0 mt-0.5"
            />
            <span class="text-gray-300 text-base">{{ benefit.text }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="text-center">
      <NuxtLink to="/settings/payments">
        <!-- Enhanced CTA button with glow effect -->
        <PrimeButton
          class="px-10 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 border-none shadow-lg text-lg font-medium transition-all duration-300 hover:shadow-amber-500/20 hover:shadow-xl group"
        >
          <Icon
            name="mdi:star"
            class="mr-2 text-white group-hover:animate-ping"
          />
          Upgrade Now
        </PrimeButton>
      </NuxtLink>
    </div>
  </div>
</template>
