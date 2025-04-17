// composables/usePersona.ts
import { computed, onMounted, ref } from 'vue'
import { usePersonaStore } from '~/stores/usePersonaStore'

export function usePersona() {
  const personaStore = usePersonaStore()
  const route = useRoute()
  const isMounted = ref(false)

  // Watch for persona changes and save to cookie
  watch(
    () => personaStore.activePersona,
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
      const persona = personaStore.getPersonaByName(queryPersonaName)
      if (persona && persona.name !== personaStore.activePersona.name) {
        personaStore.setActivePersona(persona)
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
          const persona = personaStore.getPersonaByName(cookiePersonaName)
          if (persona && persona.name !== personaStore.activePersona.name) {
            personaStore.setActivePersona(persona)
            initialPersonaSet = true
          }
        }
      }
    }

    isMounted.value = true
  })

  // Ensure activePersona.name is always lowercase for consistent usage
  const activePersona = computed(() => {
    const persona = personaStore.activePersona
    if (persona && persona.name) {
      persona.name = persona.name.toLowerCase()
    }
    return persona
  })

  // Utility function for getting persona-based background styles
  const getBackgroundStyle = computed(() => {
    const color = personaStore.activePersona.color
    const backgroundStyles: Record<string, { background: string; backgroundBlendMode: string }> = {
      'researcher': {
        background: 'radial-gradient(circle at 70% 30%, rgba(37, 99, 235, 0.15), transparent 60%)',
        backgroundBlendMode: 'multiply',
      },
      'sci-commer': {
        background: 'radial-gradient(circle at 30% 40%, rgba(5, 150, 105, 0.15), transparent 60%)',
        backgroundBlendMode: 'multiply',
      },
      'enthusiast': {
        background: 'radial-gradient(circle at 50% 20%, rgba(217, 119, 6, 0.15), transparent 60%)',
        backgroundBlendMode: 'multiply',
      },
    }
    const name = personaStore.activePersona?.name?.toLowerCase?.()
    return backgroundStyles[name] || {}
  })

  // Semantic utility functions for component styling
  const personaStyles = computed(() => {
    const color = personaStore.activePersona.color
    return {
      primaryButton: `bg-gradient-to-r from-${color}-600 to-${color === 'blue' ? 'primary' : color}-500 hover:from-${color}-500 hover:to-${color === 'blue' ? 'primary' : color}-400 text-white`,
      secondaryButton: `border border-${color}-600/30 text-${color}-500 hover:bg-${color}-600/10`,
      sectionHeading: `bg-gradient-to-r from-${color}-500 to-${color === 'blue' ? 'primary' : color}-600 bg-clip-text text-transparent`,
      cardBorder: `border-${color}-800/30 hover:border-${color}-700/50`,
      icon: `text-${color}-500`,
      highlight: `bg-${color}-900/20 text-${color}-400`,
      badge: `bg-${color}-900/30 text-${color}-400 border border-${color}-800/30`,
    }
  })

  // Persona type helpers
  const isResearcher = computed(() => activePersona.value?.name?.toLowerCase() === 'researcher')
  const isCommunicator = computed(() => activePersona.value?.name?.toLowerCase() === 'sci-commer')
  const isEnthusiast = computed(() => activePersona.value?.name?.toLowerCase() === 'enthusiast')

  return {
    // Store access
    personas: computed(() => personaStore.personas),
    activePersona,
    setActivePersona: personaStore.setActivePersona,
    getPersonaByName: personaStore.getPersonaByName,

    // Computed helpers
    getBackgroundStyle,
    personaStyles,

    // Persona type helpers
    isResearcher,
    isCommunicator,
    isEnthusiast,
  }
}
