// stores/onboardingStore.ts
import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'

export const useOnboardingStore = defineStore('onboarding', () => {
  // Core state
  const currentStep = ref(1)
  const totalSteps = ref(7)
  const isComplete = ref(false)
  const isLoading = ref(false)
  const error = ref(null)

  // Step data
  const stepData = reactive({
    userType: null as string | null,
    professionalDetails: {} as Record<string, any>,
    interests: [] as string[],
    featureInterests: [] as string[],
    topics: [] as string[],
    location: {} as Record<string, any>,
  })

  // Helper computed properties
  const isProfessional = computed(() => stepData.userType === 'professional')

  // Calculate effective step count (accounting for conditional steps)
  const effectiveStepCount = computed(() => {
    return isProfessional.value ? totalSteps.value : totalSteps.value - 1
  })

  // Progress percentage for UI display
  const progressPercentage = computed(() => {
    return Math.min(100, Math.round((currentStep.value / effectiveStepCount.value) * 100))
  })

  // Check if a step should be skipped
  function shouldSkipStep(step: number): boolean {
    // Skip professional details step if not a professional
    return step === 2 && !isProfessional.value
  }

  // Actions
  function saveStepData(step: number, data: any) {
    const stepToDataMap = {
      1: 'userType',
      2: 'professionalDetails',
      3: 'interests',
      4: 'featureInterests',
      5: 'topics',
      6: 'location',
    } as Record<number, keyof typeof stepData>

    const propertyName = stepToDataMap[step]
    if (propertyName) {
      stepData[propertyName] = data
    }

    // Auto-save to localStorage for persistence
    saveStateToLocalStorage()
  }

  function nextStep() {
    let nextStepNumber = currentStep.value + 1

    // Skip steps if needed
    while (shouldSkipStep(nextStepNumber) && nextStepNumber <= totalSteps.value) {
      nextStepNumber++
    }

    currentStep.value = nextStepNumber
  }

  function prevStep() {
    let prevStepNumber = currentStep.value - 1

    // Skip steps if needed when going backwards
    while (shouldSkipStep(prevStepNumber) && prevStepNumber >= 1) {
      prevStepNumber--
    }

    currentStep.value = prevStepNumber
  }

  function goToStep(step: number) {
    if (step >= 1 && step <= totalSteps.value) {
      currentStep.value = step
    }
  }

  // Local storage persistence
  function saveStateToLocalStorage() {
    try {
      localStorage.setItem(
        'onboarding_state',
        JSON.stringify({
          currentStep: currentStep.value,
          stepData,
        }),
      )
    } catch (e) {
      console.error('Failed to save onboarding state to localStorage', e)
    }
  }

  function loadStateFromLocalStorage() {
    try {
      const savedState = localStorage.getItem('onboarding_state')
      if (savedState) {
        const parsed = JSON.parse(savedState)

        // Restore step data
        Object.assign(stepData, parsed.stepData || {})

        // Restore current step, but don't go backwards
        if (parsed.currentStep > currentStep.value) {
          currentStep.value = parsed.currentStep
        }
      }
    } catch (e) {
      console.error('Failed to load onboarding state from localStorage', e)
    }
  }

  // Reset the state (for debugging or restarting)
  function resetState() {
    currentStep.value = 1
    isComplete.value = false
    error.value = null

    // Reset all step data
    Object.keys(stepData).forEach((key) => {
      const typedKey = key as keyof typeof stepData
      if (Array.isArray(stepData[typedKey])) {
        stepData[typedKey] = [] as any
      } else if (typeof stepData[typedKey] === 'object') {
        stepData[typedKey] = {} as any
      } else {
        stepData[typedKey] = null as any
      }
    })

    // Clear localStorage
    localStorage.removeItem('onboarding_state')
  }

  // API interactions
  async function checkOnboardingStatus() {
    try {
      isLoading.value = true
      error.value = null

      const { data } = await useFetch('/api/onboard/status')
      const completed = data.value?.completed || false

      isComplete.value = completed
      return completed
    } catch (err: any) {
      console.error('Failed to check onboarding status', err)
      error.value = err.message || 'Failed to check onboarding status'
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function completeOnboarding() {
    try {
      isLoading.value = true
      error.value = null

      // Call API to save all onboarding data
      await $fetch('/api/onboard/complete', {
        method: 'POST',
        body: {
          ...stepData,
          completed: true,
        },
      })

      isComplete.value = true

      // Clear localStorage since onboarding is complete
      localStorage.removeItem('onboarding_state')

      return true
    } catch (err: any) {
      console.error('Failed to complete onboarding', err)
      error.value = err.message || 'Failed to complete onboarding'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Initialize - load any saved state
  function initialize() {
    loadStateFromLocalStorage()
  }

  return {
    // State
    currentStep,
    totalSteps,
    effectiveStepCount,
    isComplete,
    isLoading,
    error,
    progressPercentage,

    // Data
    stepData,
    isProfessional,

    // Actions
    saveStepData,
    nextStep,
    prevStep,
    goToStep,
    resetState,
    initialize,
    checkOnboardingStatus,
    completeOnboarding,
    shouldSkipStep,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useOnboardingStore, import.meta.hot))
}
