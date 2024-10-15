<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    icon: 'mdi:checkbox-marked-circle-outline',
    title: 'Select Interests',
    description: 'Customize your feed with your favorite space topics.',
  },
  {
    icon: 'mdi:newspaper-variant-outline',
    title: 'Explore Content',
    description: 'Dive into curated news and cutting-edge research.',
  },
  {
    icon: 'mdi:clock-time-four-outline',
    title: 'Save Time',
    description: 'Focus on discovery, not searching for information.',
  },
]

onMounted(() => {
  gsap.from('.step-item', {
    scrollTrigger: {
      trigger: '.how-to-use-section',
      start: 'top bottom-=100px',
      toggleActions: 'play none none reverse',
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
  })
})
</script>

<template>
  <section class="how-to-use-section py-16">
    <div class="container mx-auto px-4">
      <h2 class="text-4xl md:text-5xl font-bold text-center mb-4 font-space">
        Get Started with <span class="text-primary-600">AstroTribe</span>
      </h2>
      <p class="text-xl text-center mb-12 max-w-2xl mx-auto">
        Discover the universe effortlessly with our intuitive platform. Here's how:
      </p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <PrimeCard
          v-for="(step, index) in steps"
          :key="index"
          class="step-item border border-color foreground overflow-hidden relative"
        >
          <template #header>
            <div class="w-full aspect-video bg-gray-200 flex items-center justify-center">
              <span class="text-gray-400">GIF Placeholder</span>
            </div>
          </template>
          <template #title>
            <div class="flex items-center mb-4 mt-4">
              <h3 class="text-xl font-bold font-space">{{ step.title }}</h3>
            </div>
          </template>
          <template #content>
            <p>{{ step.description }}</p>
          </template>
          <Icon
            :name="step.icon"
            size="48"
            class="text-primary-600 shrink-0 absolute -top-6 right-4 bg-foreground rounded-full p-2"
          />
        </PrimeCard>
      </div>
    </div>
  </section>
</template>

<style scoped>
.font-space {
  font-family: 'Orbitron', sans-serif;
}
</style>
