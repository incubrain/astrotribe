<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import { useAnimation } from '~/composables/useAnimation'

const { pulseAnimation } = useAnimation()

const features = [
  {
    icon: 'mdi:robot',
    title: 'AI News Summaries',
    description: 'Get concise, AI-generated summaries of the latest space news.',
    color: 'from-blue-500 to-purple-600',
  },
  {
    icon: 'mdi:file-document-outline',
    title: 'Latest Research',
    description: 'Stay updated with simplified summaries of recent arXiv papers.',
    color: 'from-green-500 to-teal-600',
  },
  {
    icon: 'mdi:rocket',
    title: 'Launch Tracking',
    description: 'Real-time updates on upcoming space launches and missions.',
    color: 'from-red-500 to-orange-600',
  },
  {
    icon: 'mdi:star',
    title: 'Stargazing Guide',
    description: 'Personalized sky maps and astronomy event notifications.',
    color: 'from-yellow-500 to-amber-600',
  },
]

const activeFeature = ref(null)
const featureItems = ref([])
const featureArrows = ref([])
const ctaButton = ref(null)

onMounted(() => {
  // Fade in feature items
  gsap.fromTo(
    featureItems.value,
    { y: 50, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.2,
      scrollTrigger: {
        trigger: '.future-features-section',
        start: 'top bottom-=100px',
        end: 'bottom top',
        toggleActions: 'play none none none',
      },
    },
  )

  // Grow width of feature arrows
  gsap.fromTo(
    featureArrows.value,
    { width: 0 },
    {
      width: '100%',
      duration: 0.5,
      delay: 0.5,
      stagger: 0.2,
      scrollTrigger: {
        trigger: '.future-features-section',
        start: 'top bottom-=100px',
        end: 'bottom top',
        toggleActions: 'play none none none',
      },
    },
  )

  // Pulse animation for CTA button
  if (ctaButton.value) {
    pulseAnimation(ctaButton.value)
  }
})
</script>

<template>
  <section class="future-features-section py-16 relative overflow-hidden">
    <div class="star-background absolute inset-0 opacity-10"></div>
    <div class="container mx-auto px-4 relative z-10">
      <LandingTitle
        title="Future Features At A Glance"
        subtitle="Elevate Your Space Exploration Experience"
      />

      <div class="flex flex-col md:flex-row items-stretch justify-between max-w-6xl mx-auto">
        <template
          v-for="(feature, index) in features"
          :key="index"
        >
          <div
            ref="featureItems"
            class="flex flex-col items-center mb-8 md:mb-0 w-full md:w-1/4 p-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-2"
            :class="{ 'bg-gray-800 bg-opacity-50': activeFeature === index }"
          >
            <div
              class="w-24 h-24 rounded-full flex items-center justify-center mb-4 bg-gradient-to-br"
              :class="feature.color"
            >
              <Icon
                :name="feature.icon"
                size="48"
                class="text-white"
              />
            </div>
            <h3 class="text-xl font-bold text-center mb-2">{{ feature.title }}</h3>
            <p class="text-sm text-center">{{ feature.description }}</p>
            <div
              v-if="activeFeature === index"
              class="mt-4 text-sm text-center text-primary-300"
            >
              Coming soon!
            </div>
          </div>

          <div
            v-if="index < features.length - 1"
            ref="featureArrows"
            class="feature-arrow hidden md:block w-12 h-1 bg-gradient-to-r from-primary-500 to-primary-600 my-4 md:my-auto"
          ></div>
        </template>
      </div>

      <div class="text-center mt-12">
        <PrimeButton
          ref="ctaButton"
          label="Join AstronEra Now"
          size="large"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.star-background {
  background-image: radial-gradient(2px 2px at 20px 30px, #eee, rgba(0, 0, 0, 0)),
    radial-gradient(2px 2px at 40px 70px, #fff, rgba(0, 0, 0, 0)),
    radial-gradient(2px 2px at 50px 160px, #ddd, rgba(0, 0, 0, 0)),
    radial-gradient(2px 2px at 90px 40px, #fff, rgba(0, 0, 0, 0)),
    radial-gradient(2px 2px at 130px 80px, #fff, rgba(0, 0, 0, 0)),
    radial-gradient(2px 2px at 160px 120px, #ddd, rgba(0, 0, 0, 0));
  background-repeat: repeat;
  background-size: 200px 200px;
}
</style>
