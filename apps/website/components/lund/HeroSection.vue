<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
// Remove storeToRefs if it's no longer needed for other stores here
// import { storeToRefs } from 'pinia'
import { usePersona } from '~/composables/usePersona'
import { useAnimation } from '~/composables/useAnimation'
import { useAnalytics } from '#imports'

const { conf: motionConstants } = useAnimation()
const { trackUserEngagement, UserEngagementMetric } = useAnalytics()

// Get persona state from our composable
const {
  activePersona,
  personas,
  personaStyles,
  setActivePersona,
  isResearcher,
  isCommunicator,
  isEnthusiast,
} = usePersona()

// --- Remove these unused refs ---
// const orbitingPersonas = ref([...personas.value]) // REMOVE
// const orbitCenterX = ref(0) // REMOVE
// const orbitCenterY = ref(0) // REMOVE
// ---

// Orbital animation state
const orbitRadius = ref(140)
const orbitProgress = ref(0)
const isOrbiting = ref(false)

// Calculate orbit positions for personas
const getOrbitPositions = computed(() => {
  // Add a guard clause for safety during initialization/SSR
  if (!activePersona.value || !personas.value) {
    console.warn('getOrbitPositions: activePersona or personas not ready yet.')
    return {} // Return empty object if state isn't ready
  }

  // Console log can stay for debugging if needed
  // console.log('getOrbitPositions recalculating for active:', activePersona.value.name)

  const positions = {}
  let index = 0

  // Use .value because personas is a ComputedRef
  personas.value.forEach((persona) => {
    // Use .value because activePersona is a ComputedRef
    if (persona.name === activePersona.value.name) {
      // Active persona is in the center
      positions[persona.name] = {
        x: 0,
        y: 0,
        scale: 1.3, // Increased scale for better visibility
        opacity: 1,
        active: true,
      }
    } else {
      // Position others in orbit
      const angle = (orbitProgress.value + index * 180) % 360
      const radian = angle * (Math.PI / 180)
      const x = Math.cos(radian) * orbitRadius.value
      const y = Math.sin(radian) * (orbitRadius.value * 0.4) // Flatter elliptical orbit

      positions[persona.name] = {
        x,
        y,
        scale: 0.8,
        opacity: 0.7,
        rotation: angle - 90, // Angle persona icon toward center
        active: false,
      }
      index++
    }
  })

  return positions
})

// Animation for orbit effect
const startOrbiting = () => {
  // ... (rest of startOrbiting function is likely fine) ...
  if (isOrbiting.value) return
  isOrbiting.value = true

  // Continuously update orbit positions
  const animateOrbit = () => {
    if (!isOrbiting.value) return

    orbitProgress.value += 0.5
    if (orbitProgress.value >= 360) {
      orbitProgress.value = 0
    }

    requestAnimationFrame(animateOrbit)
  }

  animateOrbit()
}

// Handle persona selection
const selectPersona = (persona: Persona) => {
  // Add type hint if Persona interface is available
  // setActivePersona is now directly available from usePersona()
  setActivePersona(persona)

  // Tracking should still work if activePersona updates correctly
  trackUserEngagement(UserEngagementMetric.ActionsPerSession, {
    action: 'persona_selection',
    // Use persona.name directly from the argument for immediate tracking
    persona: persona.name,
  })
}

// Dynamic headline based on persona
const currentHeadline = computed(() => {
  // Add optional chaining or default value for safety
  return activePersona.value?.headline || 'Explore the Cosmos'
})

// Track CTA click
const trackCTAClick = (ctaType: string) => {
  // Add type hint
  // Check if activePersona exists before accessing name
  if (!activePersona.value) return

  trackUserEngagement(UserEngagementMetric.ActionsPerSession, {
    action: 'cta_click',
    cta_type: ctaType,
    persona: activePersona.value.name,
  })
}

// Particle system for background atmosphere
const stars = ref([])
const generateStars = () => {
  // Add guard clause for safety
  if (!activePersona.value) return

  const starCount = 150
  const newStars = []

  for (let i = 0; i < starCount; i++) {
    newStars.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5,
      opacity: Math.random() * 0.8 + 0.2,
      pulse: Math.random() * 3 + 1,
      // Use optional chaining for color access
      color: Math.random() > 0.8 ? activePersona.value?.color : 'white',
    })
  }

  stars.value = newStars
}

// Generate initial stars
onMounted(() => {
  // Generate stars might rely on activePersona, ensure it's safe
  generateStars() // Consider calling this within the watch below initially if needed
  startOrbiting()

  // Track hero section view safely
  if (activePersona.value) {
    trackUserEngagement(UserEngagementMetric.FeatureAdoption, {
      feature: 'hero_section_view',
      persona: activePersona.value.name,
    })
  }
})

// Regenerate stars when persona changes
// Use .value when accessing activePersona inside the watch source function
watch(
  () => activePersona.value,
  (newPersona) => {
    if (newPersona) {
      generateStars()
    }
  },
  { deep: true },
) // deep: true might be needed if generateStars depends on nested properties

// Keep the debugging watch if needed, but ensure it accesses .value
watch(
  () => activePersona.value, // Watch the value of the computed ref
  (newVal, oldVal) => {
    console.log('[HeroSection Watch] Active persona changed:', oldVal?.name, '->', newVal?.name)
    // Access .value for computed properties here too
    if (newVal) {
      // Ensure newVal exists before calculating positions
      const positions = getOrbitPositions.value
      console.log('[HeroSection Watch] Recalculated positions:', JSON.stringify(positions, null, 2))
    }
  },
  // No deep: true needed if just watching the ref itself change
)
</script>

<template>
  <section
    class="hero-section relative overflow-hidden min-h-[90vh] flex items-center py-16 md:py-24"
  >
    <!-- Background Effects -->
    <div class="absolute inset-0 bg-slate-950 z-0"></div>
    <div class="absolute inset-0 bg-[url('/patterns/stars-pattern.svg')] opacity-30 z-0"></div>

    <!-- Dynamic star field -->
    <div class="absolute inset-0 z-0">
      <div
        v-for="star in stars"
        :key="star.id"
        class="absolute rounded-full transition-colors duration-1000"
        :style="{
          left: `${star.x}%`,
          top: `${star.y}%`,
          width: `${star.size}px`,
          height: `${star.size}px`,
          opacity: star.opacity,
          backgroundColor:
            star.color === 'white' ? 'white' : `var(--color-${activePersona.color}-400)`,
          animation: `pulse ${star.pulse}s infinite alternate`,
        }"
      ></div>
    </div>

    <!-- Main floating orbs -->
    <div
      class="absolute top-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl transition-colors duration-700"
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
              transition: { type: 'spring', stiffness: 200, damping: 20 },
            }"
            class="text-4xl md:text-7xl font-bold mb-8 text-white leading-tight"
          >
            <span
              class="block transition-colors duration-500"
              :class="personaStyles.sectionHeading"
            >
              {{ currentHeadline }}
            </span>
          </h1>

          <p
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 0.2 } }"
            class="text-xl text-gray-300 mb-10 max-w-2xl"
          >
            Connect with astronomy data, analyze research, and discover cosmic insights with our
            AI-powered platform.
          </p>

          <!-- CTA buttons -->
          <div
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 0.5 } }"
            class="flex flex-wrap gap-4 mb-12"
          >
            <PrimeButton
              size="large"
              class="bg-gradient-to-r transition-all duration-500 text-lg px-8 shadow-lg shadow-primary-900/30"
              :class="personaStyles.primaryButton"
              @click="trackCTAClick('begin_journey')"
            >
              {{ activePersona.ctaText || 'Begin Cosmic Journey' }}
              <Icon
                name="mdi:rocket-launch"
                class="ml-2"
                size="20"
              />
            </PrimeButton>
          </div>

          <!-- Stats bar -->
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
                <div class="text-xl font-bold text-white">50+</div>
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

        <!-- Right column: Persona Selector -->
        <div
          v-motion
          :initial="{ opacity: 0, x: 50 }"
          :visibleOnce="{
            opacity: 1,
            x: 0,
            transition: { type: 'spring', stiffness: 150, damping: 20, delay: 0.4 },
          }"
          class="flex flex-col items-center"
        >
          <!-- "Select Your Mission" title -->
          <h3
            class="text-2xl font-bold text-center mb-10 transition-colors duration-500 px-4 py-2 rounded bg-slate-900/30 backdrop-blur-sm"
            :class="`text-${activePersona.color}-500`"
          >
            Select Your Mission
          </h3>

          <!-- Interactive Persona Orbit Selector -->
          <div class="relative h-[260px] w-[260px] mx-auto mb-10">
            <!-- Center point reference for orbit -->
            <div
              ref="orbitCenter"
              class="absolute left-1/2 top-1/2 h-0 w-0"
            ></div>

            <!-- Orbiting personas -->
            <div class="relative w-full h-full">
              <div
                v-for="persona in personas"
                :key="persona.name"
                class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 cursor-pointer"
                :style="{
                  transform: `translate(${getOrbitPositions[persona.name].x}px, ${getOrbitPositions[persona.name].y}px) scale(${getOrbitPositions[persona.name].scale})`,
                  opacity: getOrbitPositions[persona.name].opacity,
                  zIndex: persona.name === activePersona.name ? 10 : 1,
                }"
                @click="selectPersona(persona)"
              >
                <!-- Persona Icon Circle -->
                <div
                  class="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500"
                  :class="`${persona.name === activePersona.name ? `bg-${persona.color}-800 border-2 border-${persona.color}-500/70` : `bg-${persona.color}-900/50`}`"
                >
                  <Icon
                    :name="persona.iconName"
                    class="transition-colors duration-500"
                    :class="`text-${persona.color}-500`"
                    size="30"
                  />
                </div>

                <!-- Persona Name -->
                <div
                  class="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-base font-medium transition-colors duration-500"
                  :class="
                    persona.name === activePersona.name
                      ? `text-${persona.color}-500`
                      : 'text-gray-500'
                  "
                >
                  {{ persona.name }}
                </div>
              </div>
            </div>
          </div>

          <!-- Feature List for active persona -->
          <div class="w-full space-y-3">
            <div
              v-for="(feature, index) in activePersona.features?.slice(0, 4)"
              :key="index"
              class="flex items-center gap-3 bg-slate-900/80 backdrop-blur-sm rounded-lg px-4 py-3 border transition-colors duration-500"
              :class="`border-${activePersona.color}-800/30`"
            >
              <div
                class="w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center transition-colors duration-500"
                :class="`bg-${activePersona.color}-900/50 text-${activePersona.color}-500`"
              >
                <Icon
                  name="mdi:check"
                  size="16"
                />
              </div>
              <span class="text-lg text-gray-300">{{ feature }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Subtle "scroll down" indicator -->
      <div
        class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce opacity-70"
      >
        <span class="text-sm text-gray-400 mb-2">Scroll to Explore</span>
        <Icon
          name="mdi:chevron-down"
          :class="`text-${activePersona.color}-500 transition-colors duration-500`"
          size="24"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  position: relative;
  overflow: hidden;
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
</style>
