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
    color: 'from-blue-500/20 to-purple-600/20',
    gradient: 'bg-gradient-to-br from-blue-500 to-purple-600',
    comingSoon: 'Q4 2024',
  },
  {
    icon: 'mdi:file-document-outline',
    title: 'Latest Research',
    description: 'Stay updated with simplified summaries of recent arXiv papers.',
    color: 'from-green-500/20 to-teal-600/20',
    gradient: 'bg-gradient-to-br from-green-500 to-teal-600',
    comingSoon: 'Q4 2024',
  },
  {
    icon: 'mdi:rocket-launch',
    title: 'Company Updates',
    description: 'Follow the latest news and updates from your favorite space companies.',
    color: 'from-red-500/20 to-orange-600/20',
    gradient: 'bg-gradient-to-br from-red-500 to-orange-600',
    comingSoon: 'Q1 2025',
  },
  {
    icon: 'mdi:account-group',
    title: 'Networking',
    description: 'Connect with other space enthusiasts and professionals in the community.',
    color: 'from-yellow-500/20 to-amber-600/20',
    gradient: 'bg-gradient-to-br from-yellow-500 to-amber-600',
    comingSoon: 'Q2 2025',
  },
]

const featureItems = ref([])
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
        trigger: '.features-grid',
        start: 'top bottom',
        toggleActions: 'play none none reverse',
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
  <section>
    <LandingGlass
      gradient="mixed"
      intensity="low"
      interactive
      isolate-content
    >
      <LandingTitle
        title="Into the Future"
        subtitle="Elevate Your Space Exploration Experience"
        gradient="mixed"
        intensity="low"
      />
      <div class="features-grid grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div
          v-for="(feature, index) in features"
          :key="index"
          ref="featureItems"
          class="group/feature relative"
        >
          <!-- Feature Card -->
          <div
            class="relative h-full rounded-xl bg-primary-900/30 backdrop-blur-sm p-8 border border-primary-800/30 transition-all duration-500 hover:border-sky-500/30"
          >
            <!-- Hover Gradient -->
            <div
              class="absolute inset-0 bg-gradient-to-br opacity-0 group-hover/feature:opacity-100 transition-opacity duration-500 rounded-xl"
              :class="feature.color"
            ></div>

            <!-- Content -->
            <div class="relative z-10 flex flex-col h-full">
              <!-- Icon -->
              <div
                class="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
                :class="feature.gradient"
              >
                <Icon
                  :name="feature.icon"
                  size="32"
                  class="text-white"
                />
              </div>

              <!-- Text Content -->
              <h3 class="text-xl font-bold text-white mb-3">{{ feature.title }}</h3>
              <p class="text-gray-300 mb-6">{{ feature.description }}</p>

              <!-- Coming Soon Badge -->
              <div class="mt-auto flex items-center gap-2">
                <span class="text-sky-400 text-sm">Coming</span>
                <span
                  class="px-2 py-1 rounded-full text-xs bg-sky-500/10 border border-sky-500/20 text-sky-400"
                >
                  {{ feature.comingSoon }}
                </span>
              </div>
            </div>
          </div>

          <!-- Card Glow -->
          <div
            class="absolute inset-0 bg-sky-500/5 group-hover/feature:bg-sky-500/10 blur-xl transition-all duration-500 -z-10 rounded-xl"
          />
        </div>
      </div>
    </LandingGlass>
  </section>
</template>
