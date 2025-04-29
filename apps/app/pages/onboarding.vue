<script setup lang="ts">
import { useOnboardingStore } from '@/stores/useOnboardingStore'
// Store and composables
const onboardingStore = useOnboardingStore()
const analytics = useOnboardingAnalytics()
const onboardingApi = useOnboardingApi()
const { currentStep, totalSteps, isComplete, progressPercentage, isProfessional, shouldSkipStep } =
  storeToRefs(onboardingStore)

// Handle navigation
const isNavigating = ref(false)

// Step names for analytics
const stepNames = {
  1: 'user_type',
  2: 'professional_details',
  3: 'interests',
  4: 'feature_interests',
  5: 'topics',
  6: 'location',
  7: 'confirmation',
}

// Initialize onboarding
onMounted(async () => {
  // Check if onboarding is already completed
  const { completed, userType } = await onboardingApi.checkOnboardingStatus()

  if (completed) {
    // Redirect to home/dashboard if onboarding is already completed
    navigateTo('/')
    return
  }

  // Initialize the store
  onboardingStore.initialize()

  // Track page view
  analytics.trackStepView(currentStep.value, stepNames[currentStep.value])
})

// Handle step completion
async function handleStepComplete(step: number, data: any) {
  try {
    // Save data to store
    onboardingStore.saveStepData(step, data)

    // Track completion
    analytics.trackStepComplete(step, stepNames[step], data)

    // Save to API
    await onboardingApi.saveStepData(step, data)

    // Move to next step
    isNavigating.value = true
    onboardingStore.nextStep()

    // Track view of next step
    setTimeout(() => {
      analytics.trackStepView(currentStep.value, stepNames[currentStep.value])
      isNavigating.value = false
    }, 300)
  } catch (error) {
    console.error(`Error completing step ${step}:`, error)
  }
}

// Handle onboarding completion
async function handleComplete(finalData: any) {
  try {
    // Complete onboarding
    const success = await onboardingStore.completeOnboarding()

    if (success) {
      // Track completion
      analytics.trackOnboardingComplete(onboardingStore.stepData)

      // Redirect to dashboard
      navigateTo('/')
    }
  } catch (error) {
    console.error('Error completing onboarding:', error)
  }
}

// Watch for user leaving the page
onBeforeRouteLeave((to, from, next) => {
  if (!isComplete.value) {
    // Track drop-off
    analytics.trackOnboardingDrop(currentStep.value, stepNames[currentStep.value])
  }
  next()
})

definePageMeta({
  title: 'Onboarding',
  layout: 'onboarding',
})
</script>

<template>
  <div class="onboarding-container max-w-4xl mx-auto px-4 py-8">
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
        <!-- Step 1: User Type -->
        <OnboardStepUserType
          v-if="currentStep === 1"
          @complete="handleStepComplete(1, $event)"
        />

        <!-- Step 2: Professional Details (Conditional) -->
        <OnboardStepProfessionalDetails
          v-if="currentStep === 2 && !shouldSkipStep(2)"
          @complete="handleStepComplete(2, $event)"
        />

        <!-- Step 3: Interests -->
        <OnboardStepInterests
          v-if="currentStep === 3"
          @complete="handleStepComplete(3, $event)"
        />

        <!-- Step 4: Feature Interests -->
        <OnboardStepFeatures
          v-if="currentStep === 4"
          @complete="handleStepComplete(4, $event)"
        />

        <!-- Step 5: Topics -->
        <OnboardStepTopics
          v-if="currentStep === 5"
          @complete="handleStepComplete(5, $event)"
        />

        <!-- Step 6: Location -->
        <OnboardStepLocation
          v-if="currentStep === 6"
          @complete="handleStepComplete(6, $event)"
        />

        <!-- Step 7: Confirmation -->
        <OnboardStepConfirmation
          v-if="currentStep === 7"
          @complete="handleComplete"
        />
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

      <PrimeButton
        v-if="currentStep < totalSteps"
        type="button"
        label="Skip"
        :disabled="currentStep === 1 || isNavigating"
        @click="onboardingStore.nextStep()"
      />
    </div>
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
