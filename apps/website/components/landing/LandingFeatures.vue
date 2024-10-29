<script setup lang="ts">
import { ref, onMounted } from 'vue'
import EmblaCarousel, { type EmblaCarouselType, type EmblaOptionsType } from 'embla-carousel'
import AutoScroll from 'embla-carousel-auto-scroll'
import { gsap } from 'gsap'
import { useId } from '#app'

const emblaRef = ref<HTMLElement | null>(null)
let emblaApi: EmblaCarouselType | undefined

// News sources/partners
const partners = [
  { name: 'Aadyah Aerospace', id: useId(), type: 'Private Space' },
  { name: 'Aeroin Space', id: useId(), type: 'Private Space' },
  { name: 'Agnikul', id: useId(), type: 'Private Space' },
  { name: 'Astrogate Labs', id: useId(), type: 'Private Space' },
  { name: 'Bellatrix Aerospace', id: useId(), type: 'Private Space' },
  { name: 'CNSA', id: useId(), type: 'Space Agency' },
  { name: 'CSA', id: useId(), type: 'Space Agency' },
  { name: 'Dhruva Space', id: useId(), type: 'Private Space' },
  { name: 'ESA', id: useId(), type: 'Space Agency' },
  { name: 'ISRO', id: useId(), type: 'Space Agency' },
  { name: 'JAXA', id: useId(), type: 'Space Agency' },
  { name: 'NASA', id: useId(), type: 'Space Agency' },
  { name: 'Pixxel', id: useId(), type: 'Private Space' },
  { name: 'Roscosmos', id: useId(), type: 'Space Agency' },
  { name: 'Skyroot Aerospace', id: useId(), type: 'Private Space' },
]

// Core features with more detailed information
const features = [
  {
    id: useId(),
    title: 'Personalized News Feed',
    subtitle: 'Curated space news tailored to your interests',
    description:
      'Our AI-driven algorithm learns from your reading preferences to deliver the most relevant space and astronomy news directly to your feed.',
    icon: 'mdi:newspaper-variant',
    metrics: ['500+ daily updates', 'AI-powered curation', '15+ categories'],
  },
  {
    id: useId(),
    title: 'Mission Tracker',
    subtitle: 'Real-time space mission monitoring',
    description:
      'Follow ongoing space missions, satellite deployments, and upcoming launches with our interactive tracking system.',
    icon: 'mdi:rocket-launch',
    metrics: ['Live updates', 'Mission details', 'Launch schedules'],
  },
  {
    id: useId(),
    title: 'Research Hub',
    subtitle: 'Latest astronomical research and discoveries',
    description:
      'Access peer-reviewed papers, research summaries, and breakthrough discoveries in astronomy and space technology.',
    icon: 'mdi:telescope',
    metrics: ['200+ journals', 'Expert analysis', 'Research briefs'],
  },
  {
    id: useId(),
    title: 'Community Insights',
    subtitle: 'Connect with space enthusiasts',
    description:
      'Engage with a global community of space enthusiasts, researchers, and industry professionals. Share insights and discuss the latest developments.',
    icon: 'mdi:account-group',
    metrics: ['Global community', 'Expert discussions', 'Live events'],
  },
]

// Stats to showcase platform reach
const stats = [
  { id: useId(), value: 1, suffix: 'K+', label: 'Daily Readers' },
  { id: useId(), value: 100, suffix: '+', label: 'News Sources' },
  { id: useId(), value: 50, suffix: '+', label: 'Space Agencies & Companies' },
  { id: useId(), value: 24, suffix: '/7', label: 'Coverage' },
]

onMounted(() => {
  // Initialize partner carousel
  if (emblaRef.value) {
    const OPTIONS: EmblaOptionsType = { loop: true }

    emblaApi = EmblaCarousel(emblaRef.value, OPTIONS, [
      AutoScroll({
        playOnInit: true,
        speed: 0.7,
        direction: 'forward',
      }),
    ])
  }

  // Animate stats - trigger earlier
  gsap.from('.stat-value', {
    textContent: 0,
    duration: 2,
    ease: 'power1.out',
    snap: { textContent: 1 },
    stagger: 0.2,
    scrollTrigger: {
      trigger: '.stats-grid',
      start: 'top bottom', // Changed from bottom-=100px
      toggleActions: 'play none none reverse',
    },
  })

  // Animate features - trigger earlier and add markers for debugging
  gsap.from('.feature-card', {
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.features-grid',
      start: 'top bottom', // Changed from bottom-=100px
      toggleActions: 'play none none reverse',
    },
  })
})

onUnmounted(() => {
  if (emblaApi?.destroy) {
    emblaApi.destroy()
  }
})
</script>

<template>
  <section class="py-24 container">
    <!-- Stats Section -->
    <LandingGlass
      gradient="blue"
      intensity="low"
      class="mb-24"
      isolate-content
    >
      <div class="stats-grid grid grid-cols-2 md:grid-cols-4 gap-8">
        <div
          v-for="stat in stats"
          :key="stat.id"
          class="text-center flex flex-col"
        >
          <span class="flex items-center justify-center">
            <h3
              class="stat-value text-4xl md:text-5xl font-bold text-primary-400 mb-2"
              :data-stat-id="stat.id"
            >
              {{ stat.value }}
            </h3>
            <p class="text-2xl font-bold pl-1">{{ stat.suffix }}</p>
          </span>
          <p class="text-gray-400 text-sm md:text-base">{{ stat.label }}</p>
        </div>
      </div>

      <!-- Partners Carousel -->
      <div class="py-8 space-y-8">
        <LandingTitle
          title="Trusted Sources & Partners"
          subtitle="Connecting you with the leaders in space exploration"
          class="!pb-12"
        />

        <div class="relative border-x border-primary-900/30 rounded-lg py-8">
          <div
            ref="emblaRef"
            class="embla overflow-hidden"
          >
            <div class="embla__container flex">
              <div
                v-for="partner in partners"
                :key="partner.id"
                class="embla__slide flex-shrink-0 mx-6"
              >
                <div class="flex flex-col items-center space-y-3 group/partner">
                  <div
                    class="w-24 h-24 bg-primary-900/50 rounded-xl p-4 flex items-center justify-center transition-transform duration-300 group-hover/partner:scale-110"
                  >
                    <NuxtImg
                      :src="`/images/logos/${partner.name.toLowerCase().replace(' ', '-')}-logo.jpg`"
                      :alt="partner.name"
                      class="w-full h-full object-contain opacity-70 group-hover/partner:opacity-100"
                      width="96"
                      height="96"
                    />
                  </div>
                  <span class="text-sm font-medium text-gray-400">{{ partner.name }}</span>
                  <span class="text-xs text-gray-500">{{ partner.type }}</span>
                </div>
              </div>
            </div>
          </div>
          <div
            class="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-primary-950 to-transparent"
          ></div>
          <div
            class="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-primary-950 to-transparent"
          ></div>
        </div>
      </div>

      <div class="py-8 space-y-8">
        <LandingTitle
          title="Comprehensive Space Coverage"
          subtitle="Get all your space news, research, and mission updates in one place with our powerful platform"
          class="!pb-12"
        />
        <div class="features-grid grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            v-for="feature in features"
            :key="feature.id"
          >
            <PrimeCard
              class="h-full bg-primary-900/30 border border-primary-900/50 hover:border-primary-900/50 transition-colors duration-300"
            >
              <template #title>
                <div class="flex items-start space-x-4">
                  <div
                    class="p-3 flex rounded-xl bg-primary-500/10 group-hover:bg-primary-500/20 transition-colors duration-300"
                  >
                    <Icon
                      :name="feature.icon"
                      class="text-primary-400"
                      size="32"
                    />
                  </div>
                  <div>
                    <h3 class="text-xl font-bold text-white mb-1">{{ feature.title }}</h3>
                    <p class="text-gray-400 text-base">{{ feature.subtitle }}</p>
                  </div>
                </div>
              </template>

              <template #content>
                <p class="text-gray-300 mb-6">{{ feature.description }}</p>
                <div class="flex flex-wrap gap-3">
                  <span
                    v-for="(metric, index) in feature.metrics"
                    :key="index"
                    class="px-3 py-1 rounded-full text-sm bg-primary-900/50 text-gray-400 border border-primary-900"
                  >
                    {{ metric }}
                  </span>
                </div>
              </template>
            </PrimeCard>
          </div>
        </div>
      </div>
    </LandingGlass>
  </section>
</template>

<style scoped>
.embla {
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.embla__container {
  display: flex;
  will-change: transform;
}

.embla__slide {
  flex: 0 0 auto;
  min-width: 0;
  max-width: 200px;
  position: relative;
}
</style>
