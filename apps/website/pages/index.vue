<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useWindowScroll, useWindowSize } from '@vueuse/core'
import { useAnalytics } from '#imports'

const { trackUserAcquisition, UserAcquisitionMetric } = useAnalytics()

const { width, height } = useWindowSize()

// SEO metadata
useHead({
  title: 'AstronEra - Space Intelligence Platform',
  meta: [
    {
      name: 'description',
      content:
        'Connect with astronomy data, analyze research, and discover cosmic insights with our AI-powered platform for researchers, science communicators, and enthusiasts.',
    },
    { property: 'og:title', content: 'AstronEra - Space Intelligence Platform' },
    {
      property: 'og:description',
      content:
        'Connect with astronomy data, analyze research, and discover cosmic insights with our AI-powered platform for researchers, science communicators, and enthusiasts.',
    },
    { property: 'og:image', content: '/images/hero-image.jpg' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
})

// Use our persona store for global state management
const { trackUserEngagement, UserEngagementMetric } = useAnalytics()

// Handle navigation and feature toggle events
const handleNavigateTo = (sectionId) => {
  // Find element by ID and scroll to it
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }

  // Track the navigation event
  trackUserEngagement(UserEngagementMetric.ActionsPerSession, {
    action: 'section_navigation',
    section: sectionId,
  })
}

const handleFeatureToggle = ({ tool, section, persona }) => {
  // This could open modals, activate specific features, etc.
  console.log(`Tool ${tool} activated in ${section} section for ${persona} persona`)

  // Track the feature toggle event
  trackUserEngagement(UserEngagementMetric.FeatureAdoption, {
    feature: 'mission_control_tool',
    tool,
    section,
    persona,
  })
}

// Track landing page view
onMounted(() => {
  trackUserAcquisition(UserAcquisitionMetric.SignUpConversion, {
    source: 'landing_page',
    referring_url: document.referrer,
  })
})

// Scroll position for floating button
const { y } = useWindowScroll()

// Pre-load persona images for smoother transitions
const preloadImages = () => {
  if (import.meta.client) {
    // We would normally preload images here, but for this example we're using a placeholder
    // const images = ['/images/researchers-bg.jpg', '/images/communicators-bg.jpg', '/images/enthusiasts-bg.jpg']
    // images.forEach(src => {
    //   const img = new Image()
    //   img.src = src
    // })
  }
}

onMounted(() => {
  preloadImages()
})
</script>

<template>
  <div>
    <!-- Main content sections -->
    <LundHeroSection id="home" />

    <main>
      <LundMissionControlSidebar
        @navigate-to="handleNavigateTo"
        @toggle-feature="handleFeatureToggle"
      />
      <LundEventCountdown id="events" />
      <LundProblemSolutionCompare id="comparison" />
      <LundFeatureShowcase id="features" />
      <LundPartnerLogoScroll id="partners" />
      <LundPricingTiers id="pricing" />
      <LundCallToAction
        id="cta"
        class="my-24"
      />
      <PopupContainer class="flex justify-center">
        <IBImage :img="{ src: '/workshop/astronomy-workshop.jpeg' }" />
        <NuxtLink
          to="https://rzp.io/rzp/AstronEraSpaceWorkshop"
          target="_blank"
          class="absolute left-1/2 bottom-0 transform -translate-x-1/2"
          ><PrimeButton>Register Now</PrimeButton></NuxtLink
        >
      </PopupContainer>
    </main>

    <!-- Floating scroll-to-top button -->
    <ClientOnly v-if="width < 768">
      <Transition name="fade">
        <button
          v-show="y > 500"
          class="fixed bottom-8 right-8 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-primary-600 to-blue-600 text-white shadow-lg shadow-primary-600/30 transition-all duration-300 hover:from-primary-500 hover:to-blue-500 z-[1000]"
          @click="window.scrollTo({ top: 0, behavior: 'smooth' })"
        >
          <Icon
            name="mdi:chevron-up"
            size="24"
          />
        </button>
      </Transition>
    </ClientOnly>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
