<script setup lang="ts">
import { onMounted } from 'vue'
import { useAnimation } from '~/composables/useAnimation'

const { fadeInUp } = useAnimation()

const features = [
  {
    text: 'Daily space news updates',
    description: 'Stay informed with the latest developments in space exploration',
  },
  {
    text: 'Basic search functionality',
    description: "Find exactly what you're looking for with powerful search",
  },
  {
    text: 'Community forums access',
    description: 'Connect with fellow space enthusiasts',
  },
  {
    text: 'Email notifications',
    description: 'Never miss important space events and news',
  },
  {
    text: 'Personalized feed',
    description: 'Content tailored to your interests',
  },
  {
    text: 'Launch calendars',
    description: 'Track upcoming space missions and events',
  },
  {
    text: 'Basic API access',
    description: 'Integrate space data into your projects',
  },
]

onMounted(() => {
  fadeInUp('.pricing-content')
})
</script>

<template>
  <section class="py-24">
    <LandingGlass
      gradient="mixed"
      intensity="low"
    >
      <LandingTitle
        title="Unlimited access for FREE"
        subtitle="AstronEra offers the most comprehensive space news platform at zero cost"
      />
      <div class="pricing-content flex flex-col items-center">
        <!-- Price Tag -->
        <div class="flex items-baseline gap-2 mb-8">
          <span class="text-6xl font-bold text-sky-400">$0</span>
          <span class="text-xl text-gray-400">/forever</span>
          <span
            class="ml-4 px-4 py-1 rounded-full text-sm bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
          >
            FOREVER FREE
          </span>
        </div>

        <!-- Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 w-full max-w-4xl">
          <div
            v-for="feature in features"
            :key="feature.text"
            class="group relative flex"
          >
            <!-- Feature Card -->
            <div
              class="relative rounded-xl bg-primary-900/30 backdrop-blur-sm p-4 border border-primary-800/30 transition-all duration-300 hover:border-sky-500/30"
            >
              <!-- Hover Gradient -->
              <div
                class="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
              />

              <!-- Content -->
              <div class="relative z-10 flex items-start gap-3">
                <Icon
                  name="mdi:check-circle"
                  class="text-emerald-500 flex-shrink-0 mt-1"
                  size="20"
                />
                <div>
                  <h4 class="font-medium text-white mb-1">{{ feature.text }}</h4>
                  <p class="text-sm text-gray-400">{{ feature.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CTA Section -->
        <div class="text-center space-y-6 max-w-2xl">
          <p class="text-gray-300"> No credit card required. Start exploring the cosmos today! </p>
          <div class="flex justify-center gap-4">
            <PrimeButton
              label="Get Started Now"
              icon="mdi:rocket-launch-outline"
              size="large"
              class="min-w-[200px] bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 transition-all duration-300"
            />
            <PrimeButton
              label="Learn More"
              size="large"
              outlined
              severity="secondary"
              class="min-w-[200px] border-sky-500/30 hover:border-sky-500/50 text-sky-400 transition-all duration-300"
            />
          </div>
          <p class="text-sm text-gray-400">
            Join thousands of space enthusiasts already using AstronEra
          </p>
        </div>
      </div>
    </LandingGlass>
  </section>
</template>
