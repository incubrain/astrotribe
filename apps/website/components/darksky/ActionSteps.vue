<script setup lang="ts">
import { ref, onMounted } from 'vue'
import useEmblaCarousel from 'embla-carousel-vue'
import AutoPlay from 'embla-carousel-autoplay'

// Enhanced action step interface with additional properties
interface ActionStep {
  title: string
  description: string
  icon: string
  impactLevel: number // 1-5 scale for impact
  timeCategory: 'quick' | 'moderate' | 'project' // Time categories
  primaryAction: {
    text: string
    url: string
  }
  benefits: string[] // Personal impact metrics
  details: string[] // Additional details (hidden by default)
  resources: Array<{
    title: string
    url: string
  }>
}

const props = defineProps<{
  title?: string
  subtitle?: string
  steps: ActionStep[]
  autoplayDelay?: number
  helpfulResources: Array<{
    title: string
    description: string
    url: string
    icon: string
  }>
}>()

// State for expandable sections
const expandedDetails = ref<{ [key: number]: boolean }>({})

// Toggle details visibility
const toggleDetails = (index: number) => {
  expandedDetails.value[index] = !expandedDetails.value[index]
}

// Check if details are expanded
const isExpanded = (index: number) => {
  return expandedDetails.value[index] || false
}

// Get impact stars based on impact level
const getImpactStars = (level: number) => {
  return Array(5)
    .fill(0)
    .map((_, i) => i < level)
}

// Get time category label and icon
const getTimeCategory = (category: string) => {
  switch (category) {
    case 'quick':
      return {
        label: '1-minute action',
        icon: 'mdi:timer-outline',
        color: 'text-green-400',
        bg: 'bg-green-900/30',
      }
    case 'moderate':
      return {
        label: '5-minute action',
        icon: 'mdi:clock-outline',
        color: 'text-amber-400',
        bg: 'bg-amber-900/30',
      }
    case 'project':
      return {
        label: 'Weekend project',
        icon: 'mdi:calendar-outline',
        color: 'text-blue-400',
        bg: 'bg-blue-900/30',
      }
    default:
      return {
        label: 'Action',
        icon: 'mdi:check',
        color: 'text-primary-400',
        bg: 'bg-primary-900/30',
      }
  }
}

// Create autoplay plugin with stopOnInteraction set to false
const autoPlayPlugin = AutoPlay({
  delay: props.autoplayDelay || 6000,
  stopOnInteraction: false,
  // Ensure it starts automatically
  playOnInit: true,
  // Loop back to start
  rootNode: (emblaRoot) => emblaRoot,
})

// Initialize Embla Carousel
const [emblaRef, emblaApi] = useEmblaCarousel(
  {
    loop: true,
    align: 'center',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 640px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 3 },
    },
    // More responsive behavior
    dragFree: false,
    containScroll: 'trimSnaps',
  },
  [autoPlayPlugin],
)

// Carousel Navigation
const scrollPrev = () => {
  if (emblaApi.value) {
    emblaApi.value.scrollPrev()
    // Restart autoplay after manual navigation
    autoPlayPlugin.play()
  }
}

const scrollNext = () => {
  if (emblaApi.value) {
    emblaApi.value.scrollNext()
    // Restart autoplay after manual navigation
    autoPlayPlugin.play()
  }
}

// Monitor and initialize carousel
onMounted(() => {
  // Make sure emblaApi is initialized
  if (emblaApi.value) {
    // Start autoplay immediately
    autoPlayPlugin.play()
  }
})
</script>

<template>
  <section class="py-16 relative">
    <LandingTitle
      :title="title"
      :subtitle="subtitle"
      class="mb-12"
    />

    <!-- Main Carousel with Embla -->
    <div class="embla-wrapper relative mx-auto max-w-7xl px-8">
      <div class="embla overflow-hidden relative z-50">
        <!-- Carousel reference -->
        <div
          ref="emblaRef"
          class="embla__viewport"
        >
          <!-- Carousel Container -->
          <div class="embla__container py-4">
            <!-- Carousel Slides -->
            <div
              v-for="(step, index) in steps"
              :key="`action-${index}`"
              :class="`embla__slide px-4`"
            >
              <!-- Card Content -->
              <IBGlass
                hover-effect="glow"
                glow-color="blue"
                gradient="mixed"
                intensity="medium"
                interactive
              >
                <div class="flex flex-grow flex-col">
                  <!-- Header with Impact Rating & Time Category -->
                  <div class="flex justify-between items-center mb-6">
                    <!-- Time Category Badge -->
                    <div
                      :class="`${getTimeCategory(step.timeCategory).bg} rounded-full py-1 px-3 flex items-center`"
                    >
                      <Icon
                        :name="getTimeCategory(step.timeCategory).icon"
                        class="mr-1.5"
                        :class="getTimeCategory(step.timeCategory).color"
                        size="16"
                      />
                      <span
                        class="text-xs font-medium"
                        :class="getTimeCategory(step.timeCategory).color"
                      >
                        {{ getTimeCategory(step.timeCategory).label }}
                      </span>
                    </div>

                    <!-- Impact Rating -->
                    <div class="flex items-center">
                      <span class="text-xs text-primary-300 mr-1.5">Impact:</span>
                      <div class="flex">
                        <Icon
                          v-for="(active, i) in getImpactStars(step.impactLevel)"
                          :key="i"
                          name="mdi:star"
                          size="16"
                          :class="active ? 'text-yellow-400' : 'text-neutral-700'"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Icon Header -->
                  <div class="mb-4 flex justify-center">
                    <div
                      class="w-16 h-16 bg-primary-800/70 text-white rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-105"
                    >
                      <Icon
                        :name="step.icon"
                        class="text-primary-300"
                        size="32"
                      />
                    </div>
                  </div>

                  <!-- Title -->
                  <h3 class="text-xl font-bold mb-3 text-white text-center">{{ step.title }}</h3>

                  <!-- Description -->
                  <p class="text-base mb-4 text-primary-200 text-center">
                    {{ step.description }}
                  </p>
                  <!-- Benefits Section -->
                  <div class="mb-5 bg-primary-900/30 rounded-lg p-3">
                    <h4 class="text-sm font-medium text-primary-300 mb-2">Benefits:</h4>
                    <ul class="space-y-1.5">
                      <li
                        v-for="(benefit, benefitIndex) in step.benefits.slice(0, 2)"
                        :key="benefitIndex"
                        class="flex items-start"
                      >
                        <Icon
                          name="mdi:check-circle-outline"
                          class="text-green-400 mr-2 mt-0.5 flex-shrink-0"
                          size="16"
                        />
                        <span class="text-sm text-primary-200">{{ benefit }}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- Primary Action Button -->
                <div class="flex justify-center">
                  <NuxtLink
                    :to="step.primaryAction.url"
                    target="_blank"
                  >
                    <PrimeButton
                      size="small"
                      class="bg-primary-700 hover:bg-primary-600 border-none text-white"
                    >
                      {{ step.primaryAction.text }}
                      <Icon
                        name="mdi:arrow-right"
                        class="ml-2"
                        size="18"
                      />
                    </PrimeButton>
                  </NuxtLink>
                </div>

                <!-- Expandable Details Section -->
                <!-- <div class="mt-auto">
                  <PrimeButton
                    type="button"
                    severity="secondary"
                    size="small"
                    text
                    class="text-primary-400 hover:text-primary-300 w-full"
                    @click="toggleDetails(index)"
                  >
                    <div class="flex items-center justify-center">
                      <span>{{ isExpanded(index) ? 'Hide Details' : 'Show Details' }}</span>
                      <Icon
                        :name="isExpanded(index) ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                        class="ml-1.5"
                        size="16"
                      />
                    </div>
                  </PrimeButton>

                  <div
                    v-if="isExpanded(index)"
                    class="space-y-3 mt-3 pb-2"
                  >
                    <div v-if="step.details.length > 0">
                      <ul class="pl-2 text-primary-200 space-y-2">
                        <li
                          v-for="(detail, detailIndex) in step.details"
                          :key="detailIndex"
                          class="flex items-start text-sm"
                        >
                          <Icon
                            name="mdi:arrow-right"
                            class="text-primary-400 mr-1.5 mt-0.5 flex-shrink-0"
                            size="16"
                          />
                          <span>{{ detail }}</span>
                        </li>
                      </ul>
                    </div>

                    <div v-if="step.resources.length > 0">
                      <h4 class="text-xs font-medium text-primary-300 mb-1.5"
                        >Additional Resources:</h4
                      >
                      <ul class="space-y-1.5">
                        <li
                          v-for="(resource, resourceIndex) in step.resources.slice(0, 3)"
                          :key="resourceIndex"
                          class="text-xs"
                        >
                          <NuxtLink
                            :to="resource.url"
                            target="_blank"
                            class="text-primary-200 hover:text-primary-400 transition-colors duration-200 flex items-center"
                          >
                            <Icon
                              name="mdi:link-variant"
                              class="mr-1 text-primary-500 flex-shrink-0"
                              size="14"
                            />
                            {{ resource.title }}
                          </NuxtLink>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div> -->
              </IBGlass>
            </div>
          </div>
        </div>
      </div>
      <div class="absolute inset-y-0 left-0 right-0 z-10 flex items-center justify-between">
        <button
          class="h-10 w-10 -ml-5 flex items-center justify-center rounded-full bg-primary-900/50 hover:bg-primary-800/70 text-white transition-colors duration-300"
          aria-label="Previous slide"
          @click="scrollPrev"
        >
          <Icon
            name="mdi:chevron-left"
            size="24"
          />
        </button>

        <button
          class="h-10 w-10 -mr-5 flex items-center justify-center rounded-full bg-primary-900/50 hover:bg-primary-800/70 text-white transition-colors duration-300"
          aria-label="Next slide"
          @click="scrollNext"
        >
          <Icon
            name="mdi:chevron-right"
            size="24"
          />
        </button>
      </div>
    </div>
    <DarkskyResources :resources="helpfulResources" />
  </section>
</template>

<style scoped>
/* Embla Carousel styling */
.embla-wrapper .embla {
  --slide-size: 100%;
  --slide-spacing: 1rem;
  position: relative;
}

.embla-wrapper .embla-viewport {
  overflow: hidden;
}

@media (min-width: 640px) {
  .embla-wrapper .embla {
    --slide-size: 50%;
  }
}

@media (min-width: 1024px) {
  .embla-wrapper .embla {
    --slide-size: 33.33%;
  }
}

.embla-wrapper .embla__container {
  display: flex;
  backface-visibility: hidden;
  touch-action: pan-y;
  margin-left: calc(var(--slide-spacing) * -1);
}

.embla-wrapper .embla__slide {
  flex: 0 0 var(--slide-size);
  min-width: 0;
  padding-left: var(--slide-spacing);
}
</style>
