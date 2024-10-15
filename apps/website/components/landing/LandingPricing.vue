<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const features = [
  'Daily space news updates',
  'Basic search functionality',
  'Community forums access',
  'Email notifications',
]

onMounted(() => {
  gsap.from('.pricing-card', {
    scrollTrigger: {
      trigger: '.pricing-section',
      start: 'top bottom-=100px',
      toggleActions: 'play none none reverse',
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
  })
})

const trackTrialStart = () => {
  if (window.posthog) {
    window.posthog.capture('free_plan_selected')
  }
}
</script>

<template>
  <section class="pricing-section py-16">
    <div class="container mx-auto px-4">
      <h2 class="text-4xl md:text-5xl font-bold text-center mb-4 font-space">
        Unlimited access for <span class="text-primary-600">FREE</span>
      </h2>
      <p class="text-xl text-center mb-12 max-w-2xl mx-auto">
        AstronEra offers the most comprehensive space news and research platform. Get full access to
        our content and features at no cost.
      </p>

      <div class="flex justify-center">
        <div
          class="pricing-card w-full max-w-md rounded-lg shadow-lg p-8 background border border-color"
        >
          <h3 class="text-2xl font-bold mb-4 text-center text-primary-600">Try AstronEra Now</h3>
          <ul class="mb-8">
            <li
              v-for="feature in features"
              :key="feature"
              class="flex items-center mb-3"
            >
              <Icon
                name="mdi:check-circle"
                class="mr-3 text-green-500"
                size="24"
              />
              <span>{{ feature }}</span>
            </li>
          </ul>
          <div class="text-center mb-8">
            <span class="text-4xl font-bold">$0</span>
            <span class="text-xl">/month</span>
          </div>
          <p class="text-sm text-center mb-6">
            No credit card required. Start exploring the cosmos today!
          </p>
          <PrimeButton
            label="Get Started"
            class="p-button-primary w-full"
            @click="trackTrialStart"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.font-space {
  font-family: 'Orbitron', sans-serif;
}
</style>
