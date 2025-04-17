<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { usePersona } from '~/composables/usePersona'
import { useAnimation } from '~/composables/useAnimation'
import { useAnalytics } from '#imports'

const { conf: motionConstants } = useAnimation()
const { activePersona, personaStyles, isResearcher, isCommunicator, isEnthusiast } = usePersona()
const { trackUserEngagement, UserEngagementMetric } = useAnalytics()

// Active process tab
const activeProcess = ref('default')

// Track tab changes
const trackTabChange = (tabId: string) => {
  try {
    trackUserEngagement(UserEngagementMetric.FeatureAdoption, {
      feature: 'process_comparison',
      tab: tabId,
      persona: activePersona.value.name,
    })
  } catch (error) {
    console.error('Error tracking tab change:', error)
  }
}

// Process options based on persona
const processes = computed(() => {
  // Default processes (if no specific persona is selected)
  const defaultProcesses = [
    {
      id: 'research',
      label: 'Astronomy Research Process',
      icon: 'mdi:telescope',
    },
    {
      id: 'education',
      label: 'Creating Educational Content',
      icon: 'mdi:school',
    },
    {
      id: 'discovery',
      label: 'Space Discovery Exploration',
      icon: 'mdi:rocket',
    },
  ]

  // Researcher-specific processes
  const researcherProcesses = [
    {
      id: 'literature',
      label: 'Literature Review',
      icon: 'mdi:file-document-outline',
    },
    {
      id: 'data-analysis',
      label: 'Data Analysis',
      icon: 'mdi:chart-line',
    },
    {
      id: 'publication',
      label: 'Research Publication',
      icon: 'mdi:notebook-outline',
    },
  ]

  // Science Communicator processes
  const communicatorProcesses = [
    {
      id: 'education',
      label: 'Creating Educational Content',
      icon: 'mdi:school',
    },
    {
      id: 'visualization',
      label: 'Data Visualization',
      icon: 'mdi:chart-bubble',
    },
    {
      id: 'presentation',
      label: 'Public Presentations',
      icon: 'mdi:presentation',
    },
  ]

  // Enthusiast processes
  const enthusiastProcesses = [
    {
      id: 'discovery',
      label: 'Space Discovery Exploration',
      icon: 'mdi:rocket',
    },
    {
      id: 'stargazing',
      label: 'Stargazing & Observation',
      icon: 'mdi:star',
    },
    {
      id: 'learning',
      label: 'Astronomy Learning',
      icon: 'mdi:book-open',
    },
  ]

  // Return processes based on active persona
  if (isResearcher.value) {
    return researcherProcesses
  } else if (isCommunicator.value) {
    return communicatorProcesses
  } else if (isEnthusiast.value) {
    return enthusiastProcesses
  }

  return defaultProcesses
})

// Set default active process based on persona
const setDefaultProcess = () => {
  if (processes.value.length > 0) {
    activeProcess.value = processes.value[0].id
    trackTabChange(processes.value[0].id)
  }
}

// Watch for persona changes to update the active process
watch(
  () => activePersona.value,
  () => {
    setDefaultProcess()
  },
  { immediate: true },
)

// Active process label
const activeProcessLabel = computed(() => {
  const process = processes.value.find((p) => p.id === activeProcess.value)
  return process ? process.label : 'Process Comparison'
})

// Process content mapping - traditional vs AstronEra
const processContent = computed(() => {
  // Process definitions with traditional and AstronEra approaches
  const processMap = {
    // Researcher processes
    'literature': {
      traditional: {
        title: 'Traditional Literature Review',
        description:
          'Researchers spend weeks manually searching through journals and citations to find relevant papers.',
        steps: [
          'Search multiple databases and journals individually',
          'Read through hundreds of abstracts to filter relevant papers',
          'Manually track citations and references',
          'Create bibliography and citation management by hand',
          'Spend hours documenting research gaps',
        ],
        averageTime: 'Several weeks',
        iconClass: 'text-red-500',
      },
      astronera: {
        title: 'AstronEra Literature Analysis',
        description:
          'Instantly discover and organize relevant research papers with AI-powered search and analysis.',
        steps: [
          'Search across all major astronomy databases with one query',
          'AI automatically identifies the most relevant papers',
          'Citation network visualization highlights key connections',
          'One-click bibliography generation with proper formatting',
          'Automated research gap identification',
        ],
        averageTime: 'Under 2 days',
        iconClass: `text-${activePersona.value.color}-500`,
      },
    },
    'data-analysis': {
      traditional: {
        title: 'Traditional Data Analysis',
        description:
          'Astronomers wrestle with complex datasets, custom scripts, and compatibility issues.',
        steps: [
          'Spend days cleaning and preprocessing raw data',
          'Write custom analysis scripts for each dataset',
          'Debug compatibility issues between tools',
          'Manually interpret results without guidance',
          'Recreate analysis when new data arrives',
        ],
        averageTime: 'Several weeks',
        iconClass: 'text-red-500',
      },
      astronera: {
        title: 'AstronEra Data Analysis',
        description:
          'Streamlined analysis workflows with pre-built tools and automated interpretation.',
        steps: [
          'Automatic data cleaning and standardization',
          'Access proven analysis templates for common tasks',
          'Unified interface for all analysis tools',
          'AI-assisted results interpretation',
          'One-click reanalysis when new data arrives',
        ],
        averageTime: 'Under 3 days',
        iconClass: `text-${activePersona.value.color}-500`,
      },
    },
    'publication': {
      traditional: {
        title: 'Traditional Publication Process',
        description:
          'Researchers navigate complex submission requirements and lengthy review cycles.',
        steps: [
          'Format manuscript according to specific journal guidelines',
          'Create figures in multiple formats for submission',
          'Wait months for peer review feedback',
          'Manually address each reviewer comment',
          'Resubmit to another journal if rejected',
        ],
        averageTime: '6-12 months',
        iconClass: 'text-red-500',
      },
      astronera: {
        title: 'AstronEra Publication Assistant',
        description:
          'Streamlined publication workflow with formatting tools and feedback acceleration.',
        steps: [
          'One-click formatting for any astronomy journal',
          'Automatic figure generation in all required formats',
          'Pre-submission review suggestions to improve acceptance chances',
          'Feedback organization and response templates',
          'Journal recommendation based on your manuscript',
        ],
        averageTime: '3-6 months',
        iconClass: `text-${activePersona.value.color}-500`,
      },
    },

    // Science Communicator processes
    'education': {
      traditional: {
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
        averageTime: 'Several days',
        iconClass: 'text-red-500',
      },
      astronera: {
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
        averageTime: 'Under 1 hour',
        iconClass: `text-${activePersona.value.color}-500`,
      },
    },
    'visualization': {
      traditional: {
        title: 'Traditional Visualization Creation',
        description:
          'Science communicators struggle with complex software or expensive designers to create visuals.',
        steps: [
          'Learn specialized visualization software',
          'Source accurate astronomical data',
          'Create each visual element manually',
          'Verify scientific accuracy of visualization',
          'Recreate for different formats (print, web, presentation)',
        ],
        averageTime: '2-3 days per visualization',
        iconClass: 'text-red-500',
      },
      astronera: {
        title: 'AstronEra Visualization Tool',
        description:
          'Create scientifically accurate visualizations in minutes, in any format you need.',
        steps: [
          'Select from pre-verified astronomical datasets',
          'Choose from customizable visualization templates',
          'Adjust detail level for your target audience',
          'Preview across multiple formats simultaneously',
          'Export in any format with one click',
        ],
        averageTime: '15-30 minutes per visualization',
        iconClass: `text-${activePersona.value.color}-500`,
      },
    },
    'presentation': {
      traditional: {
        title: 'Traditional Presentation Preparation',
        description:
          'Hours spent gathering materials, creating slides, and preparing talking points.',
        steps: [
          'Research topic across multiple sources',
          'Create slides from scratch for each presentation',
          'Source or create images and diagrams',
          'Script and memorize talking points',
          'Limited audience engagement tools',
        ],
        averageTime: '1-2 days',
        iconClass: 'text-red-500',
      },
      astronera: {
        title: 'AstronEra Presentation Suite',
        description:
          'Dynamic presentation creation with interactive elements and real-time audience engagement.',
        steps: [
          'Select topic from curated scientific content',
          'Choose from astronomy presentation templates',
          'Auto-populate with verified images and diagrams',
          'Generate talking points with audience-specific explanations',
          'Built-in interactive polls and Q&A assistance',
        ],
        averageTime: '1-2 hours',
        iconClass: `text-${activePersona.value.color}-500`,
      },
    },

    // Enthusiast processes
    'discovery': {
      traditional: {
        title: 'Traditional Space Discovery',
        description:
          'Enthusiasts struggle to find and understand the latest astronomical discoveries.',
        steps: [
          'Monitor multiple news sources for astronomy news',
          'Try to understand technical scientific papers',
          'Search for simplified explanations of complex concepts',
          'Manually track space missions and launches',
          'Miss connections between related discoveries',
        ],
        averageTime: 'Hours of weekly effort',
        iconClass: 'text-red-500',
      },
      astronera: {
        title: 'AstronEra Discovery Feed',
        description:
          'Stay effortlessly updated with personalized, easy-to-understand space news and discoveries.',
        steps: [
          'Receive personalized daily astronomy news digest',
          'Get concept explanations matching your knowledge level',
          'Explore interactive 3D models of new discoveries',
          'Track all space missions and launches in one place',
          'See connections between discoveries with knowledge graph',
        ],
        averageTime: '15 minutes daily',
        iconClass: `text-${activePersona.value.color}-500`,
      },
    },
    'stargazing': {
      traditional: {
        title: 'Traditional Stargazing Planning',
        description:
          'Amateur astronomers spend hours planning observation sessions with fragmented tools.',
        steps: [
          'Check multiple weather forecasts for clear skies',
          "Research what's visible from your location tonight",
          'Look up coordinates and finder charts separately',
          'Manually plan observation sequence',
          'Record observations in physical notebooks',
        ],
        averageTime: '1-2 hours of preparation',
        iconClass: 'text-red-500',
      },
      astronera: {
        title: 'AstronEra Stargazing Assistant',
        description:
          'All-in-one observation planning with personalized recommendations and digital logging.',
        steps: [
          'Get astronomy-specific weather forecasts for your location',
          "View tonight's personalized observation recommendations",
          'Access interactive sky maps with one-touch object location',
          'Follow optimized observation sequences based on conditions',
          'Record observations digitally with image annotation',
        ],
        averageTime: 'Under 10 minutes of preparation',
        iconClass: `text-${activePersona.value.color}-500`,
      },
    },
    'learning': {
      traditional: {
        title: 'Traditional Astronomy Learning',
        description:
          'Learners piece together fragmented resources with varying quality and accuracy.',
        steps: [
          'Search through books, videos, and websites',
          'Evaluate credibility of information sources',
          'Fill knowledge gaps between beginner and advanced content',
          'No clear learning path or curriculum',
          'Limited feedback on understanding',
        ],
        averageTime: 'Inconsistent progress',
        iconClass: 'text-red-500',
      },
      astronera: {
        title: 'AstronEra Learning Path',
        description:
          'Structured, personalized learning journey with interactive content and progress tracking.',
        steps: [
          'Follow personalized astronomy curriculum based on interests',
          'Learn with verified, up-to-date scientific content',
          'Interactive simulations reinforce complex concepts',
          'Knowledge checks ensure understanding before advancing',
          'Track your progress with astronomy knowledge map',
        ],
        averageTime: 'Measurable weekly progress',
        iconClass: `text-${activePersona.value.color}-500`,
      },
    },

    // Default processes
    'research': {
      traditional: {
        title: 'Traditional Research Process',
        description:
          'Astronomers spend months on manual tasks that delay discovery and publication.',
        steps: [
          'Manually search for relevant papers across databases',
          'Spend weeks analyzing datasets with custom scripts',
          'Troubleshoot software and format compatibility issues',
          'Wait months for peer review feedback',
          'Limited collaboration opportunities',
        ],
        averageTime: '6-12 months per project',
        iconClass: 'text-red-500',
      },
      astronera: {
        title: 'AstronEra Research Workflow',
        description:
          'Streamlined research process with AI-powered tools that accelerate every step.',
        steps: [
          'Find all relevant research with semantic search',
          'Analyze data in minutes with specialized astronomy tools',
          'Standardized formats and seamless tool integration',
          'Get pre-submission feedback to improve papers',
          'Connect with potential collaborators working on similar topics',
        ],
        averageTime: '2-4 months per project',
        iconClass: `text-${activePersona.value.color}-500`,
      },
    },
    'default': {
      traditional: {
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
        averageTime: 'Several days',
        iconClass: 'text-red-500',
      },
      astronera: {
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
        averageTime: 'Under 1 hour',
        iconClass: `text-${activePersona.value.color}-500`,
      },
    },
  }

  return processMap[activeProcess.value] || processMap['default']
})

// Try AstronEra CTA click tracking
const trackCtaClick = () => {
  try {
    trackUserEngagement(UserEngagementMetric.ActionsPerSession, {
      action: 'try_astronera_cta',
      source: 'experience_difference',
      persona: activePersona.value.name,
      process: activeProcess.value,
    })
  } catch (error) {
    console.error('Error tracking CTA click:', error)
  }
}
</script>

<template>
  <section class="py-16 md:py-24 relative overflow-hidden">
    <!-- Background gradient -->

    <div class="wrapper relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <div
        v-motion="motionConstants.sectionTitle"
        class="text-center max-w-3xl mx-auto mb-10"
      >
        <h2 class="text-3xl md:text-5xl font-bold mb-4 text-white leading-tight">
          Experience the
          <span
            :class="personaStyles.sectionHeading"
            class="transition-colors duration-500"
            >Difference</span
          >
        </h2>
        <p class="text-xl text-gray-300">
          See how AstronEra transforms time-consuming astronomy tasks into streamlined, efficient
          processes
        </p>
      </div>

      <!-- Process tabs -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 0.2 } }"
        class="flex flex-wrap justify-center gap-3 mb-12"
      >
        <button
          v-for="process in processes"
          :key="process.id"
          class="px-5 py-3 rounded-full transition-all duration-300 flex items-center gap-2"
          :class="
            activeProcess === process.id
              ? `bg-${activePersona.color}-600/80 text-white shadow-lg shadow-${activePersona.color}-900/20`
              : 'bg-slate-800/70 text-gray-300 hover:bg-slate-700/70 border border-slate-700/50'
          "
          @click="((activeProcess = process.id), trackTabChange(process.id))"
        >
          <Icon
            :name="process.icon"
            size="20"
          />
          <span>{{ process.label }}</span>
        </button>
      </div>

      <!-- Process comparison cards -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 0.3 } }"
        class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-16"
      >
        <!-- Traditional Process Card -->
        <div
          class="rounded-xl border overflow-hidden transition-all duration-500 group hover:shadow-xl hover:opacity-100"
          :class="[
            'bg-red-950/20 border-red-900/30 opacity-75 hover:border-red-900/60',
            'hover:transform hover:scale-[1.02]',
          ]"
        >
          <!-- Card header -->
          <div class="px-6 py-4 border-b border-red-900/30 bg-red-950/30 flex items-center">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center bg-red-900/30 text-red-500"
              >
                <Icon
                  name="mdi:alert-circle-outline"
                  size="24"
                />
              </div>
              <h3 class="text-xl font-bold text-white">{{ processContent.traditional.title }}</h3>
            </div>
          </div>

          <!-- Card content -->
          <div class="p-6">
            <p class="text-gray-300 mb-6">{{ processContent.traditional.description }}</p>

            <div class="mb-8">
              <h4 class="text-red-400 font-medium mb-3 uppercase text-sm tracking-wider"
                >PROCESS</h4
              >
              <ol class="space-y-3">
                <li
                  v-for="(step, index) in processContent.traditional.steps"
                  :key="index"
                  class="flex items-start gap-3"
                >
                  <div
                    class="flex-shrink-0 w-7 h-7 rounded-full bg-red-900/30 flex items-center justify-center text-red-500 text-sm font-medium"
                  >
                    {{ index + 1 }}
                  </div>
                  <span class="text-gray-300">{{ step }}</span>
                </li>
              </ol>
            </div>

            <div class="flex items-center justify-between border-t border-red-900/30 pt-4">
              <span class="text-sm text-gray-400">Average Time</span>
              <span class="text-red-400 font-medium">{{
                processContent.traditional.averageTime
              }}</span>
            </div>
          </div>
        </div>

        <!-- AstronEra Process Card -->
        <div
          class="rounded-xl border overflow-hidden transition-all duration-500 hover:shadow-xl shadow-lg bg-emerald-950/20 border-emerald-900/30 hover:border-emerald-900/60 hover:transform hover:scale-[1.02] shadow-emerald-900/20"
        >
          <!-- Card header -->
          <div class="px-6 py-4 border-b flex items-center border-emerald-900/30 bg-emerald-950/30">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-900/30 text-emerald-500"
              >
                <Icon
                  name="mdi:check-circle"
                  size="24"
                />
              </div>
              <h3 class="text-xl font-bold text-white">{{ processContent.astronera.title }}</h3>
            </div>
          </div>

          <!-- Card content -->
          <div class="p-6">
            <p class="text-gray-300 mb-6">{{ processContent.astronera.description }}</p>

            <div class="mb-8">
              <h4 class="font-medium mb-3 uppercase text-sm tracking-wider text-emerald-400">
                PROCESS
              </h4>
              <ol class="space-y-3">
                <li
                  v-for="(step, index) in processContent.astronera.steps"
                  :key="index"
                  class="flex items-start gap-3"
                >
                  <div
                    class="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium bg-emerald-900/30 text-emerald-500"
                  >
                    {{ index + 1 }}
                  </div>
                  <span class="text-gray-300">{{ step }}</span>
                </li>
              </ol>
            </div>

            <div class="flex items-center justify-between pt-4 border-t border-emerald-900/30">
              <span class="text-sm text-gray-400">Average Time</span>
              <span class="font-medium text-emerald-400">
                {{ processContent.astronera.averageTime }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Save time message -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 0.4 } }"
        class="text-center p-4 sm:p-6 mx-auto rounded-lg mb-12"
        :class="`bg-${activePersona.color}-950/20 border border-${activePersona.color}-900/30`"
      >
        <p class="text-xl text-white flex items-center justify-center gap-2">
          <span>Save time and resources</span>
          <span class="text-amber-400">with</span>
          <span class="font-medium">AstronEra's streamlined approach</span>
        </p>
      </div>

      <!-- CTA Button -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 0.5 } }"
        class="text-center"
      >
        <PrimeButton
          size="large"
          :class="personaStyles.primaryButton"
          class="transition-colors duration-500 shadow-lg px-8 py-3 text-lg"
          @click="trackCtaClick"
        >
          <span>Try AstronEra Today</span>
          <Icon
            name="mdi:arrow-right"
            class="ml-2"
            size="20"
          />
        </PrimeButton>
      </div>
    </div>
  </section>
</template>
