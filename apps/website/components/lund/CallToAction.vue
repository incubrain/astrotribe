<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { usePersona } from '~/composables/usePersona'
import { useAnimation } from '~/composables/useAnimation'
import { useAnalytics } from '#imports'

const { conf: motionConstants } = useAnimation()
const { trackUserEngagement, UserEngagementMetric } = useAnalytics()

// Get persona state from our composable
const { activePersona, personaStyles, isResearcher, isCommunicator, isEnthusiast } = usePersona()

// Defensive access for computed properties
const componentColor = computed(() => {
  return activePersona.value?.color || 'gray'
})

const personaNameLower = computed(() => {
  return activePersona.value?.name?.toLowerCase() || ''
})

// CTA button hover state
const isHovered = ref(false)

// Form data
const email = ref('')
const isSubmitting = ref(false)
const isSubmitted = ref(false)
const submitError = ref(null)

// Handle newsletter subscription
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
      persona: activePersona.value.name,
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
    persona: activePersona.value.name,
  })
}

// Get persona-specific CTA text
const ctaText = computed(() => {
  if (isResearcher.value) {
    return 'Start Your Research Journey'
  } else if (isCommunicator.value) {
    return 'Enhance Your Science Communication'
  } else {
    return 'Begin Your Cosmic Adventure'
  }
})

// Initialize animated stars
const stars = ref([])
const shootingStars = ref([])
const isClient = ref(false)

// Generate stars
const useStarfield = (count = 50, shootingCount = 5) => {
  if (import.meta.client) {
    isClient.value = true

    // Create fixed stars
    const newStars = []
    for (let i = 0; i < count; i++) {
      newStars.push({
        id: i,
        style: {
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: `${Math.random() * 3 + 1}px`,
          height: `${Math.random() * 3 + 1}px`,
          opacity: Math.random() * 0.8,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${Math.random() * 3 + 2}s`,
        },
      })
    }
    stars.value = newStars

    // Create shooting stars
    const newShooting = []
    for (let i = 0; i < shootingCount; i++) {
      newShooting.push({
        id: i,
        style: {
          left: `${Math.random() * 80}%`,
          top: `${Math.random() * 80}%`,
          opacity: 0,
          animationDelay: `${Math.random() * 15 + 3}s`,
          animationDuration: '1s',
        },
      })
    }
    shootingStars.value = newShooting
  }

  return { stars, shootingStars, isClient }
}

// Generate stars on component mount
onMounted(() => {
  useStarfield(50, 8)
})
</script>

<template>
  <section
    id="cta"
    class="py-20 md:py-28 relative overflow-hidden"
  >
    <!-- Background with gradient -->
    <div
      class="absolute inset-0 bg-gradient-to-b from-primary-900/90 to-slate-950 z-0 transition-colors duration-700"
      :class="
        isResearcher
          ? 'from-blue-900/90'
          : isCommunicator
            ? 'from-emerald-900/90'
            : 'from-amber-900/90'
      "
    ></div>

    <!-- Animated stars -->
    <ClientOnly>
      <div
        v-if="isClient"
        class="absolute inset-0 z-0"
      >
        <div
          v-for="star in stars"
          :key="star.id"
          class="absolute rounded-full bg-white twinkle"
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
    <div
      class="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl transition-colors duration-700"
      :class="`bg-${componentColor}-600/10`"
    ></div>
    <div
      class="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl transition-colors duration-700"
      :class="`bg-${componentColor}-600/10`"
    ></div>

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
            class="relative w-full max-w-sm aspect-square rounded-full overflow-hidden bg-primary-900/30 shadow-2xl transition-colors duration-700"
            :class="`border border-${componentColor}-600/20 shadow-${componentColor}-600/20`"
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
                class="transition-colors duration-700"
                :class="personaStyles.sectionHeading"
                >the Cosmos?</span
              >
            </h2>
            <p class="text-xl text-gray-300">
              Join thousands of
              {{
                isResearcher
                  ? 'Researcher'
                  : isCommunicator
                    ? 'Science Communicator'
                    : 'Astronomy Enthusiasts'
              }}
              using AstronEra to unlock the secrets of the universe.
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
            <AuthWrapper
              mode="register"
              redirect-url="/onboarding"
            >
              <template #default="{ authAction }">
                <PrimeButton
                  size="large"
                  :class="personaStyles.primaryButton"
                  class="mt-6"
                  @click="
                    () => {
                      trackCTAClick('final_cta')
                      authAction()
                    }
                  "
                >
                  Start Your Journey
                </PrimeButton>
              </template>
            </AuthWrapper>
          </div>
          <div class="mt-16 transition-colors duration-500">
            <span
              class="inline-block px-4 py-2 rounded-full text-sm backdrop-blur-sm transition-colors duration-500"
              :class="`bg-${componentColor}-900/50 border border-${componentColor}-700/30 text-${componentColor}-400`"
            >
              <Icon
                :name="activePersona.iconName"
                class="mr-1"
                size="14"
              />
              Customized for {{ activePersona.name }}
            </span>
          </div>
        </div>
      </div>

      <!-- Persona badge at bottom -->
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

.twinkle {
  animation: twinkle 4s ease-in-out infinite alternate;
}

@keyframes twinkle {
  0% {
    opacity: 0.2;
    transform: scale(0.8);
  }
  100% {
    opacity: 0.8;
    transform: scale(1.2);
  }
}

.transition-all {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  will-change: transform;
}
</style>
