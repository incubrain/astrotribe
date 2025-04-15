<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const { conf: motionConstants } = useAnimation()
const { trackUserEngagement } = useAnalytics()

// Define props
const props = defineProps({
  activePersona: {
    type: String,
    default: 'all',
  },
})

// Define feature data with persona relevance
const features = ref([
  {
    id: 1,
    title: 'AstroQuery AI',
    description:
      'Ask complex astronomy questions and get accurate, research-backed answers instantly.',
    icon: 'mdi:brain',
    color: 'from-blue-600 to-primary-600',
    highlight: 'Instant answers',
    capabilities: [
      'Natural language processing for astronomy terminology',
      'Real-time access to latest research findings',
      'Citation tracking and source verification',
    ],
    personas: ['researchers', 'communicators', 'enthusiasts'],
  },
  {
    id: 2,
    title: 'Knowledge Clusters',
    description:
      'Organize your research, compare ideas, and discover similar work from the astronomy community.',
    icon: 'mdi:graph',
    color: 'from-indigo-600 to-blue-500',
    highlight: 'Research organization',
    capabilities: [
      'Visual mapping of related research topics',
      'Automatic categorization of papers and data',
      'Collaborative sharing with research teams',
    ],
    personas: ['researchers', 'communicators'],
  },
  {
    id: 3,
    title: 'Research Context',
    description:
      'Add papers and datasets to your queries for highly specific answers based on your own research.',
    icon: 'mdi:book-open-page-variant',
    color: 'from-primary-600 to-cyan-600',
    highlight: 'Custom context',
    capabilities: [
      'Upload and analyze your own datasets',
      'Get personalized insights from your research',
      'Create custom knowledge bases for your projects',
    ],
    personas: ['researchers'],
  },
  {
    id: 4,
    title: 'Idea Novelty Analysis',
    description:
      'Automatically evaluate your research ideas against existing literature to identify unique opportunities.',
    icon: 'mdi:lightbulb',
    color: 'from-violet-600 to-purple-600',
    highlight: 'Innovation insights',
    capabilities: [
      'Gap analysis in current research landscape',
      'Trend identification in astronomy publications',
      'Opportunity scoring for research proposals',
    ],
    personas: ['researchers'],
  },
  {
    id: 5,
    title: 'AstroFact of the Day',
    description:
      'Daily astronomy facts with share options and streak tracking to keep you engaged.',
    icon: 'mdi:star',
    color: 'from-amber-600 to-orange-600',
    highlight: 'Daily learning',
    capabilities: [
      'Engaging space facts with visual elements',
      'Share to social media with one click',
      'Build streaks to track your astronomy journey',
    ],
    personas: ['enthusiasts', 'communicators'],
  },
  {
    id: 6,
    title: 'Press Kit Generator',
    description:
      'Auto-generate press kits from astronomy papers and discoveries for easy media distribution.',
    icon: 'mdi:newspaper',
    color: 'from-green-600 to-emerald-600',
    highlight: 'Media ready',
    capabilities: [
      'Create media-friendly summaries from technical papers',
      'Generate quotes and key talking points',
      'Export in multiple formats including PDF and HTML',
    ],
    personas: ['communicators'],
  },
])

// Selected feature
const selectedFeature = ref(features.value[0])

// Filter features by persona
const filteredFeatures = computed(() => {
  if (props.activePersona === 'all') {
    return features.value
  }
  return features.value.filter((feature) => feature.personas.includes(props.activePersona))
})

// Ensure a selected feature is valid for the current persona
watch(
  () => props.activePersona,
  () => {
    // If current selection isn't in the filtered list, select the first available feature
    if (!filteredFeatures.value.find((f) => f.id === selectedFeature.value.id)) {
      selectedFeature.value = filteredFeatures.value[0]
    }
  },
)

// Function to track feature selection
const trackFeatureInterest = (featureId) => {
  const feature = features.value.find((f) => f.id === featureId)
  if (feature) {
    selectedFeature.value = feature

    // Track the selection
    trackUserEngagement(UserEngagementMetric.FeatureAdoption, {
      feature: 'feature_selection',
      feature_id: featureId,
      feature_name: feature.title,
      persona: props.activePersona,
    })
  }
}

// Track feature button action
const trackFeatureAction = (featureId) => {
  trackUserEngagement(UserEngagementMetric.FeatureAdoption, {
    feature: 'feature_cta_click',
    feature_id: featureId,
    persona: props.activePersona,
  })
}

// Track view all features button
const trackViewAllFeatures = () => {
  trackUserEngagement(UserEngagementMetric.FeatureAdoption, {
    feature: 'view_all_features',
    persona: props.activePersona,
  })
}
</script>

<template>
  <section
    id="features"
    class="features-section py-16 relative overflow-hidden"
  >
    <!-- Background with subtle dark gradient -->
    <div class="absolute inset-0 bg-slate-950 z-0"></div>

    <!-- Subtle patterns and grid overlay for tech feel -->
    <div class="absolute inset-0 bg-[url('/patterns/grid-pattern.svg')] opacity-7 z-0"></div>

    <!-- Glowing orbs -->
    <div class="absolute -right-20 top-40 w-72 h-72 bg-blue-600/5 rounded-full blur-3xl"></div>
    <div class="absolute -left-40 bottom-20 w-80 h-80 bg-primary-600/5 rounded-full blur-3xl"></div>

    <div class="wrapper relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visibleOnce="{
          opacity: 1,
          y: 0,
          transition: {
            type: 'spring',
            stiffness: 250,
            damping: 20,
          },
        }"
        class="text-center max-w-xl mx-auto mb-12"
      >
        <div class="flex items-center justify-center gap-2 mb-3">
          <span class="text-primary-600 uppercase text-sm font-medium tracking-wider"
            >AI-POWERED</span
          >
        </div>
        <h2 class="text-3xl md:text-5xl font-bold mb-4 text-white leading-tight">
          <span class="inline-block">Explore</span>
          <span
            class="bg-gradient-to-r from-blue-500 to-primary-600 bg-clip-text text-transparent inline-block"
          >
            The Universe
          </span>
        </h2>
        <p class="text-xl text-gray-300"
          >Advanced tools helping researchers discover insights faster than ever before</p
        >
      </div>

      <!-- Persona filter tabs -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 0.2 } }"
        class="mb-10 flex flex-wrap justify-center gap-3"
      >
        <button
          class="px-4 py-2 rounded-full text-sm transition-all duration-300"
          :class="
            props.activePersona === 'all'
              ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/30'
              : 'bg-slate-800/70 text-gray-300 hover:bg-slate-700/70'
          "
        >
          All Features
        </button>

        <button
          v-for="persona in ['researchers', 'communicators', 'enthusiasts']"
          :key="persona"
          class="px-4 py-2 rounded-full text-sm transition-all duration-300 flex items-center gap-2"
          :class="
            props.activePersona === persona
              ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/30'
              : 'bg-slate-800/70 text-gray-300 hover:bg-slate-700/70'
          "
        >
          <Icon
            :name="
              persona === 'researchers'
                ? 'mdi:microscope'
                : persona === 'communicators'
                  ? 'mdi:broadcast'
                  : 'mdi:star'
            "
            size="16"
          />
          <span>{{ persona.charAt(0).toUpperCase() + persona.slice(1) }}</span>
        </button>
      </div>

      <!-- Feature Showcase Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div
          v-for="(feature, index) in filteredFeatures"
          :key="feature.id"
          v-motion
          :initial="{ opacity: 0, y: 30, scale: 0.95 }"
          :visibleOnce="{
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
              type: 'spring',
              stiffness: 150,
              damping: 20,
              delay: 0.1 + index * 0.05,
            },
          }"
          class="relative group cursor-pointer"
          @click="trackFeatureInterest(feature.id)"
        >
          <!-- Feature Card -->
          <div
            class="h-full bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-800/50 p-6 overflow-hidden hover:border-primary-800/30 hover:shadow-lg hover:shadow-primary-900/10 transition-all duration-300 transform hover:-translate-y-1"
            :class="selectedFeature.id === feature.id ? 'border-2 border-primary-600/50' : ''"
          >
            <!-- Subtle gradient background based on feature -->
            <div
              class="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-xl"
              :class="`bg-gradient-to-br ${feature.color}`"
            ></div>

            <!-- Feature header -->
            <div class="flex items-center gap-3 mb-4 relative z-10">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br shadow-lg shadow-primary-900/10"
                :class="feature.color"
              >
                <Icon
                  :name="feature.icon"
                  class="text-white"
                  size="18"
                />
              </div>

              <div class="flex-1">
                <h3 class="text-lg font-bold text-white">{{ feature.title }}</h3>
                <span
                  class="text-xs px-2 py-0.5 rounded-full inline-flex items-center"
                  :class="`bg-${feature.color.split(' ')[0].split('-')[0]}-900/30 text-${feature.color.split(' ')[0].split('-')[0]}-400 border border-${feature.color.split(' ')[0].split('-')[0]}-800/30`"
                >
                  {{ feature.highlight }}
                </span>
              </div>
            </div>

            <!-- Feature description -->
            <p class="text-gray-400 text-sm mb-4 relative z-10">{{ feature.description }}</p>

            <!-- Feature capabilities -->
            <div class="mb-4 relative z-10">
              <ul class="space-y-2">
                <li
                  v-for="(capability, idx) in feature.capabilities.slice(0, 2)"
                  :key="idx"
                  class="flex items-start gap-2 text-sm"
                >
                  <Icon
                    name="mdi:check-circle"
                    class="flex-shrink-0 mt-0.5"
                    :class="`text-${feature.color.split(' ')[0].split('-')[0]}-500`"
                    size="16"
                  />
                  <span class="text-gray-300">{{ capability }}</span>
                </li>
              </ul>
            </div>

            <!-- Try Feature Button -->
            <div class="relative z-10">
              <button
                class="text-sm font-medium flex items-center gap-1.5 transition-colors duration-200 mt-auto"
                :class="`text-${feature.color.split(' ')[0].split('-')[0]}-500 hover:text-${feature.color.split(' ')[0].split('-')[0]}-400`"
                @click.stop="trackFeatureAction(feature.id)"
              >
                <span>Try this feature</span>
                <Icon
                  name="mdi:arrow-right"
                  size="16"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="text-center">
        <PrimeButton
          outlined
          class="border-primary-600 text-primary-500 hover:bg-primary-900/30 transition-all duration-300"
          @click="trackViewAllFeatures"
        >
          Explore All Features
          <Icon
            name="mdi:chevron-right"
            class="ml-2"
            size="18"
          />
        </PrimeButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.features-section {
  position: relative;
  overflow: hidden;
}

/* Subtle animation for the selected feature */
@keyframes pulse-border {
  0%,
  100% {
    border-color: rgba(79, 70, 229, 0.5);
  }
  50% {
    border-color: rgba(99, 102, 241, 0.8);
  }
}

.border-primary-600\/50 {
  animation: pulse-border 2s ease-in-out infinite;
}
</style>
