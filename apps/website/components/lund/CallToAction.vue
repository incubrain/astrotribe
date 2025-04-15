<script setup lang="ts">
import { ref, onMounted } from 'vue'

const { conf: motionConstants } = useAnimation()
const { trackUserEngagement, UserEngagementMetric } = useAnalytics()

// CTA button hover state
const isHovered = ref(false)

// Form data
const email = ref('')
const isSubmitting = ref(false)
const isSubmitted = ref(false)
const submitError = ref(null)

// Handle newsletter submission
const handleSubmit = async () => {
  if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    submitError.value = 'Please enter a valid email address'
    return
  }

  isSubmitting.value = true
  submitError.value = null

  try {
    // In a real implementation, this would call an API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Track successful signup
    trackUserEngagement(UserEngagementMetric.FeatureAdoption, {
      feature: 'newsletter_subscription',
      source: 'cta_section',
    })

    // Handle success
    isSubmitting.value = false
    isSubmitted.value = true
    email.value = ''

    // Reset after a few seconds
    setTimeout(() => {
      isSubmitted.value = false
    }, 5000)
  } catch (error) {
    // Handle error
    isSubmitting.value = false
    submitError.value = 'Failed to subscribe. Please try again.'
    console.error('Newsletter subscription error:', error)
  }
}

// Track CTA clicks
const trackCTAClick = (ctaType) => {
  trackUserEngagement(UserEngagementMetric.ActionsPerSession, {
    action: 'cta_click',
    cta_type: ctaType,
  })
}

// Initialize animated stars
const { stars, isClient, shootingStars } = useStarfield(30, 3)
</script>

<template>
  <section
    id="cosmic-cta"
    class="py-20 md:py-28 relative overflow-hidden"
  >
    <!-- Background with gradient -->
    <div class="absolute inset-0 bg-gradient-to-b from-primary-900/90 to-slate-950 z-0"></div>

    <!-- Animated stars -->
    <ClientOnly>
      <div
        v-if="isClient"
        class="absolute inset-0 z-0"
      >
        <div
          v-for="star in stars"
          :key="star.id"
          class="absolute rounded-full bg-white"
          :style="star.style"
        />

        <!-- Shooting stars -->
        <div
          v-for="shoot in shootingStars"
          :key="'shooting-' + shoot.id"
          class="shooting-star absolute w-[150px] h-px bg-white transform rotate-45 overflow-hidden"
          :style="shoot.style"
        ></div>
      </div>
    </ClientOnly>

    <!-- Glowing orbs -->
    <div class="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl"></div>
    <div class="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>

    <div class="wrapper relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-12 items-center">
        <!-- Jupiter visualization -->
        <div
          v-motion
          :initial="{ opacity: 0, scale: 0.9 }"
          :visibleOnce="{
            opacity: 1,
            scale: 1,
            transition: { type: 'spring', stiffness: 150, damping: 15 },
          }"
          class="md:col-span-2 flex justify-center"
        >
          <div
            class="relative w-full max-w-sm aspect-square rounded-full overflow-hidden bg-primary-900/30 border border-primary-600/20 shadow-2xl shadow-primary-600/20"
          >
            <PlanetModel
              planet-id="jupiter"
              :auto-rotate="true"
            />
          </div>
        </div>

        <!-- CTA content -->
        <div
          v-motion
          :initial="motionConstants.fadeUp.initial"
          :visibleOnce="motionConstants.fadeUp.enter"
          class="md:col-span-3 space-y-8"
        >
          <div class="space-y-4">
            <h2 class="text-4xl md:text-6xl font-bold text-white leading-tight">
              Ready to Explore
              <span
                class="bg-gradient-to-r from-blue-500 to-primary-600 bg-clip-text text-transparent"
                >the Cosmos?</span
              >
            </h2>
            <p class="text-xl text-gray-300">
              Join thousands of researchers, educators, and astronomy enthusiasts using AstronEra to
              unlock the secrets of the universe.
            </p>
          </div>

          <!-- CTA buttons -->
          <div
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :visibleOnce="{
              opacity: 1,
              y: 0,
              transition: { delay: 0.3 },
            }"
            class="flex flex-col sm:flex-row gap-4"
          >
            <PrimeButton
              size="large"
              class="bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-500 hover:to-blue-500 transition-all duration-300 text-lg px-8 shadow-lg shadow-primary-900/30 border-none"
              @click="trackCTAClick('explore_free')"
            >
              Explore The Universe for FREE
              <Icon
                name="mdi:rocket-launch"
                class="ml-2"
                size="20"
              />
            </PrimeButton>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.shooting-star::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 30px;
  height: 1px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%);
  animation: shooting 3s linear infinite;
}

@keyframes shooting {
  0% {
    transform: translateX(-100px);
  }
  100% {
    transform: translateX(150px);
  }
}

.transition-all {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  will-change: transform;
}
</style>
