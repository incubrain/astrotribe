<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, provide } from 'vue'
import { useWindowScroll, useWindowSize, useIntersectionObserver } from '@vueuse/core'
import { usePersona } from '~/composables/usePersona'

// Get persona state from our composable
const { activePersona, personaStyles, isResearcher, isCommunicator, isEnthusiast } = usePersona()

// Define events
const emit = defineEmits(['navigateTo', 'toggleFeature'])

// Reactive State
const isExpanded = ref(false)
const activeSection = ref('home')
const lastActiveSection = ref('home')
const isTransitioning = ref(false)
const activeTool = ref('')
const sectionRefs = ref({})
const missionControlRef = ref(null)

// Sections for intersection detection
const sections = ['home', 'events', 'comparison', 'features', 'partners', 'pricing', 'cta']

// Track scroll position for animations
const { y } = useWindowScroll()
const { height: windowHeight } = useWindowSize()

// Calculate if sidebar should be shown (hide on very top of page)
const shouldShowSidebar = computed(() => y.value > 100)

// Get current persona configuration
const personaConfig = computed(() => {
  const persona = activePersona.value.name.toLowerCase()

  return (
    {
      researcher: {
        color: 'blue',
        iconClass: 'text-blue-500',
        primaryTools: [
          { id: 'search', label: 'Research Search', icon: 'mdi:file-search' },
          { id: 'papers', label: 'Recent Papers', icon: 'mdi:file-document-multiple' },
          { id: 'collaborate', label: 'Find Collaborators', icon: 'mdi:account-group' },
          { id: 'trends', label: 'Research Trends', icon: 'mdi:trending-up' },
        ],
        sectionTools: {
          home: [
            { id: 'quick-search', label: 'Quick Search', icon: 'mdi:magnify' },
            { id: 'save-profile', label: 'Save Profile', icon: 'mdi:content-save' },
          ],
          events: [
            { id: 'conference-filter', label: 'Filter: Conferences', icon: 'mdi:filter-variant' },
            { id: 'add-calendar', label: 'Add to Calendar', icon: 'mdi:calendar-plus' },
          ],
          comparison: [
            { id: 'efficiency-calc', label: 'Efficiency Calculator', icon: 'mdi:calculator' },
          ],
          features: [
            {
              id: 'research-context',
              label: 'Research Context',
              icon: 'mdi:book-open-page-variant',
            },
            { id: 'idea-analysis', label: 'Novelty Analysis', icon: 'mdi:lightbulb' },
          ],
          partners: [{ id: 'journal-access', label: 'Journal Access', icon: 'mdi:key' }],
          pricing: [
            { id: 'academic-pricing', label: 'Academic Pricing', icon: 'mdi:school' },
            { id: 'grant-calculator', label: 'Grant Calculator', icon: 'mdi:calculator-variant' },
          ],
          cta: [{ id: 'schedule-demo', label: 'Schedule Demo', icon: 'mdi:calendar-clock' }],
        },
      },
      communicator: {
        color: 'emerald',
        iconClass: 'text-emerald-500',
        primaryTools: [
          { id: 'content-generator', label: 'Content Generator', icon: 'mdi:pencil' },
          { id: 'press-kits', label: 'Press Kits', icon: 'mdi:newspaper' },
          { id: 'visualizations', label: 'Visualizations', icon: 'mdi:chart-box' },
          { id: 'audience-levels', label: 'Audience Levels', icon: 'mdi:account-multiple' },
        ],
        sectionTools: {
          home: [
            { id: 'trending-topics', label: 'Trending Topics', icon: 'mdi:fire' },
            { id: 'save-draft', label: 'Save Draft', icon: 'mdi:content-save-edit' },
          ],
          events: [
            { id: 'media-opportunities', label: 'Media Opportunities', icon: 'mdi:camera' },
            { id: 'press-releases', label: 'Event Press Releases', icon: 'mdi:text-box-multiple' },
          ],
          comparison: [
            { id: 'explainer-generator', label: 'Explainer Generator', icon: 'mdi:account-voice' },
          ],
          features: [
            {
              id: 'press-kit-generator',
              label: 'Press Kit Generator',
              icon: 'mdi:newspaper-variant',
            },
            { id: 'fact-checker', label: 'Fact Checker', icon: 'mdi:check-decagram' },
          ],
          partners: [
            { id: 'source-citations', label: 'Source Citations', icon: 'mdi:link-variant' },
          ],
          pricing: [
            { id: 'media-pricing', label: 'Media Pricing', icon: 'mdi:currency-usd' },
            { id: 'content-quota', label: 'Content Quota', icon: 'mdi:chart-donut' },
          ],
          cta: [
            { id: 'content-samples', label: 'Content Samples', icon: 'mdi:file-document-multiple' },
          ],
        },
      },
      enthusiast: {
        color: 'amber',
        iconClass: 'text-amber-500',
        primaryTools: [
          { id: 'learn', label: 'Learning Paths', icon: 'mdi:school' },
          { id: 'events', label: 'Space Events', icon: 'mdi:rocket-launch' },
          { id: 'community', label: 'Community', icon: 'mdi:account-group' },
          { id: 'stargazing', label: 'Stargazing Guide', icon: 'mdi:star' },
        ],
        sectionTools: {
          home: [
            { id: 'daily-fact', label: 'Astronomy Fact', icon: 'mdi:star' },
            { id: 'save-interests', label: 'Save Interests', icon: 'mdi:bookmark-plus' },
          ],
          events: [
            { id: 'viewing-events', label: 'Viewing Events', icon: 'mdi:eye' },
            { id: 'viewing-reminder', label: 'Set Reminder', icon: 'mdi:bell' },
          ],
          comparison: [
            { id: 'beginner-guide', label: 'Beginner Guide', icon: 'mdi:book-open-variant' },
          ],
          features: [
            { id: 'astrofact-daily', label: 'AstroFact of the Day', icon: 'mdi:star-shooting' },
            {
              id: 'trivia-challenge',
              label: 'Trivia Challenge',
              icon: 'mdi:checkbox-marked-circle',
            },
          ],
          partners: [{ id: 'public-events', label: 'Public Events', icon: 'mdi:calendar-star' }],
          pricing: [
            { id: 'family-plans', label: 'Family Plans', icon: 'mdi:account-group' },
            { id: 'club-discounts', label: 'Astronomy Club Discounts', icon: 'mdi:ticket-percent' },
          ],
          cta: [
            { id: 'beginner-resources', label: 'Beginner Resources', icon: 'mdi:rocket-launch' },
          ],
        },
      },
    }[persona] || {
      color: 'blue',
      iconClass: 'text-blue-500',
      primaryTools: [],
      sectionTools: {},
    }
  )
})

// Section heading based on current active section
const currentSectionHeading = computed(() => {
  const headings = {
    home: 'Mission Overview',
    events: 'Upcoming Events',
    comparison: 'Process Comparison',
    features: 'Platform Features',
    partners: 'Data Sources',
    pricing: 'Membership Options',
    cta: 'Launch Control',
  }
  return headings[activeSection.value] || 'Mission Control'
})

// Current tools based on active section and persona
const currentTools = computed(() => {
  // Default to primary tools when not in a specific section
  if (!personaConfig.value.sectionTools[activeSection.value]) {
    return personaConfig.value.primaryTools
  }

  return personaConfig.value.sectionTools[activeSection.value]
})

// Detect current section based on scroll position
const setupSectionObservers = () => {
  if (import.meta.client) {
    // Create refs for each section
    sections.forEach((section) => {
      const el = document.getElementById(section)
      if (el) {
        sectionRefs.value[section] = el
      }
    })

    // Set up observers
    sections.forEach((section) => {
      const target = sectionRefs.value[section]
      if (!target) return

      const { stop } = useIntersectionObserver(
        target,
        ([{ isIntersecting }]) => {
          if (isIntersecting) {
            lastActiveSection.value = activeSection.value
            activeSection.value = section
            isTransitioning.value = true

            // Reset transition state after animation completes
            setTimeout(() => {
              isTransitioning.value = false
            }, 300)
          }
        },
        { threshold: 0.3 }, // Trigger when 30% of the section is visible
      )
    })
  }
}

// Handle tool click
const handleToolClick = (toolId) => {
  activeTool.value = toolId
  emit('toggleFeature', {
    tool: toolId,
    section: activeSection.value,
    persona: activePersona.value.name,
  })
}

// Toggle sidebar expansion
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

// Navigate to section
const navigateToSection = (sectionId) => {
  const section = document.getElementById(sectionId)
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' })
  }
  emit('navigateTo', sectionId)
}

// Add keyboard shortcut to toggle sidebar (Ctrl+Space)
const handleKeydown = (e) => {
  if (e.ctrlKey && e.code === 'Space') {
    e.preventDefault()
    toggleExpand()
  }
}

// Lifecycle hooks
onMounted(() => {
  setupSectionObservers()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

// Provide activeSection to child components
provide('activeSection', activeSection)
</script>

<template>
  <div
    ref="missionControlRef"
    class="mission-control fixed right-0 flex flex-col z-50 transition-all duration-300 ease-in-out transform"
    :class="[
      shouldShowSidebar ? 'translate-x-0' : 'translate-x-full',
      isExpanded ? 'w-64' : 'w-16',
      `border-${personaConfig.color}-800/30`,
    ]"
  >
    <!-- Mission Control Bar -->
    <div
      class="h-full bg-slate-900/80 backdrop-blur-lg border-l border-t border-b rounded-l-lg overflow-hidden shadow-xl flex flex-col"
      :class="[`shadow-${personaConfig.color}-900/10`]"
    >
      <!-- Header -->
      <div
        class="px-3 py-4 border-b flex items-center gap-2"
        :class="[`border-${personaConfig.color}-800/30`]"
      >
        <button
          class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300"
          :class="[`hover:bg-${personaConfig.color}-900/50 text-${personaConfig.color}-500`]"
          :title="isExpanded ? 'Collapse' : 'Expand'"
          @click="toggleExpand"
        >
          <Icon
            :name="isExpanded ? 'mdi:chevron-right' : 'mdi:chevron-left'"
            size="20"
          />
        </button>

        <h3
          v-if="isExpanded"
          class="text-white font-medium truncate transition-opacity duration-300"
          :class="{ 'opacity-0': !isExpanded, 'opacity-100': isExpanded }"
        >
          {{ currentSectionHeading }}
        </h3>
      </div>

      <!-- Persona Indicator -->
      <div
        class="px-3 py-2 border-b"
        :class="[`border-${personaConfig.color}-800/30`]"
      >
        <div class="flex items-center gap-2">
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center"
            :class="[`bg-${personaConfig.color}-900/50 text-${personaConfig.color}-500`]"
          >
            <Icon
              :name="activePersona.iconName"
              size="16"
            />
          </div>

          <div
            v-if="isExpanded"
            class="transition-opacity duration-300"
            :class="{ 'opacity-0': !isExpanded, 'opacity-100': isExpanded }"
          >
            <p class="text-white text-sm font-medium capitalize">{{ activePersona.name }}</p>
            <p class="text-gray-400 text-xs">Active Profile</p>
          </div>
        </div>
      </div>

      <!-- Section Navigation -->
      <div
        class="px-2 py-3 border-b"
        :class="[`border-${personaConfig.color}-800/30`]"
      >
        <div class="space-y-1">
          <button
            v-for="section in sections"
            :key="section"
            class="w-full flex items-center gap-2 px-2 py-2 rounded-md text-left transition-colors duration-200"
            :class="[
              activeSection === section
                ? `bg-${personaConfig.color}-900/30 text-${personaConfig.color}-400`
                : 'text-gray-400 hover:bg-slate-800/60 hover:text-white',
            ]"
            @click="navigateToSection(section)"
          >
            <div class="w-6 h-6 flex items-center justify-center">
              <Icon
                :name="
                  section === 'home'
                    ? 'mdi:home'
                    : section === 'events'
                      ? 'mdi:calendar-star'
                      : section === 'comparison'
                        ? 'mdi:compare'
                        : section === 'features'
                          ? 'mdi:view-grid-plus'
                          : section === 'partners'
                            ? 'mdi:handshake'
                            : section === 'pricing'
                              ? 'mdi:currency-usd'
                              : 'mdi:rocket-launch'
                "
                size="18"
              />
            </div>

            <span
              v-if="isExpanded"
              class="truncate transition-opacity duration-300"
              :class="{ 'opacity-0': !isExpanded, 'opacity-100': isExpanded }"
            >
              {{
                section === 'home'
                  ? 'Home'
                  : section === 'events'
                    ? 'Events'
                    : section === 'comparison'
                      ? 'Comparison'
                      : section === 'features'
                        ? 'Features'
                        : section === 'partners'
                          ? 'Partners'
                          : section === 'pricing'
                            ? 'Pricing'
                            : 'Get Started'
              }}
            </span>
          </button>
        </div>
      </div>

      <!-- Contextual Tools -->
      <div class="flex-1 overflow-y-auto px-2 py-3">
        <h4
          v-if="isExpanded"
          class="text-xs font-medium text-gray-500 uppercase tracking-wider px-2 mb-2 transition-opacity duration-300"
          :class="{ 'opacity-0': !isExpanded, 'opacity-100': isExpanded }"
        >
          {{ activeSection === 'home' ? 'Primary Tools' : 'Section Tools' }}
        </h4>

        <div
          class="space-y-1"
          :class="[isTransitioning ? 'opacity-50' : 'opacity-100']"
        >
          <button
            v-for="tool in currentTools"
            :key="tool.id"
            class="w-full flex items-center gap-2 px-2 py-2 rounded-md text-left transition-all duration-200"
            :class="[
              activeTool === tool.id
                ? `bg-${personaConfig.color}-900/50 text-${personaConfig.color}-400 border border-${personaConfig.color}-700/30`
                : 'text-gray-400 hover:bg-slate-800/60 hover:text-white border border-transparent',
            ]"
            @click="handleToolClick(tool.id)"
          >
            <div
              class="w-6 h-6 flex items-center justify-center"
              :class="[personaConfig.iconClass]"
            >
              <Icon
                :name="tool.icon"
                size="18"
              />
            </div>

            <span
              v-if="isExpanded"
              class="text-sm truncate transition-opacity duration-300"
              :class="{ 'opacity-0': !isExpanded, 'opacity-100': isExpanded }"
            >
              {{ tool.label }}
            </span>
          </button>
        </div>
      </div>

      <!-- Footer Controls -->
      <div
        class="px-3 py-3 border-t"
        :class="[`border-${personaConfig.color}-800/30`]"
      >
        <div class="flex items-center gap-2 justify-between">
          <button
            class="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200"
            :class="[`hover:bg-${personaConfig.color}-900/50 text-${personaConfig.color}-500`]"
            title="Help"
          >
            <Icon
              name="mdi:help-circle"
              size="18"
            />
          </button>

          <button
            v-if="isExpanded"
            class="flex items-center gap-1 text-xs rounded-md px-2 py-1 transition-opacity duration-300"
            :class="[
              `text-${personaConfig.color}-400 hover:bg-${personaConfig.color}-900/30`,
              { 'opacity-0': !isExpanded, 'opacity-100': isExpanded },
            ]"
          >
            <Icon
              name="mdi:keyboard"
              size="14"
            />
            <span>Shortcuts</span>
          </button>

          <button
            class="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200"
            :class="[`hover:bg-${personaConfig.color}-900/50 text-${personaConfig.color}-500`]"
            title="Settings"
          >
            <Icon
              name="mdi:cog"
              size="18"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- Keyboard shortcut hint -->
    <div
      v-if="!isExpanded"
      class="absolute -left-24 top-4 bg-slate-800/90 rounded-md px-2 py-1 text-xs text-gray-400 opacity-80"
    >
      Ctrl+Space
    </div>
  </div>
</template>

<style scoped>
.mission-control {
  height: calc(100vh - 100px);
  top: 80px;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.overflow-y-auto::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.overflow-y-auto {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

/* Subtle glow effect */
.shadow-blue-900\/10 {
  box-shadow: 0 0 15px rgba(30, 64, 175, 0.1);
}

.shadow-emerald-900\/10 {
  box-shadow: 0 0 15px rgba(6, 95, 70, 0.1);
}

.shadow-amber-900\/10 {
  box-shadow: 0 0 15px rgba(120, 53, 15, 0.1);
}
</style>
