<script setup lang="ts">
import { ref, provide } from 'vue'
import { useWindowScroll } from '@vueuse/core'
import { useAnalytics } from '#imports'

const { trackUserAcquisition, UserAcquisitionMetric } = useAnalytics()

// SEO metadata
useHead({
  title: 'AstronEra - Space Intelligence Platform',
  meta: [
    {
      name: 'description',
      content:
        'Connect with astronomy data, analyze research, and discover cosmic insights with our AI-powered platform for researchers, communicators, and enthusiasts.',
    },
    { property: 'og:title', content: 'AstronEra - Space Intelligence Platform' },
    {
      property: 'og:description',
      content:
        'Connect with astronomy data, analyze research, and discover cosmic insights with our AI-powered platform for researchers, communicators, and enthusiasts.',
    },
    { property: 'og:image', content: '/images/hero-image.jpg' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
})

// Global persona state management
const activePersona = ref('researchers')

// Function to update the active persona - will be passed down to children
const setActivePersona = (persona: string) => {
  activePersona.value = persona

  // Track persona selection
  trackUserAcquisition(UserAcquisitionMetric.SignUpConversion, {
    action: 'persona_selection',
    persona: persona,
  })
}

// Provide these values to all child components
provide('activePersona', activePersona)
provide('setActivePersona', setActivePersona)

// Track landing page view
onMounted(() => {
  trackUserAcquisition(UserAcquisitionMetric.SignUpConversion, {
    source: 'landing_page',
    referring_url: document.referrer,
  })
})

// Scroll position for floating button
const { y } = useWindowScroll()
</script>

<template>
  <div>
    <!-- Main content sections -->
    <LundHeroSection
      id="home"
      :active-persona="activePersona"
      @set-persona="setActivePersona"
    />

    <main>
      <LundEventCountdown
        id="events"
        :active-persona="activePersona"
      />
      <LundProblemSolutionCompare
        id="old-vs-new"
        :active-persona="activePersona"
      />
      />
      <LundFeatureShowcase
        id="features"
        :active-persona="activePersona"
      />
      <LundPartnerLogoScroll id="partners" />
      <LundPricingTiers
        id="pricing"
        :active-persona="activePersona"
      />
      <LundCallToAction
        id="get-started"
        :active-persona="activePersona"
      />
    </main>

    <!-- Floating scroll-to-top button -->
    <ClientOnly>
      <Transition name="fade">
        <button
          v-show="y > 500"
          class="fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-primary-600 to-blue-600 text-white shadow-lg shadow-primary-600/30 transition-all duration-300 hover:from-primary-500 hover:to-blue-500"
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
