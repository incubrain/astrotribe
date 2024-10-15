<script setup lang="ts">
import { onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const features = [
  {
    icon: 'mdi:robot',
    title: 'AI News Summaries',
    description: 'Get concise, AI-generated summaries of the latest space news.',
  },
  {
    icon: 'mdi:file-document-outline',
    title: 'Latest Research',
    description: 'Stay updated with simplified summaries of recent arXiv papers.',
  },
  {
    icon: 'mdi:rocket',
    title: 'Feature 3',
    description: 'Placeholder text for upcoming feature.',
  },
  {
    icon: 'mdi:star',
    title: 'Feature 4',
    description: 'Placeholder text for upcoming feature.',
  },
]

onMounted(() => {
  gsap.from('.feature-item', {
    scrollTrigger: {
      trigger: '.future-features-section',
      start: 'top bottom-=100px',
      toggleActions: 'play none none reverse',
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
  })

  gsap.from('.feature-arrow', {
    scrollTrigger: {
      trigger: '.future-features-section',
      start: 'top bottom-=100px',
      toggleActions: 'play none none reverse',
    },
    width: 0,
    duration: 0.5,
    stagger: 0.2,
    delay: 0.5,
  })
})
</script>

<template>
  <section class="future-features-section py-16 background">
    <div class="container mx-auto px-4">
      <h2 class="text-4xl md:text-5xl font-bold text-center mb-4 font-space">
        Future Features At A Glance
      </h2>
      <p class="text-xl text-center mb-12 max-w-2xl mx-auto"> Simple But Super Effective </p>

      <div class="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto">
        <template
          v-for="(feature, index) in features"
          :key="index"
        >
          <div class="feature-item flex flex-col items-center mb-8 md:mb-0 w-full md:w-1/4">
            <div
              class="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-4"
            >
              <Icon
                :name="feature.icon"
                size="48"
                class="text-primary-600"
              />
            </div>
            <h3 class="text-lg font-bold text-center mb-2">{{ feature.title }}</h3>
            <p class="text-sm text-center">{{ feature.description }}</p>
          </div>

          <div
            v-if="index < features.length - 1"
            class="feature-arrow hidden md:block w-12 h-1 bg-primary-600 my-4 md:my-0"
          ></div>
        </template>
      </div>

      <div class="text-center mt-12">
        <PrimeButton
          label="Join AstronEra Now"
          class="p-button-lg"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.font-space {
  font-family: 'Orbitron', sans-serif;
}
</style>
