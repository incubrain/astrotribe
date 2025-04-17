<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, provide } from 'vue'
import { useWindowScroll, useWindowSize, useIntersectionObserver } from '@vueuse/core'
import { usePersona } from '~/composables/usePersona'

// Get persona state from our composable
const { activePersona, personaStyles, setActivePersona, personas } = usePersona()

// Define events
const emit = defineEmits(['navigateTo', 'toggleFeature'])

// Reactive State
const isOpen = ref(false)
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
const { width: windowWidth } = useWindowSize()

// Calculate if sidebar should be shown (hide on very top of page and on tablet/mobile)
const shouldShowSidebar = computed(() => y.value > 100 && windowWidth.value >= 1024)

// Handle mouse interactions
const handleMouseEnter = () => {
  isOpen.value = true
}

const handleMouseLeave = () => {
  isOpen.value = false
}

// Get current persona configuration
const personaConfig = computed(() => {
  const persona = activePersona.value.name.toLowerCase()

  return (
    {
      'researcher': {
        color: 'blue',
        iconClass: 'text-blue-500',
        sectionTools: {
          home: [],
          events: [{ id: 'add-calendar', label: 'Add to Calendar', icon: 'mdi:calendar-plus' }],
          comparison: [],
          features: [
            {
              id: 'research-context',
              label: 'Research Context',
              icon: 'mdi:book-open-page-variant',
            },
          ],
          partners: [{ id: 'journal-access', label: 'Journal Access', icon: 'mdi:key' }],
          pricing: [{ id: 'academic-pricing', label: 'Academic Pricing', icon: 'mdi:school' }],
          cta: [{ id: 'schedule-demo', label: 'Schedule Demo', icon: 'mdi:calendar-clock' }],
        },
      },
      'sci-commer': {
        color: 'red',
        iconClass: 'text-red-500',
        sectionTools: {
          home: [],
          events: [
            { id: 'press-releases', label: 'Event Press Releases', icon: 'mdi:text-box-multiple' },
          ],
          comparison: [],
          features: [
            {
              id: 'press-kit-generator',
              label: 'Press Kit Generator',
              icon: 'mdi:newspaper-variant',
            },
          ],
          partners: [
            { id: 'source-citations', label: 'Source Citations', icon: 'mdi:link-variant' },
          ],
          pricing: [{ id: 'media-pricing', label: 'Media Pricing', icon: 'mdi:currency-usd' }],
          cta: [
            { id: 'content-samples', label: 'Content Samples', icon: 'mdi:file-document-multiple' },
          ],
        },
      },
      'enthusiast': {
        color: 'amber',
        iconClass: 'text-amber-500',
        sectionTools: {
          home: [],
          events: [{ id: 'viewing-reminder', label: 'Set Reminder', icon: 'mdi:bell' }],
          comparison: [],
          features: [
            { id: 'astrofact-daily', label: 'AstroFact of the Day', icon: 'mdi:star-shooting' },
          ],
          partners: [{ id: 'public-events', label: 'Public Events', icon: 'mdi:calendar-star' }],
          pricing: [{ id: 'family-plans', label: 'Family Plans', icon: 'mdi:account-group' }],
          cta: [
            { id: 'beginner-resources', label: 'Beginner Resources', icon: 'mdi:rocket-launch' },
          ],
        },
      },
    }[persona] || {
      color: 'blue',
      iconClass: 'text-blue-500',
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
  return personaConfig.value.sectionTools[activeSection.value] || []
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

// Navigate to section
const navigateToSection = (sectionId) => {
  const section = document.getElementById(sectionId)
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' })
  }
  emit('navigateTo', sectionId)
}

// Change persona
const changePersona = (persona) => {
  setActivePersona(persona)
}

// Lifecycle hooks
onMounted(() => {
  setupSectionObservers()
})

// Provide activeSection to child components
provide('activeSection', activeSection)
</script>

<template>
  <div
    v-if="shouldShowSidebar"
    ref="missionControlRef"
    class="mission-control fixed right-0 top-1/4 flex flex-col z-50 transition-all duration-300 ease-in-out transform"
    :class="[isOpen ? 'translate-x-0' : 'translate-x-[calc(100%-20px)]']"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- Mission Control Bar -->
    <div
      class="h-full bg-slate-900/90 backdrop-blur-lg border-l border-t border-b rounded-l-lg overflow-hidden shadow-xl"
      :class="[`border-${personaConfig.color}-800/30 shadow-${personaConfig.color}-900/20`]"
    >
      <!-- Mission Control indicator bar (visible when collapsed) -->
      <div
        class="absolute left-0 top-0 bottom-0 w-1.5 transition-colors duration-300"
        :class="`bg-${activePersona.color}-600`"
      ></div>

      <!-- Header -->
      <div
        class="px-3 py-3 border-b flex items-center gap-2 justify-between"
        :class="[`border-${personaConfig.color}-800/30`]"
      >
        <div class="flex items-center">
          <Icon
            name="mdi:rhombus-split"
            :class="`text-${activePersona.color}-500 mr-2`"
            size="20"
          />
          <h3 class="text-white font-medium truncate">
            {{ currentSectionHeading }}
          </h3>
        </div>
      </div>

      <!-- Persona Selector -->
      <div
        class="px-3 py-3 border-b"
        :class="[`border-${personaConfig.color}-800/30`]"
      >
        <h4 class="text-xs font-medium text-gray-500 uppercase tracking-wider px-2 mb-2">
          Mission Type
        </h4>
        <div class="flex items-center justify-around gap-2">
          <div
            v-for="persona in personas"
            :key="persona.name"
            class="relative group"
          >
            <button
              class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
              :class="[
                persona.name === activePersona.name
                  ? `bg-${persona.color}-800 border-2 border-${persona.color}-500 shadow-md shadow-${persona.color}-900/30`
                  : `bg-${persona.color}-900/40 hover:bg-${persona.color}-900/60`,
              ]"
              @click="changePersona(persona)"
            >
              <Icon
                :name="persona.iconName"
                :class="`text-${persona.color}-500`"
                size="20"
              />
            </button>

            <!-- Tooltip -->
            <div
              class="persona-tooltip absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 py-1 px-2 bg-slate-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none"
            >
              {{ persona.name }}
              <div
                class="tooltip-arrow absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-800"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section Navigation -->
      <div
        class="px-2 py-3 border-b overflow-y-auto max-h-60"
        :class="[`border-${personaConfig.color}-800/30`]"
      >
        <h4 class="text-xs font-medium text-gray-500 uppercase tracking-wider px-2 mb-2">
          Navigation
        </h4>
        <div class="space-y-1">
          <button
            v-for="section in sections"
            :key="section"
            class="w-full flex items-center gap-2 px-3 py-2 rounded-md text-left transition-colors duration-200"
            :class="[
              activeSection === section
                ? `bg-${personaConfig.color}-900/50 text-${personaConfig.color}-400 border border-${personaConfig.color}-700/30`
                : 'text-gray-400 hover:bg-slate-800/60 hover:text-white border border-transparent',
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
            <span class="text-sm truncate">
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

      <!-- Contextual Tools (always present but conditionally populated) -->
      <div class="px-2 py-3">
        <h4 class="text-xs font-medium text-gray-500 uppercase tracking-wider px-2 mb-2">
          Section Tools
        </h4>
        <div class="space-y-1">
          <button
            v-for="tool in currentTools"
            :key="tool.id"
            class="w-full flex items-center gap-2 px-3 py-2 rounded-md text-left transition-all duration-200"
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
            <span class="text-sm truncate">
              {{ tool.label }}
            </span>
          </button>

          <!-- Placeholder message when no tools are available -->
          <div
            v-if="currentTools.length === 0"
            class="text-center h-[42px] text-gray-500 text-sm italic"
          >
            No specific tools for this section
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mission-control {
  width: 240px;
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
.shadow-blue-900\/20 {
  box-shadow: 0 0 15px rgba(30, 64, 175, 0.2);
}

.shadow-red-900\/20 {
  box-shadow: 0 0 15px rgba(153, 27, 27, 0.2);
}

.shadow-amber-900\/20 {
  box-shadow: 0 0 15px rgba(120, 53, 15, 0.2);
}
</style>
