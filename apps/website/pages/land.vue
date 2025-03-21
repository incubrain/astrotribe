<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'

// SEO metadata
useHead({
  title: 'AstroQuery - Your AI-Powered Space Research Assistant',
  meta: [
    {
      name: 'description',
      content:
        'Connect with astronomy data, analyze research, and discover cosmic insights in seconds with our AI-powered platform for space enthusiasts, researchers, and educators.',
    },
    { property: 'og:title', content: 'AstroQuery - Your AI-Powered Space Research Assistant' },
    {
      property: 'og:description',
      content:
        'Connect with astronomy data, analyze research, and discover cosmic insights in seconds with our AI-powered platform for space enthusiasts, researchers, and educators.',
    },
    { property: 'og:image', content: '/images/hero-image.jpg' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
})

// Smooth scroll for anchor links
onMounted(() => {
  if (import.meta.client) {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault()

        const targetId = this.getAttribute('href')
        if (!targetId) return

        const targetElement = document.querySelector(targetId)
        if (!targetElement) return

        targetElement.scrollIntoView({
          behavior: 'smooth',
        })
      })
    })
  }
})

const categories = [
  { name: 'Research', icon: 'mdi:book-open-variant', color: 'blue', colorIntensity: '500' },
  { name: 'Companies', icon: 'mdi:domain', color: 'purple', colorIntensity: '500' },
  { name: 'News', icon: 'mdi:newspaper-variant', color: 'red', colorIntensity: '400' },
  { name: 'Events', icon: 'mdi:calendar-star', color: 'green', colorIntensity: '500' },
  { name: 'Observations', icon: 'mdi:telescope', color: 'indigo', colorIntensity: '500' },
  { name: 'Missions', icon: 'mdi:rocket-launch', color: 'orange', colorIntensity: '500' },
  { name: 'Exoplanets', icon: 'mdi:planet', color: 'cyan', colorIntensity: '500' },
  { name: 'Astrobiology', icon: 'mdi:bacteria', color: 'yellow', colorIntensity: '500' },
  { name: 'Space Policy', icon: 'mdi:scale-balance', color: 'gray', colorIntensity: '500' },
  { name: 'Funding & Grants', icon: 'mdi:currency-usd', color: 'teal', colorIntensity: '500' },
]

const { y } = useWindowScroll()
</script>

<template>
  <div>
    <!-- Main content sections -->
    <main>
      <LandHero
        id="home"
        :categories
      />
      <LandNewsSection id="news" />
      <LandPartners id="partners" />
      <LandFeatures id="features" />
      <LandDashboard id="dashboard" />
      <!-- <LandHowItWorks id="how-it-works" /> -->
      <LandOldNew id="old-vs-new" />
      <LandUseCases id="use-cases" />
      <LandTestimonials id="testimonials" />
      <LandPricing id="pricing" />
      <LandCtaSection id="get-started" />
    </main>

    <!-- Floating action button to scroll to top -->
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
