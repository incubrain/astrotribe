<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, onUnmounted } from 'vue'
import { usePersona } from '~/composables/usePersona'
import { useAnimation } from '~/composables/useAnimation'
import { useAnalytics } from '#imports'

const { trackUserEngagement, UserEngagementMetric } = useAnalytics()

// Get persona state from our composable
const { activePersona, personaStyles } = usePersona()

// Dynamic headline based on persona
const currentHeadline = computed(() => {
  // Add optional chaining or default value for safety
  return activePersona.value?.headline || 'Explore the Cosmos'
})

// Track CTA click
const trackCTAClick = (ctaType: string) => {
  trackUserEngagement(UserEngagementMetric.ActionsPerSession, {
    action: 'click_cta',
    cta_type: ctaType,
    persona: activePersona.value?.name || 'unknown',
  })
}

// Particle system for background atmosphere
const stars = ref<
  Array<{
    id: number
    x: number
    y: number
    size: number
    opacity: number
    animationDuration: number
    animationDelay: number
    color: string
  }>
>([])

// Generate stars based on current persona
const generateStars = () => {
  const newStars = []
  const count = 40
  const color = activePersona.value?.color || 'blue'

  for (let i = 0; i < count; i++) {
    newStars.push({
      id: i,
      x: Math.random() * 100, // % position
      y: Math.random() * 100, // % position
      size: 1 + Math.random() * 3,
      opacity: 0.1 + Math.random() * 0.5,
      animationDuration: 3 + Math.random() * 7, // seconds
      animationDelay: Math.random() * 5, // seconds
      color,
    })
  }

  stars.value = newStars
}

// Generate initial stars
onMounted(() => {
  // Generate stars might rely on activePersona, ensure it's safe
  generateStars()

  // Track hero section view safely
  nextTick(() => {
    if (activePersona.value) {
      trackUserEngagement(UserEngagementMetric.PageViews, {
        section: 'hero',
        persona: activePersona.value.name,
      })
    }
  })
})

const isTransitioning = ref(false)
const previousPersona = ref<any>(null)
// Update stars when persona changes
watch(
  () => activePersona.value,
  (newPersona) => {
    if (newPersona) {
      // Regenerate stars with new persona color
      generateStars()

      // If we're transitioning between personas, ensure proper state
      if (previousPersona.value) {
        // Small delay to ensure DOM is updated
        setTimeout(() => {
          isTransitioning.value = true
        }, 50)
      }
    }
  },
)

// Feature animation state for staggered appearance
const areFeatureItemsVisible = ref(false)

onMounted(() => {
  // Trigger features animation after a short delay
  setTimeout(() => {
    areFeatureItemsVisible.value = true
  }, 800)
})
</script>

<template>
  <section class="hero-section relative min-h-[90vh] flex items-center py-16 md:py-24">
    <!-- Background Effects -->

    <!-- Background gradient accents -->
    <div
      class="absolute top-1/4 right-1/4 w-72 h-72 rounded-full blur-3xl transition-colors duration-700"
      :class="`bg-${activePersona.color}-600/10`"
    ></div>
    <div
      class="absolute bottom-1/3 left-1/5 w-72 h-72 rounded-full blur-3xl transition-colors duration-700"
      :class="`bg-${activePersona.color}-600/10`"
    ></div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <!-- Left column: Main content -->
        <div>
          <!-- Headline based on persona -->
          <h1
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :visibleOnce="{
              opacity: 1,
              y: 0,
              transition: { delay: 0.3 },
            }"
            class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 transition-colors duration-500 underline underline-offset-8"
            :class="`text-${activePersona.color}-500 decoration-${activePersona.color}-500`"
          >
            {{ currentHeadline }}
          </h1>

          <!-- Subtitle -->
          <p
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 0.2 } }"
            class="text-xl text-gray-300 mb-8"
          >
            Select your mission and join a community of stargazers, researchers, and space
            enthusiasts.
          </p>

          <!-- CTA buttons -->
          <div
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 0.5 } }"
            class="flex flex-wrap gap-4 mb-12"
          >
            <LoginWrapper>
              <template #default="{ login }">
                <PrimeButton
                  size="large"
                  :class="personaStyles.primaryButton"
                  @click="(trackCTAClick('get_started'), login())"
                >
                  <Icon
                    name="mdi:rocket-launch"
                    class="mr-2"
                    size="20"
                  />
                  Get Started Free
                </PrimeButton>
              </template>
            </LoginWrapper>

            <PrimeButton
              outlined
              size="large"
              class="border-gray-600 text-gray-300 hover:bg-gray-800/30"
              @click="trackCTAClick('learn_more')"
            >
              <Icon
                name="mdi:information-outline"
                class="mr-2"
                size="20"
              />
              Learn More
            </PrimeButton>
          </div>

          <div
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 0.6 } }"
            class="flex flex-wrap justify-start gap-8"
          >
            <div
              v-motion
              :initial="{ opacity: 0, y: 20 }"
              :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 0.6 } }"
              class="flex items-center"
            >
              <div
                class="mr-2 transition-colors duration-500"
                :class="`text-${activePersona.color}-500`"
              >
                <Icon
                  name="mdi:file-document-multiple"
                  size="24"
                />
              </div>
              <div>
                <div class="text-xl font-bold text-white">1M+</div>
                <div class="text-sm text-gray-400">Research Papers</div>
              </div>
            </div>
            <div
              v-motion
              :initial="{ opacity: 0, y: 20 }"
              :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 0.7 } }"
              class="flex items-center"
            >
              <div
                class="mr-2 transition-colors duration-500"
                :class="`text-${activePersona.color}-500`"
              >
                <Icon
                  name="mdi:database"
                  size="24"
                />
              </div>
              <div>
                <div class="text-xl font-bold text-white">150+</div>
                <div class="text-sm text-gray-400">Data Sources</div>
              </div>
            </div>
            <div
              v-motion
              :initial="{ opacity: 0, y: 20 }"
              :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 0.8 } }"
              class="flex items-center"
            >
              <div
                class="mr-2 transition-colors duration-500"
                :class="`text-${activePersona.color}-500`"
              >
                <Icon
                  name="mdi:update"
                  size="24"
                />
              </div>
              <div>
                <div class="text-xl font-bold text-white">24/7</div>
                <div class="text-sm text-gray-400">Updates</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right column: Persona selection -->
        <div
          v-motion
          class="flex flex-col items-center justify-center h-full"
          :initial="{ opacity: 0, scale: 0.9 }"
          :visibleOnce="{ opacity: 1, scale: 1, transition: { delay: 0.4 } }"
        >
          <!-- Enhanced "Select Your Mission" title -->
          <div
            v-motion
            :initial="{ opacity: 0, y: 30, letterSpacing: '0px' }"
            :visibleOnce="{
              opacity: 1,
              y: 0,
              letterSpacing: '1px',
              transition: {
                delay: 0.6,
                duration: 0.8,
                ease: 'easeOut',
              },
            }"
            class="mission-title-container relative mb-6"
          >
            <div
              class="flex items-center justify-center"
              :class="`bg-${activePersona.color}-500/60`"
            >
              <!-- <Icon
                :name="'mdi:compass-outline'"
                size="24"
              /> -->
              <h2
                class="text-2xl md:text-3xl font-semibold text-white tracking-wider relative mission-title z-10 px-2"
              >
                Select Your Mission
              </h2>
            </div>
          </div>

          <!-- Persona orbit visualization -->
          <LundPersonaOrbit />

          <!-- Enhanced Feature List for active persona -->
          <div
            class="w-full space-y-4 transition-all duration-500 backdrop-blur-sm text-white enhanced-feature-container"
          >
            <div
              v-for="(feature, index) in activePersona.features?.slice(0, 4)"
              :key="index"
              class="flex gap-4 py-1.5 feature-item transition-all duration-300 items-center justify-center rounded-lg px-3"
              :class="{ 'feature-visible': areFeatureItemsVisible }"
              :style="`transition-delay: ${200 + index * 100}ms`"
            >
              <span
                class="text-xl underline underline-offset-8 leading-tight text-gray-100 flex justify-center"
                :class="`decoration-${activePersona.color}-500`"
                >{{ feature }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  position: relative;
}

/* Enhanced mission title styling */
.mission-title {
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.mission-title-container {
  position: relative;
}

.mission-title-container::before {
  content: '';
  position: absolute;
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 110%;
  height: 150%;
  background: radial-gradient(
    circle,
    var(--persona-glow-color, rgba(37, 99, 235, 0.2)) 0%,
    transparent 70%
  );
  z-index: 0;
  opacity: 0.6;
}

/* Set persona glow color dynamically with CSS variables */
.mission-title-container:deep(.text-blue-500) ~ .mission-title-container::before {
  --persona-glow-color: rgba(37, 99, 235, 0.3);
}

.mission-title-container:deep(.text-red-500) ~ .mission-title-container::before {
  --persona-glow-color: rgba(220, 38, 38, 0.3);
}

.mission-title-container:deep(.text-amber-500) ~ .mission-title-container::before {
  --persona-glow-color: rgba(245, 158, 11, 0.3);
}

/* Enhanced feature container */
.enhanced-feature-container {
  max-width: 450px;
  margin: 0 auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

/* Feature item animations */
.feature-item {
  opacity: 0;
  transform: translateY(10px);
}

.feature-item.feature-visible {
  opacity: 1;
  transform: translateY(0);
}

.feature-icon-container {
  box-shadow: 0 0 10px var(--persona-icon-glow, rgba(37, 99, 235, 0.4));
}

/* Pulse animation for stars */
@keyframes pulse {
  0% {
    opacity: 0.2;
    transform: scale(0.8);
  }
  100% {
    opacity: 0.8;
    transform: scale(1.2);
  }
}

/* Prevent Safari transition on page load */
.disable-transitions * {
  transition: none !important;
}

/* Smooth transitions for persona changes */
.persona-transition-enter-active,
.persona-transition-leave-active {
  transition: all 0.7s ease;
}

.persona-transition-enter-from,
.persona-transition-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
