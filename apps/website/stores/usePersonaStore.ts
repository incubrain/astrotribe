// stores/usePersonaStore.ts
import { defineStore } from 'pinia'
import { ref, computed, markRaw } from 'vue'

export interface Persona {
  name: string
  color: string
  description: string
  // Add any additional properties needed for personas
  headline?: string
  features?: string[]
  ctaText?: string
  iconName?: string
  displayName: string
}

export const usePersonaStore = defineStore('persona', () => {
  // State
  const personas = ref<Persona[]>([
    markRaw({
      name: 'researcher',
      displayName: 'Researcher',
      color: 'blue',
      description: 'For researchers and scientists looking to analyze astronomical data.',
      headline: 'Accelerate Research Discovery',
      features: [
        'Access 1M+ research papers in seconds',
        'Identify emerging research trends',
        'Find collaboration opportunities',
        'Discover research gaps automatically',
      ],
      ctaText: 'Start Research Analysis',
      iconName: 'mdi:microscope',
    }),
    markRaw({
      name: 'sci-commer',
      displayName: 'Science Communicator',
      color: 'red',
      description: 'For science communicator and educators sharing astronomy insights.',
      headline: 'Amplify Scientific Storytelling',
      features: [
        'Translate complex concepts for any audience',
        'Generate verified science content',
        'Create engaging visualizations',
        'Track trending space topics',
      ],
      ctaText: 'Create Science Content',
      iconName: 'mdi:broadcast',
    }),
    markRaw({
      name: 'enthusiast',
      displayName: 'Enthusiast',
      color: 'amber',
      description: 'For astronomy enthusiasts wanting to explore the universe.',
      headline: 'Uncover Mysterious Worlds',
      features: [
        'Learn astronomy at your pace',
        'Track space missions and events',
        'Join a community of stargazers',
        'Access expert explanations',
      ],
      ctaText: 'Begin Cosmic Journey',
      iconName: 'mdi:star',
    }),
  ])

  // Current active persona
  const activePersona = ref<Persona>(
    markRaw(
      personas.value[2] ?? {
        name: 'enthusiast',
        displayName: 'Enthusiast',
        description: 'For astronomy enthusiasts wanting to explore the universe.',
        color: 'amber',
        headline: 'Explore the Cosmos, Your Way',
        features: [
          'Learn astronomy at your pace',
          'Track space missions and events',
          'Join a community of stargazers',
          'Access expert explanations',
        ],
        ctaText: 'Begin Cosmic Journey',
        iconName: 'mdi:star',
      },
    ),
  )

  // Getters
  const getActivePersona = computed(() => activePersona.value)
  const getPersonas = computed(() => personas.value)

  // Dynamic getters for common properties
  const getActiveColor = computed(() => activePersona.value.color)
  const getActiveHeadline = computed(() => activePersona.value.headline)
  const getActiveCTA = computed(() => activePersona.value.ctaText)

  // Actions
  function setActivePersona(persona: Persona | string) {
    if (typeof persona === 'string') {
      // Find persona by name
      const found = personas.value.find((p) => p.name.toLowerCase() === persona.toLowerCase())
      if (found) {
        activePersona.value = found
      } else {
        console.error(`Persona "${persona}" not found`)
      }
    } else {
      // Direct persona object - use markRaw to prevent unnecessary reactivity
      activePersona.value = markRaw(persona)
    }

    // Track the selection with analytics
    if (import.meta.client) {
      try {
        const { trackUserAcquisition, UserAcquisitionMetric } = useAnalytics()
        trackUserAcquisition(UserAcquisitionMetric.SignUpConversion, {
          action: 'persona_selection',
          persona: activePersona.value.name,
        })
      } catch (error) {
        console.error('Error tracking persona selection:', error)
      }
    }

    // Return the active persona for chaining
    return activePersona.value
  }

  // Get persona by name
  function getPersonaByName(name: string): Persona | undefined {
    return personas.value.find((p) => p.name.toLowerCase() === name.toLowerCase())
  }

  // Utility for getting CSS classes based on the active persona
  function getPersonaClasses(
    element: 'bg' | 'text' | 'border' | 'hover' | 'gradient' = 'text',
  ): string {
    const color = activePersona.value.color

    switch (element) {
      case 'bg':
        return `bg-${color}-600`
      case 'text':
        return `text-${color}-500`
      case 'border':
        return `border-${color}-600/30`
      case 'hover':
        return `hover:bg-${color}-600/10 hover:text-${color}-500`
      case 'gradient':
        return `from-${color}-600 to-${color === 'blue' ? 'primary' : color}-500`
      default:
        return `text-${color}-500`
    }
  }

  return {
    // State
    personas,
    activePersona,

    // Getters
    getActivePersona,
    getPersonas,
    getActiveColor,
    getActiveHeadline,
    getActiveCTA,

    // Actions
    setActivePersona,
    getPersonaByName,
    getPersonaClasses,
  }
})
