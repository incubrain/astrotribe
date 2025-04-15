<script setup lang="ts">
import { ref, computed } from 'vue'

const { conf: motionConstants } = useAnimation()
const { trackUserEngagement } = useAnalytics()

// Define props to receive selected persona
const props = defineProps({
  activePersona: {
    type: String,
    default: 'researchers',
  },
})

// Sample comparison data
const comparisons = [
  {
    id: 'research',
    title: 'Astronomy Research Process',
    oldWay: {
      title: 'Traditional Research Process',
      description:
        'Researchers typically spend weeks manually searching through databases, cross-referencing papers, and trying to identify relevant connections.',
      steps: [
        'Search through multiple academic databases individually',
        'Manually download and organize hundreds of papers',
        'Read through each paper to find relevant information',
        'Create spreadsheets to track findings and connections',
        'Manually identify research gaps through extensive cross-referencing',
      ],
      timeframe: '2-3 weeks',
      color: 'red',
    },
    newWay: {
      title: 'AstronEra Research Process',
      description:
        'Our AI-powered platform automates the research process, finding connections and insights in minutes instead of weeks.',
      steps: [
        'Enter your research query in natural language',
        'Review AI-curated papers and their key findings',
        'Explore automatically generated connection maps',
        'Identify research gaps highlighted by our analysis',
        'Export structured findings ready for your paper',
      ],
      timeframe: 'Minutes to hours',
      color: 'blue',
    },
    bestFor: 'researchers',
  },
  {
    id: 'education',
    title: 'Creating Educational Content',
    oldWay: {
      title: 'Traditional Educational Process',
      description:
        'Educators spend hours jumping between simplified concepts and academic papers to create accurate but accessible teaching materials.',
      steps: [
        'Search for basic concept explanations online',
        'Find and verify scientific accuracy from research papers',
        'Create visualizations manually or outsource them',
        'Simplify complex terminology for different levels',
        'Update materials as new discoveries emerge',
      ],
      timeframe: 'Several days',
      color: 'amber',
    },
    newWay: {
      title: 'AstronEra Educational Process',
      description:
        'Generate accurate, multi-level explanations and visualizations instantly with verified scientific backing.',
      steps: [
        'Enter the astronomy concept you want to teach',
        'Select the education level (from K-12 to university)',
        'Get instant explanations with verified research citations',
        'Access ready-to-use visualizations and interactive materials',
        'One-click updates when new research emerges',
      ],
      timeframe: 'Under 1 hour',
      color: 'green',
    },
    bestFor: 'communicators',
  },
  {
    id: 'discovery',
    title: 'Space Discovery Exploration',
    oldWay: {
      title: 'Traditional Discovery Process',
      description:
        'Space enthusiasts struggle to keep up with discoveries and understand their significance across fragmented sources.',
      steps: [
        'Follow multiple news sources and social media accounts',
        'Piece together information from different outlets',
        'Struggle to distinguish credible from unreliable sources',
        'Search for additional context to understand discoveries',
        'Miss important updates due to information overload',
      ],
      timeframe: 'Constant effort',
      color: 'indigo',
    },
    newWay: {
      title: 'AstronEra Discovery Process',
      description:
        'Access curated space discoveries with context, visualizations, and expert explanations in one unified platform.',
      steps: [
        'Receive personalized alerts on discoveries you care about',
        'Get contextual explanations calibrated to your knowledge level',
        'Explore interactive visualizations of new discoveries',
        'Connect discoveries to related missions and research',
        'Join discussions with other enthusiasts and experts',
      ],
      timeframe: 'Minutes per day',
      color: 'primary',
    },
    bestFor: 'enthusiasts',
  },
]

// Find the preferred comparison for the current persona
const getPreferredComparison = () => {
  const preferred = comparisons.find((c) => c.bestFor === props.activePersona)
  return preferred ? preferred.id : 'research'
}

// Active comparison
const activeComparisonId = ref(getPreferredComparison())

// Update preferred comparison when persona changes
watch(
  () => props.activePersona,
  () => {
    activeComparisonId.value = getPreferredComparison()
  },
)

// Get the active comparison data
const activeComparison = computed(() => {
  return comparisons.find((c) => c.id === activeComparisonId.value) || comparisons[0]
})

// Track which comparison the user is viewing
const trackComparisonEngagement = (comparisonId) => {
  activeComparisonId.value = comparisonId

  // Track the engagement
  trackUserEngagement(UserEngagementMetric.FeatureAdoption, {
    feature: 'comparison_view',
    comparison_id: comparisonId,
    persona: props.activePersona,
  })
}

// Hover states for highlighting cards
const isHoveringOld = ref(false)
const isHoveringNew = ref(false)

// Track CTA clicks
const trackCTAClick = () => {
  trackUserEngagement(UserEngagementMetric.ActionsPerSession, {
    action: 'comparison_cta_click',
    comparison_id: activeComparisonId.value,
    persona: props.activePersona,
  })
}
</script>

<template>
  <section
    id="comparison"
    class="py-16 relative overflow-hidden"
  >
    <!-- Background with pure black -->
    <div class="absolute inset-0 bg-slate-950 z-0"></div>

    <!-- Subtle noise texture -->
    <div class="absolute inset-0 bg-[url('/patterns/noise-pattern.svg')] opacity-5 z-0"></div>

    <!-- Subtle glow effects -->
    <div class="absolute top-20 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
    <div class="absolute bottom-40 -right-40 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>

    <div class="wrapper relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section heading -->
      <div
        v-motion
        :initial="motionConstants.sectionTitle.initial"
        :visibleOnce="motionConstants.sectionTitle.enter"
        class="text-center mb-10"
      >
        <h2 class="text-4xl md:text-5xl font-bold tracking-tight">
          <span class="text-white">Experience the </span>
          <span class="text-blue-500">Difference</span>
        </h2>
        <p class="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
          See how AstronEra transforms time-consuming astronomy tasks into streamlined, efficient
          processes
        </p>
      </div>

      <!-- Process selector buttons -->
      <div class="flex justify-center mb-10">
        <div
          class="inline-flex bg-slate-900/60 backdrop-blur-sm rounded-full p-1.5 border border-slate-800/50"
        >
          <button
            v-for="comparison in comparisons"
            :key="comparison.id"
            class="px-5 py-2.5 rounded-full text-lg font-medium transition-all duration-300"
            :class="
              activeComparisonId === comparison.id
                ? `bg-${comparison.newWay.color}-600 text-white shadow-lg shadow-${comparison.newWay.color}-900/20`
                : 'text-gray-400 hover:text-white'
            "
            @click="trackComparisonEngagement(comparison.id)"
          >
            {{ comparison.title }}
          </button>
        </div>
      </div>

      <!-- Comparison cards - side by side -->
      <div
        v-motion
        class="grid grid-cols-1 md:grid-cols-2 gap-6"
        :initial="{ opacity: 0, y: 30 }"
        :visibleOnce="{
          opacity: 1,
          y: 0,
          transition: { type: 'spring', stiffness: 200, damping: 20 },
        }"
      >
        <!-- Old Way Card -->
        <div
          class="transition-all duration-300 transform"
          :class="isHoveringOld ? 'md:scale-102 z-10' : ''"
          @mouseenter="isHoveringOld = true"
          @mouseleave="isHoveringOld = false"
        >
          <div
            class="bg-slate-900/60 backdrop-blur-sm rounded-xl border overflow-hidden transition-all duration-300 h-full"
            :class="
              isHoveringOld
                ? `border-${activeComparison.oldWay.color}-600/30 shadow-xl shadow-${activeComparison.oldWay.color}-900/10`
                : 'border-slate-800/50'
            "
          >
            <div
              class="px-6 py-4 border-b border-slate-700/50 flex items-center gap-3"
              :class="
                isHoveringOld ? `bg-${activeComparison.oldWay.color}-900/30` : 'bg-slate-800/60'
              "
            >
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center"
                :class="`bg-${activeComparison.oldWay.color}-900/50 text-${activeComparison.oldWay.color}-500`"
              >
                <Icon
                  name="mdi:clock-time-eight-outline"
                  size="18"
                />
              </div>
              <h4 class="text-lg font-medium text-white">{{ activeComparison.oldWay.title }}</h4>
            </div>

            <div class="p-5">
              <p class="text-gray-300 mb-5">{{ activeComparison.oldWay.description }}</p>

              <div class="mb-5">
                <h5 class="text-white font-medium mb-3 text-sm uppercase tracking-wider"
                  >Process</h5
                >
                <ol class="space-y-2">
                  <li
                    v-for="(step, index) in activeComparison.oldWay.steps"
                    :key="`old-${index}`"
                    v-motion
                    class="flex items-start gap-3"
                    :initial="{ opacity: 0, x: -10 }"
                    :visibleOnce="{ opacity: 1, x: 0, transition: { delay: 0.1 + index * 0.1 } }"
                  >
                    <div
                      class="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5 border border-slate-700/50"
                    >
                      <span class="text-gray-400 text-xs">{{ index + 1 }}</span>
                    </div>
                    <span class="text-gray-300 text-sm">{{ step }}</span>
                  </li>
                </ol>
              </div>

              <div
                class="rounded-lg p-3 flex items-center justify-between"
                :class="
                  isHoveringOld ? `bg-${activeComparison.oldWay.color}-900/20` : 'bg-slate-800/60'
                "
              >
                <span class="text-gray-400 text-sm">Average Time</span>
                <span
                  class="font-medium"
                  :class="`text-${activeComparison.oldWay.color}-500`"
                  >{{ activeComparison.oldWay.timeframe }}</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- New Way Card -->
        <div
          class="transition-all duration-300 transform"
          :class="isHoveringNew ? 'md:scale-102 z-10' : ''"
          @mouseenter="isHoveringNew = true"
          @mouseleave="isHoveringNew = false"
        >
          <div
            class="bg-slate-900/60 backdrop-blur-sm rounded-xl border overflow-hidden transition-all duration-300 h-full"
            :class="
              isHoveringNew
                ? `border-${activeComparison.newWay.color}-600/30 shadow-xl shadow-${activeComparison.newWay.color}-900/10`
                : 'border-slate-800/50'
            "
          >
            <div
              class="px-6 py-4 border-b border-slate-700/50 flex items-center gap-3"
              :class="
                isHoveringNew ? `bg-${activeComparison.newWay.color}-900/30` : 'bg-slate-800/60'
              "
            >
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center"
                :class="`bg-${activeComparison.newWay.color}-900/50 text-${activeComparison.newWay.color}-500`"
              >
                <Icon
                  name="mdi:rocket-launch-outline"
                  size="18"
                />
              </div>
              <h4 class="text-lg font-medium text-white">{{ activeComparison.newWay.title }}</h4>
            </div>

            <div class="p-5">
              <p class="text-gray-300 mb-5">{{ activeComparison.newWay.description }}</p>

              <div class="mb-5">
                <h5 class="text-white font-medium mb-3 text-sm uppercase tracking-wider"
                  >Process</h5
                >
                <ol class="space-y-2">
                  <li
                    v-for="(step, index) in activeComparison.newWay.steps"
                    :key="`new-${index}`"
                    v-motion
                    class="flex items-start gap-3"
                    :initial="{ opacity: 0, x: -10 }"
                    :visibleOnce="{ opacity: 1, x: 0, transition: { delay: 0.1 + index * 0.1 } }"
                  >
                    <div
                      class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border"
                      :class="`bg-${activeComparison.newWay.color}-900/30 border-${activeComparison.newWay.color}-800/30`"
                    >
                      <span
                        class="text-xs"
                        :class="`text-${activeComparison.newWay.color}-400`"
                        >{{ index + 1 }}</span
                      >
                    </div>
                    <span class="text-gray-300 text-sm">{{ step }}</span>
                  </li>
                </ol>
              </div>

              <div
                class="rounded-lg p-3 flex items-center justify-between"
                :class="
                  isHoveringNew ? `bg-${activeComparison.newWay.color}-900/20` : 'bg-slate-800/60'
                "
              >
                <span class="text-gray-400 text-sm">Average Time</span>
                <span
                  class="font-medium"
                  :class="`text-${activeComparison.newWay.color}-500`"
                  >{{ activeComparison.newWay.timeframe }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Time savings callout -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 0.5 } }"
        class="mt-8 p-4 bg-blue-900/20 border border-blue-800/30 rounded-lg text-center"
      >
        <p class="text-blue-400">
          <span class="font-bold">Save time and resources</span> with AstronEra's streamlined
          approach
        </p>
      </div>

      <!-- CTA section -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 0.6 } }"
        class="mt-10 text-center"
      >
        <PrimeButton
          size="large"
          class="bg-blue-600 hover:bg-blue-500 border-none shadow-lg shadow-blue-900/20 transition-all duration-300 px-6"
          @click="trackCTAClick"
        >
          Try AstronEra Today
          <Icon
            name="mdi:arrow-right"
            class="ml-2"
            size="18"
          />
        </PrimeButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Smooth transitions */
.transition-all {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Scale slightly on hover */
.md\:scale-102 {
  transform: scale(1.02);
}
</style>
