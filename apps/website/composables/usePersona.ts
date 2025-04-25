// composables/usePersona.ts
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
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

  // Initialize persona based on URL query param or cookie
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

  // Dynamic color configuration
  const colorConfig = computed(() => {
    const name = personaStore.activePersona?.name?.toLowerCase()
    return (
      {
        'researcher': {
          primary: 'blue-900',
          secondary: 'blue-800',
          accent: 'primary-600',
          gradient: 'radial-gradient(circle at 70% 30%, rgba(29, 78, 216, 0.1), transparent 60%)',
        },
        'sci-commer': {
          primary: 'emerald-900',
          secondary: 'emerald-800',
          accent: 'emerald-600',
          gradient: 'radial-gradient(circle at 30% 40%, rgba(4, 120, 87, 0.1), transparent 60%)',
        },
        'enthusiast': {
          primary: 'amber-900',
          secondary: 'amber-800',
          accent: 'amber-600',
          gradient: 'radial-gradient(circle at 50% 20%, rgba(180, 83, 9, 0.1), transparent 60%)',
        },
      }[name] || {
        primary: 'blue-900',
        secondary: 'blue-800',
        accent: 'primary-600',
        gradient: 'radial-gradient(circle at 50% 50%, rgba(29, 78, 216, 0.1), transparent 60%)',
      }
    )
  })

  // Ensure activePersona.displayName is in Pascal Case
  const activePersona = computed(() => {
    const persona = personaStore.activePersona
    return persona
  })

  // Utility function for getting persona-based background styles
  const getBackgroundStyle = computed(() => ({
    background: colorConfig.value.gradient,
    backgroundBlendMode: 'multiply',
  }))

  // Semantic utility functions for component styling
  const personaStyles = computed(() => ({
    primaryButton: `bg-gradient-to-r from-${colorConfig.value.primary} to-${colorConfig.value.accent} hover:from-${colorConfig.value.secondary} hover:to-${colorConfig.value.accent} text-white`,
    secondaryButton: `border border-${colorConfig.value.secondary}/30 text-${colorConfig.value.accent} hover:bg-${colorConfig.value.primary}/10`,
    sectionHeading: `bg-gradient-to-r from-${colorConfig.value.accent} to-${colorConfig.value.primary} bg-clip-text text-transparent`,
    cardBorder: `border-${colorConfig.value.secondary}/30 hover:border-${colorConfig.value.accent}/50`,
    icon: `text-${colorConfig.value.accent}`,
    highlight: `bg-${colorConfig.value.primary}/20 text-${colorConfig.value.accent}`,
    badge: `bg-${colorConfig.value.primary}/30 text-${colorConfig.value.accent} border border-${colorConfig.value.secondary}/30`,
  }))

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
