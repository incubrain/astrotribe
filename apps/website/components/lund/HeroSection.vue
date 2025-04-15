<script setup lang="ts">
import { computed } from 'vue'

const { conf: motionConstants } = useAnimation()
const { trackUserEngagement } = useAnalytics()

// Define props
const props = defineProps({
  activePersona: {
    type: String,
    default: 'researchers',
  },
})

// Define emits
const emit = defineEmits(['setPersona'])

// Persona-specific headlines
const personaHeadlines = {
  researchers: 'Accelerate Research Discovery',
  communicators: 'Enhance Science Communication',
  enthusiasts: 'Connect with the Cosmos',
}

// Persona descriptions for the right panel
const personaContent = {
  researchers: {
    title: 'For Researchers',
    features: [
      'Access 1M+ research papers in seconds',
      'Identify emerging research trends',
      'Find collaboration opportunities',
      'Discover research gaps automatically',
    ],
    cta: 'Boost Research Efficiency',
    color: 'blue',
    stats: [
      { icon: 'mdi:book-open-page-variant', count: '1M+', label: 'Research Papers' },
      { icon: 'mdi:source-repository', count: '50+', label: 'Data Sources' },
      { icon: 'mdi:update', count: '24/7', label: 'Updates' },
    ],
  },
  communicators: {
    title: 'For Science Communicators',
    features: [
      'Translate complex concepts for any audience',
      'Generate verified science content',
      'Create engaging visualizations',
      'Track trending space topics',
    ],
    cta: 'Enhance Your Content',
    color: 'emerald',
    stats: [
      { icon: 'mdi:source-repository', count: '50+', label: 'Content Sources' },
      { icon: 'mdi:chart-line', count: '10K+', label: 'Space Topics' },
      { icon: 'mdi:image-multiple', count: '5K+', label: 'Visualizations' },
    ],
  },
  enthusiasts: {
    title: 'For Space Enthusiasts',
    features: [
      'Learn astronomy at your pace',
      'Track space missions and events',
      'Join a community of stargazers',
      'Access expert explanations',
    ],
    cta: 'Explore the Universe',
    color: 'amber',
    stats: [
      { icon: 'mdi:rocket-launch', count: '200+', label: 'Space Missions' },
      { icon: 'mdi:calendar-star', count: '500+', label: 'Astronomy Events' },
      { icon: 'mdi:account-group', count: '100K+', label: 'Community Members' },
    ],
  },
}

// Active persona content
const activeContent = computed(() => {
  return personaContent[props.activePersona]
})

// Current headline based on persona
const currentHeadline = computed(() => {
  return personaHeadlines[props.activePersona]
})

// Function to switch personas
const switchPersona = (persona) => {
  emit('setPersona', persona)
}

// Search query state
const searchQuery = ref('')

// Handle search
const handleSearch = () => {
  if (!searchQuery.value) return

  trackUserEngagement(UserEngagementMetric.ActionsPerSession, {
    action: 'search',
    query: searchQuery.value,
  })
}

// Track CTA clicks
const trackCTAClick = (ctaType) => {
  trackUserEngagement(UserEngagementMetric.ActionsPerSession, {
    action: 'cta_click',
    cta_type: ctaType,
    persona: props.activePersona,
  })
}
</script>

<template>
  <section
    class="hero-section relative overflow-hidden min-h-[90vh] flex items-center py-16 md:pt-24"
  >
    <!-- Background Effects -->
    <div class="absolute inset-0 bg-slate-950 z-0"></div>
    <div class="absolute inset-0 bg-[url('/patterns/stars-pattern.svg')] opacity-30 z-0"></div>

    <!-- Main floating orbs -->
    <div class="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
    <div
      class="absolute bottom-1/3 left-1/5 w-72 h-72 bg-primary-600/10 rounded-full blur-3xl"
    ></div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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
            class="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight"
          >
            <span
              class="block bg-gradient-to-r from-primary-600 to-blue-500 bg-clip-text text-transparent"
            >
              {{ currentHeadline }}
            </span>
          </h1>

          <p
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 0.2 } }"
            class="text-xl text-gray-300 mb-8 max-w-2xl"
          >
            Connect with astronomy data, analyze research, and discover cosmic insights with our
            AI-powered platform.
          </p>

          <!-- Persona Selection -->
          <div
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 0.3 } }"
            class="mb-8 flex items-center gap-4"
          >
            <h4 class="font-semibold text-amber-400 text-nowrap">Are you a</h4>
            <div class="flex flex-wrap gap-3">
              <button
                v-for="persona in ['researcher', 'communicator', 'space nerd']"
                :key="persona"
                :class="[
                  'px-5 py-3 rounded-full text-sm transition-all duration-300 flex items-center gap-2',
                  props.activePersona === persona
                    ? `bg-${personaContent[persona].color}-600 text-white shadow-lg shadow-${personaContent[persona].color}-900/30`
                    : 'bg-slate-800/70 text-gray-300 hover:bg-slate-700/70 border border-slate-700/50',
                ]"
                @click="switchPersona(persona)"
              >
                <Icon
                  :name="
                    persona === 'researchers'
                      ? 'mdi:microscope'
                      : persona === 'communicators'
                        ? 'mdi:broadcast'
                        : 'mdi:star'
                  "
                  size="20"
                />
                <span>{{ persona.charAt(0).toUpperCase() + persona.slice(1) }}</span>
              </button>
            </div>
          </div>

          <!-- Search bar -->
          <div
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 0.4 } }"
            class="relative max-w-2xl mb-8"
          >
            <form
              class="flex items-center"
              @submit.prevent="handleSearch"
            >
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Ask about astronomy or search space research..."
                class="w-full px-5 py-4 rounded-l-lg bg-slate-800/80 border border-primary-600/30 text-white placeholder-gray-400 focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
              />
              <button
                type="submit"
                class="px-6 py-4 rounded-r-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors duration-300 flex items-center"
              >
                <Icon
                  name="mdi:magnify"
                  class="mr-2"
                  size="20"
                />
                <span>Search</span>
              </button>
            </form>
          </div>

          <!-- CTA buttons -->
          <div
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 0.5 } }"
            class="flex flex-wrap gap-4 mb-8"
          >
            <PrimeButton
              size="large"
              class="bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-500 hover:to-blue-500 transition-all duration-300 text-lg px-8 shadow-lg shadow-primary-900/30"
              @click="trackCTAClick('free_trial')"
            >
              Start Free Trial
              <Icon
                name="mdi:rocket-launch"
                class="ml-2"
                size="20"
              />
            </PrimeButton>
            <PrimeButton
              size="large"
              outlined
              class="border-white text-white hover:bg-white/10 transition-all duration-300 text-lg px-8"
              @click="trackCTAClick('watch_demo')"
            >
              Watch Demo
              <Icon
                name="mdi:play-circle"
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
            class="flex flex-wrap justify-start gap-x-8 gap-y-4"
          >
            <div
              v-for="(stat, index) in activeContent.stats"
              :key="index"
              v-motion
              :initial="{ opacity: 0, y: 20 }"
              :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 0.7 + index * 0.1 } }"
              class="flex items-center"
            >
              <div
                class="mr-2"
                :class="`text-${activeContent.color}-500`"
              >
                <Icon
                  :name="stat.icon"
                  size="24"
                />
              </div>
              <div>
                <div class="text-xl font-bold text-white">
                  {{ stat.count }}
                </div>
                <div class="text-sm text-gray-400">{{ stat.label }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right side: Persona-specific highlights -->
        <div
          v-motion
          :initial="{ opacity: 0, x: 50 }"
          :visibleOnce="{
            opacity: 1,
            x: 0,
            transition: { type: 'spring', stiffness: 150, damping: 20, delay: 0.5 },
          }"
        >
          <div
            class="relative bg-slate-900/80 backdrop-blur-md border border-slate-800/50 rounded-lg shadow-xl overflow-hidden transform transition-all duration-500 hover:-translate-y-2"
            :class="`shadow-${activeContent.color}-900/10 hover:border-${activeContent.color}-800/30 hover:shadow-${activeContent.color}-900/20`"
          >
            <!-- Glowing accent in the top corner -->
            <div
              class="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-30"
              :class="`bg-${activeContent.color}-600/30 blur-3xl`"
            ></div>

            <div class="p-7 relative z-10">
              <div class="flex items-center gap-3 mb-3">
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center"
                  :class="`bg-${activeContent.color}-900/50 text-${activeContent.color}-500`"
                >
                  <Icon
                    :name="
                      props.activePersona === 'researchers'
                        ? 'mdi:microscope'
                        : props.activePersona === 'communicators'
                          ? 'mdi:broadcast'
                          : 'mdi:star'
                    "
                    size="24"
                  />
                </div>
                <h2 class="text-2xl font-bold text-white">{{ activeContent.title }}</h2>
              </div>

              <!-- Feature List -->
              <div class="space-y-4 mb-7">
                <div
                  v-for="(feature, index) in activeContent.features"
                  :key="index"
                  v-motion
                  :initial="{ opacity: 0, x: 20 }"
                  :visibleOnce="{ opacity: 1, x: 0, transition: { delay: 0.6 + index * 0.1 } }"
                  class="flex items-start gap-3"
                >
                  <div
                    class="mt-1 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                    :class="`bg-${activeContent.color}-900/50`"
                  >
                    <Icon
                      name="mdi:check"
                      :class="`text-${activeContent.color}-500`"
                      size="14"
                    />
                  </div>
                  <span class="text-gray-300">{{ feature }}</span>
                </div>
              </div>

              <!-- Interactive Features Showcase -->
              <div
                class="mb-7 relative rounded-lg overflow-hidden shadow-lg"
                :class="`shadow-${activeContent.color}-900/20`"
              >
                <img
                  src="/images/hero-image.jpg"
                  alt="Platform preview"
                  class="w-full h-52 object-cover rounded-lg transition-transform duration-700 hover:scale-105"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"
                ></div>
                <div class="absolute bottom-0 left-0 right-0 p-4">
                  <h3 class="text-white font-medium text-lg">Tailored for your needs</h3>
                  <p class="text-gray-300">Personalized experience for {{ props.activePersona }}</p>
                </div>
              </div>

              <!-- CTA button with glow effect -->
              <div
                :class="`p-px rounded-lg bg-gradient-to-r from-${activeContent.color}-700 to-${activeContent.color}-500`"
              >
                <PrimeButton
                  class="w-full text-center py-3 text-base"
                  :class="`bg-slate-900 hover:bg-slate-800 text-${activeContent.color}-400 hover:text-${activeContent.color}-300 border-none`"
                  @click="trackCTAClick('persona_specific')"
                >
                  {{ activeContent.cta }}
                  <Icon
                    name="mdi:arrow-right"
                    class="ml-2"
                    size="18"
                  />
                </PrimeButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
