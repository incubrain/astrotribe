<script setup lang="ts">
import { useOnboardingStore } from '@/stores/useOnboardingStore'

const onboardingStore = useOnboardingStore()
const onboardingApi = useOnboardingApi()
const analytics = useOnboardingAnalytics()
const form = useOnboardingForm()

const {
  currentStep,
  stepData,
  isComplete,
  currentStepLabel,
  currentStepKey,
  effectiveStepCount,
  activeSteps,
} = storeToRefs(onboardingStore)

const isNavigating = ref(false)

onMounted(async () => {
  const { completed } = await onboardingApi.checkOnboardingStatus()

  if (completed) {
    navigateTo('/')
    return
  }

  onboardingStore.initialize()
  analytics.trackStepView(currentStep.value, currentStepKey.value)
})

const handleStepComplete = async (step: number, stepData: any) => {
  try {
    // Save data for current step
    const stepName = activeSteps.value[step - 1]
    console.log(`Completing step ${step}: ${stepName}`, stepData)

    // Update state in store
    onboardingStore.saveStepData(step, stepData)

    // Save to API
    const api = await $fetch('/api/onboard/step', {
      method: 'POST',
      body: {
        step,
        data: stepData,
      },
    })

    // If API call is successful, move to next step
    onboardingStore.nextStep()
    return true
  } catch (error) {
    console.error(`Error saving step ${step}:`, error)
    return false
  }
}

const handleComplete = async (finalData: any) => {
  try {
    // Submit final data
    console.log('Completing onboarding with final data:', finalData)
    const result = await $fetch('/api/onboard/complete', {
      method: 'POST',
      body: finalData,
    })

    console.log('Onboarding completion result:')

    if (result.success) {
      // Mark as complete and redirect
      onboardingStore.isComplete = true
      navigateTo('/')
    }

    return true
  } catch (error) {
    console.error('Error completing onboarding:', error)
    return false
  }
}

onBeforeRouteLeave((to, from, next) => {
  if (!isComplete.value) {
    analytics.trackOnboardingDrop(currentStep.value, currentStepKey.value)
  }

  next()
})

const handleFormSubmit = async (e: any) => {
  if (!e.valid) return

  const stepNum = currentStep.value
  const key = currentStepKey.value

  const currentState = form.getFieldState(key)?.value
  if (!currentState) {
    console.warn(`No form state for step key: ${key}`)
  }

  console.log('[Submit]', { stepNum, key, currentState })

  if (key === 'confirmation') {
    await handleComplete({ ...currentState })
  } else {
    await handleStepComplete(stepNum, currentState)
  }
}

const currentStepComponent = computed(() => {
  const stepLabel = activeSteps.value[currentStep.value - 1]
  const stepEntry = onboardingSteps.find((s) => s.label === stepLabel)
  return stepEntry?.component ? defineAsyncComponent(stepEntry.component) : null
})

definePageMeta({
  title: 'Onboarding',
  layout: 'onboarding',
})
</script>

<template>
  <div class="onboarding-container max-w-4xl mx-auto px-4 py-8">
    <PrimeForm
      :form-control="form"
      @submit="handleFormSubmit"
    >
      <!-- Transition between steps -->
      <Transition
        name="slide-fade"
        mode="out-in"
      >
        <div
          :key="currentStep"
          class="onboarding-step bg-gray-900/50 rounded-lg p-6 shadow-lg border border-gray-800"
          :class="{ 'pointer-events-none': isNavigating }"
        >
          <component :is="currentStepComponent" />
        </div>
      </Transition>

      <!-- Navigation Buttons -->
      <div class="flex justify-between mt-8">
        <PrimeButton
          v-if="currentStep > 1"
          type="button"
          text
          label="Back"
          icon="mdi:arrow-left"
          :disabled="isNavigating"
          @click="onboardingStore.prevStep()"
        />

        <div v-else></div>

        <div class="flex justify-end gap-8">
          <PrimeButton
            v-if="currentStep < effectiveStepCount"
            type="button"
            label="Skip"
            :disabled="currentStep === 1 || isNavigating"
            @click="onboardingStore.nextStep()"
          />
          <PrimeButton
            type="submit"
            label="Continue"
            icon="mdi:arrow-right"
            icon-pos="right"
            :disabled="!form.valid"
          />
        </div>
      </div>
    </PrimeForm>
  </div>
</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
