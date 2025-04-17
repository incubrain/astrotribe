// composables/usePersona.ts
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { usePersonaStore } from '~/stores/userPersonaStore'
import { useRoute } from '#imports'

// Default persona fallback
const defaultPersona = {
  name: 'enthusiast',
  color: 'amber',
  description: 'For astronomy enthusiasts wanting to explore the universe.',
  headline: 'Explore the Cosmos, Your Way',
  features: [
    'Learn astronomy at your pace',
    'Track space missions and events',
    'Join a community of stargazers',
    'Access expert explanations',
  ],
  ctaText: 'Begin Cosmic Journey',
  iconName: 'mdi:star',
}

export function usePersona() {
  const store = usePersonaStore()
  const route = useRoute()
  const isMounted = ref(false)

  // Use storeToRefs for reactive state
  const { activePersona: storeActivePersona, personas: storePersonas } = storeToRefs(store)

  // Safe computed properties with fallbacks
  const activePersona = computed(() => {
    try {
      return storeActivePersona.value || defaultPersona
    } catch (error) {
      console.error('Error accessing active persona:', error)
      return defaultPersona
    }
  })

  const personas = computed(() => {
    try {
      return storePersonas.value || []
    } catch (error) {
      console.error('Error accessing personas:', error)
      return []
    }
  })

  // Persona type helpers with fallbacks
  const isResearcher = computed(() => activePersona.value?.name?.toLowerCase() === 'researcher')
  const isCommunicator = computed(() => activePersona.value?.name?.toLowerCase() === 'communicator')
  const isEnthusiast = computed(() => activePersona.value?.name?.toLowerCase() === 'enthusiast')

  // Utility function for getting persona-based background styles
  const getBackgroundStyle = computed(() => {
    try {
      const color = activePersona.value?.color || 'gray'
      const backgroundStyles: Record<string, { background: string; backgroundBlendMode: string }> =
        {
          researcher: {
            background:
              'radial-gradient(circle at 70% 30%, rgba(37, 99, 235, 0.15), transparent 60%)',
            backgroundBlendMode: 'multiply',
          },
          communicator: {
            background:
              'radial-gradient(circle at 30% 40%, rgba(5, 150, 105, 0.15), transparent 60%)',
            backgroundBlendMode: 'multiply',
          },
          enthusiast: {
            background:
              'radial-gradient(circle at 50% 20%, rgba(217, 119, 6, 0.15), transparent 60%)',
            backgroundBlendMode: 'multiply',
          },
        }
      const name = activePersona.value?.name?.toLowerCase() || ''
      return backgroundStyles[name] || {}
    } catch (error) {
      console.error('Error getting background style:', error)
      return {}
    }
  })

  // Semantic utility functions for component styling
  const personaStyles = computed(() => {
    try {
      const color = activePersona.value?.color || 'gray'
      return {
        primaryButton: `bg-gradient-to-r from-${color}-600 to-${color === 'blue' ? 'primary' : color}-500 hover:from-${color}-500 hover:to-${color === 'blue' ? 'primary' : color}-400 text-white`,
        secondaryButton: `border border-${color}-600/30 text-${color}-500 hover:bg-${color}-600/10`,
        sectionHeading: `bg-gradient-to-r from-${color}-500 to-${color === 'blue' ? 'primary' : color}-600 bg-clip-text text-transparent`,
        cardBorder: `border-${color}-800/30 hover:border-${color}-700/50`,
        icon: `text-${color}-500`,
        highlight: `bg-${color}-900/20 text-${color}-400`,
        badge: `bg-${color}-900/30 text-${color}-400 border border-${color}-800/30`,
      }
    } catch (error) {
      console.error('Error getting persona styles:', error)
      return {}
    }
  })

  // Watch for persona changes and save to cookie
  watch(
    () => activePersona.value,
    (newPersona) => {
      if (isMounted.value && newPersona?.name && import.meta.client) {
        document.cookie = `astronera_persona=${newPersona.name}; path=/; max-age=2592000; SameSite=Lax`
      }
    },
    { deep: false },
  )

  // Initialize persona based on URL query param if present
  onMounted(() => {
    let initialPersonaSet = false

    // 1. Check URL query param first
    const queryPersonaName = route.query.persona
    if (queryPersonaName && typeof queryPersonaName === 'string') {
      const persona = store.getPersonaByName(queryPersonaName)
      if (persona && persona.name !== activePersona.value.name) {
        store.setActivePersona(persona)
        initialPersonaSet = true
      }
    }

    // 2. If no query param set it, try loading from cookie
    if (!initialPersonaSet && import.meta.client) {
      const cookies = document.cookie.split(';')
      const personaCookie = cookies.find((c) => c.trim().startsWith('astronera_persona='))

      if (personaCookie) {
        const cookiePersonaName = personaCookie.split('=')[1]?.trim() ?? ''
        if (cookiePersonaName) {
          const persona = store.getPersonaByName(cookiePersonaName)
          if (persona && persona.name !== activePersona.value.name) {
            store.setActivePersona(persona)
            initialPersonaSet = true
          }
        }
      }
    }

    isMounted.value = true
  })

  return {
    // Store refs
    activePersona,
    personas,

    // Store actions
    setActivePersona: store.setActivePersona,
    getPersonaByName: store.getPersonaByName,

    // Computed properties
    getBackgroundStyle,
    personaStyles,

    // Type helpers
    isResearcher,
    isCommunicator,
    isEnthusiast,
  }
}
