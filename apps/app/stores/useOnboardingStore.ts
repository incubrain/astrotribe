// stores/useOnboardingStore.ts
import { defineStore } from 'pinia'
import { z } from 'zod'
import {
  onboardingSteps,
  formStepKeys,
  onboardingSchemaShape,
  type OnboardingStepKey,
} from '@/composables/onboard/onboard-steps'

type StepKey = Omit<OnboardingStepKey, 'confirmation'>

const stepData = reactive(
  Object.fromEntries(
    Object.entries(onboardingSchemaShape).map(([key, schema]) => {
      const def = schema._def
      if ('defaultValue' in def) {
        return [key, def.defaultValue()]
      }

      if (schema instanceof z.ZodNullable) {
        return [key, null]
      }

      if (schema instanceof z.ZodArray) {
        return [key, []]
      }

      if (schema instanceof z.ZodObject || schema instanceof z.ZodRecord) {
        return [key, {}]
      }

      return [key, undefined]
    }),
  ) as OnboardingSchema,
)

const stepKeys = Object.keys(stepData)

export const useOnboardingStore = defineStore('onboarding', () => {
  const currentStep = ref(1)
  const isComplete = ref(false)
  const isLoading = ref(false)
  const error = ref(null)

  const isProfessional = computed(() => stepData.user_type === 'professional')

  const allSteps = onboardingSteps.map((s) => s.label)

  const activeSteps = computed(() => onboardingSteps.map((s) => s.label))

  const effectiveStepCount = computed(() => activeSteps.value.length)

  const currentStepLabel = computed(() => activeSteps.value[currentStep.value - 1]!)
  const currentStepKey = computed(() => formStepKeys[currentStep.value - 1] as OnboardingStepKey)

  const visibleStep = computed(() => {
    const key = currentStepKey.value
    if (!key) return 0
    return formStepKeys.findIndex((k) => k === key) + 1
  })

  const progressPercentage = computed(() => {
    if (effectiveStepCount.value === 0 || visibleStep.value === 0) return 0
    return Math.min(100, Math.round((visibleStep.value / effectiveStepCount.value) * 100))
  })

  function saveStepData(step: number, data: any) {
    const key = formStepKeys[step - 1] as OnboardingStepKey

    console.group(`[saveStepData] Step ${step}: ${key}`)
    console.log('Incoming Data:', data)

    if (key !== 'confirmation') {
      console.log('Before:', structuredClone(toRaw(stepData[key])))
      if (typeof stepData[key] === 'object' && stepData[key] !== null) {
        Object.assign(stepData[key], data)
      } else {
        stepData[key] = data
      }
      console.log('After:', structuredClone(toRaw(stepData[key])))
    }

    console.groupEnd()

    saveStateToLocalStorage()
  }

  // city "Pune"
  // country "India"
  // country_code "in"
  // latitude 18.5681753
  // longitude 73.8507787
  // place_name "Khadki, Pune, Pune District, Maharashtra, 411003, India"
  // postcode "411003"
  // state "Maharashtra"
  // street1 ""
  // street2 ""

  function nextStep() {
    const next = currentStep.value + 1
    if (visibleStep.value < activeSteps.value.length) {
      currentStep.value = next
    }
  }

  function prevStep() {
    const prev = currentStep.value - 1
    if (prev >= 1) currentStep.value = prev
  }

  function goToStep(step: number) {
    if (step >= 1 && step <= allSteps.length) {
      currentStep.value = step
    }
  }

  function saveStateToLocalStorage() {
    try {
      localStorage.setItem(
        'onboarding_state',
        JSON.stringify({
          currentStep: currentStep.value,
          stepData: toRaw(stepData),
        }),
      )
    } catch (e) {
      console.error('Failed to save onboarding state', e)
    }
  }

  function resetState() {
    currentStep.value = 1
    isComplete.value = false
    error.value = null

    for (const key of Object.keys(stepData)) {
      const typedKey = key as keyof typeof stepData
      if (Array.isArray(stepData[typedKey])) {
        stepData[typedKey] = [] as any
      } else if (typeof stepData[typedKey] === 'object') {
        stepData[typedKey] = {} as any
      } else {
        stepData[typedKey] = null as any
      }
    }

    localStorage.removeItem('onboarding_state')
  }

  function initialize() {
    try {
      const savedState = localStorage.getItem('onboarding_state')
      if (!savedState) return

      const parsed = JSON.parse(savedState)

      if (parsed.stepData && typeof parsed.stepData === 'object') {
        for (const key of Object.keys(stepData)) {
          if (key in parsed.stepData) {
            // @ts-expect-error: Type mismatch between saved state and stepData structure
            stepData[key] = parsed.stepData[key]
          }
        }
      }

      if (typeof parsed.currentStep === 'number' && parsed.currentStep > 0) {
        currentStep.value = parsed.currentStep
      }
    } catch (e) {
      console.error('Failed to load onboarding state from localStorage', e)
    }
  }

  watch(
    () => stepData,
    (newVal) => {
      console.log('[Store] stepData updated:', toRaw(newVal))
    },
    { deep: true, immediate: true },
  )

  return {
    currentStep,
    currentStepLabel,
    currentStepKey,
    isComplete,
    isLoading,
    error,
    stepData,
    isProfessional,
    activeSteps,
    visibleStep,
    effectiveStepCount,
    progressPercentage,
    nextStep,
    prevStep,
    goToStep,
    saveStepData,
    resetState,
    initialize,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useOnboardingStore, import.meta.hot))
}
