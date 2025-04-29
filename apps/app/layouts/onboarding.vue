<script setup lang="ts">
import { useOnboardingStore } from '@/stores/useOnboardingStore'

// Core layout elements
const appName = useRuntimeConfig().public.appName || 'AstronEra'
const onboardingStore = useOnboardingStore()
const { currentStep, totalSteps, isProfessional } = storeToRefs(onboardingStore)

// Compute effective total steps (accounting for conditional steps)
const effectiveStepCount = computed(() => {
  return isProfessional.value ? totalSteps.value : totalSteps.value - 1
})

// Compute step progress for the logo animation
const progressPercentage = computed(() => {
  return Math.min(100, Math.round((currentStep.value / effectiveStepCount.value) * 100))
})

// Handle brand click - show tooltip asking to complete onboarding
const showBrandTooltip = ref(false)
const handleBrandClick = () => {
  showBrandTooltip.value = true
  setTimeout(() => {
    showBrandTooltip.value = false
  }, 3000)
}

const NAV_HEIGHT = '64px' // Example height of the navigation bar
</script>

<template>
  <div
    class="onboarding-layout min-h-screen flex flex-col relative bg-gradient-to-b from-gray-900 to-black"
  >
    <!-- App Header (Simplified) -->
    <header
      class="py-4 px-6 flex justify-between items-center border-b border-gray-800"
      :style="{ height: NAV_HEIGHT }"
    >
      <!-- Logo/Brand -->
      <div
        class="flex items-center cursor-pointer relative"
        @click="handleBrandClick"
      >
        <div
          v-tooltip="{
            value: 'Please complete onboarding to continue',
            pt: {
              root: '!text-nowrap w-full',
              text: '!font-medium ',
            },
          }"
          class="relative flex items-center"
        >
          <!-- Logo with circular progress indication -->
          <div
            class="w-10 h-10 rounded-full border-2 border-gray-700 flex items-center justify-center overflow-hidden bg-black"
          >
            <div
              class="w-20 h-20 rounded-full flex justify-center items-center overflow-hidden p-1 bg-white"
            >
              <NuxtImg
                src="astronera-logo.jpg"
                alt="App Logo"
              />
            </div>

            <!-- Circular progress indicator -->
            <svg
              class="absolute top-0 left-0 w-full h-full"
              viewBox="0 0 36 36"
            >
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="rgba(var(--primary-500), 0.2)"
                stroke-width="2"
                stroke-dasharray="100, 100"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="rgb(var(--primary-500))"
                stroke-width="2"
                :stroke-dasharray="`${progressPercentage}, 100`"
                class="transition-all duration-700 ease-in-out"
              />
            </svg>
          </div>

          <!-- Brand Name -->
          <div class="ml-3 font-bold text-xl">{{ appName }}</div>
        </div>
      </div>

      <!-- Current step indicator (visible on mobile) -->
      <div class="md:hidden bg-gray-800 px-3 py-1 rounded-full text-sm">
        Step {{ currentStep }} of {{ effectiveStepCount }}
      </div>

      <!-- Exit to Support Link -->
      <a
        href="https://support.astronera.com"
        target="_blank"
        class="text-gray-400 hover:text-white text-sm flex items-center gap-1"
      >
        <Icon
          name="tabler:help-circle"
          size="18px"
        />
        <span class="hidden sm:inline">Need Help?</span>
      </a>
    </header>

    <!-- Main Content Area -->
    <main class="flex-grow flex overflow-hidden">
      <!-- Left Panel (Hidden on Mobile) -->
      <div class="hidden lg:flex w-64 border-r border-gray-800 flex-col p-6 bg-black/30">
        <h2 class="text-xl font-semibold mb-6">Welcome to {{ appName }}</h2>

        <!-- Onboarding Steps List -->
        <div class="space-y-4">
          <div
            v-for="step in effectiveStepCount"
            :key="step"
            class="flex items-center gap-3"
            :class="{
              'text-white': step === currentStep,
              'text-gray-400': step !== currentStep,
              'opacity-50': step > currentStep,
            }"
          >
            <!-- Step number circle -->
            <div
              class="w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium"
              :class="{
                'bg-primary-500 text-white': step === currentStep,
                'bg-gray-800': step !== currentStep && step < currentStep,
                'border border-gray-700': step > currentStep,
              }"
            >
              <Icon
                v-if="step < currentStep"
                name="tabler:check"
                size="16px"
              />
              <span v-else>{{ step }}</span>
            </div>

            <!-- Step name -->
            <span class="text-sm">
              <template v-if="step === 1">User Type</template>
              <template v-else-if="step === 2 && isProfessional">Professional Details</template>
              <template v-else-if="step === 2 && !isProfessional">Interests</template>
              <template v-else-if="step === 3 && isProfessional">Interests</template>
              <template v-else-if="step === 3 && !isProfessional">Feature Interests</template>
              <template v-else-if="step === 4 && isProfessional">Feature Interests</template>
              <template v-else-if="step === 4 && !isProfessional">Topics</template>
              <template v-else-if="step === 5 && isProfessional">Topics</template>
              <template v-else-if="step === 5 && !isProfessional">Location</template>
              <template v-else-if="step === 6 && isProfessional">Location</template>
              <template v-else-if="step === 6 && !isProfessional">Confirmation</template>
              <template v-else-if="step === 7">Confirmation</template>
            </span>
          </div>
        </div>

        <!-- Onboarding Info -->
        <div class="mt-auto">
          <div class="bg-primary-900/30 p-4 rounded-lg border border-primary-800">
            <h3 class="font-medium text-primary-400 mb-2">Complete Your Profile</h3>
            <p class="text-sm text-gray-300"
              >Setting up your profile helps us personalize your experience and connect you with
              relevant content.</p
            >
          </div>
        </div>
      </div>

      <!-- Main Onboarding Content Area -->
      <div
        class="flex-grow overflow-scroll p-4 md:p-8"
        :style="{ height: `calc(100vh - ${NAV_HEIGHT})` }"
      >
        <div class="max-w-4xl mx-auto">
          <slot />
        </div>
      </div>

      <!-- Right Space Image (Hidden on Mobile/Tablet) -->
      <div
        class="hidden xl:block w-72 border-l border-gray-800 bg-cover bg-center"
        style="background-image: url('/images/space-bg.jpg')"
      >
        <div
          class="h-full bg-black/60 backdrop-blur-sm p-6 flex flex-col items-center justify-center"
        >
          <div class="w-32 h-32 rounded-full overflow-hidden p-4 bg-white mb-6">
            <NuxtImg
              src="astronera-logo.jpg"
              alt="App Logo"
              class="w-full h-full object-cover"
            />
          </div>

          <h3 class="text-lg font-semibold text-center mb-2">Explore the Universe</h3>
          <p class="text-sm text-gray-300 text-center">
            Complete your onboarding to unlock the full experience and start your journey among the
            stars.
          </p>

          <!-- Current Progress -->
          <div class="mt-6 w-full">
            <div class="text-xs text-gray-400 flex justify-between mb-1">
              <span>Progress</span>
              <span>{{ progressPercentage }}%</span>
            </div>
            <PrimeProgressBar
              :value="progressPercentage"
              class="h-1"
            />
          </div>
        </div>
      </div>
    </main>

    <!-- Optional Footer (for copyright, privacy links, etc.) -->
    <footer class="py-3 px-6 border-t border-gray-800 text-xs text-gray-500 text-center">
      <p
        >© {{ new Date().getFullYear() }} {{ appName }} •
        <a
          href="/privacy"
          class="hover:text-gray-300"
          >Privacy Policy</a
        >
        •
        <a
          href="/terms"
          class="hover:text-gray-300"
          >Terms of Service</a
        ></p
      >
    </footer>
  </div>
</template>

<style scoped>
/* You can add any custom animations or transitions here */
</style>
