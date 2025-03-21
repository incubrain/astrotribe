<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'

// Steps in the process
const steps = ref([
  {
    id: 1,
    title: 'Ask anything about astronomy',
    description:
      'Type your question in natural language - from basic concepts to complex research queries.',
    icon: 'mdi:comment-question',
    color: 'from-primary-600 to-blue-500',
  },
  {
    id: 2,
    title: 'Our AI searches across research and data',
    description:
      'AstroQuery analyzes millions of papers, datasets, and trusted sources to find relevant information.',
    icon: 'mdi:magnify-scan',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 3,
    title: 'Get comprehensive, cited answers',
    description:
      'Receive detailed explanations with direct links to original sources and related research.',
    icon: 'mdi:text-box-check',
    color: 'from-indigo-600 to-primary-600',
  },
])

// Animation timeline
onMounted(() => {
  if (import.meta.client) {
    // Create staggered animations for steps
    gsap.from('.step-card', {
      opacity: 0,
      y: 50,
      stagger: 0.3,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.steps-container',
        start: 'top bottom-=100px',
      },
    })

    // Animate the connecting lines
    gsap.from('.connector', {
      scaleX: 0,
      duration: 1.5,
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: '.steps-container',
        start: 'top bottom-=100px',
      },
    })

    // Animate the demo container
    gsap.from('.demo-container', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      delay: 0.5,
      scrollTrigger: {
        trigger: '.demo-container',
        start: 'top bottom-=100px',
      },
    })
  }
})
</script>

<template>
  <section class="py-16 md:py-24">
    <div class="wrapper max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <LandTitle
        title="How AstroQuery Works"
        subtitle="Astronomy knowledge at your fingertips"
        gradient
      />

      <!-- Steps Process -->
      <div class="steps-container relative mt-16 mb-20">
        <!-- Horizontal connector line for desktop -->
        <div
          class="hidden md:block absolute top-32 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-600/50 to-transparent connector"
        ></div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          <div
            v-for="(step, index) in steps"
            :key="step.id"
            class="step-card relative"
          >
            <!-- Vertical connector line for mobile -->
            <div
              v-if="index < steps.length - 1"
              class="md:hidden absolute left-[22px] top-[80px] w-1 h-28 bg-gradient-to-b from-primary-600/50 to-transparent connector"
            ></div>

            <!-- Step number circle -->
            <div
              class="absolute -top-6 -left-6 md:left-1/2 md:-translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center z-10 shadow-lg shadow-primary-600/20"
              :class="step.color"
            >
              <span class="text-white font-bold">{{ step.id }}</span>
            </div>

            <!-- Step card content -->
            <div
              class="relative h-full rounded-xl bg-slate-900/30 backdrop-blur-sm border border-slate-800/50 hover:border-primary-600/30 transition-all duration-300 p-8 pt-10 md:text-center"
            >
              <div class="mb-6 md:flex md:justify-center">
                <div
                  class="w-16 h-16 rounded-full bg-gradient-to-br flex items-center justify-center"
                  :class="step.color"
                >
                  <Icon
                    :name="step.icon"
                    class="text-white"
                    size="28"
                  />
                </div>
              </div>

              <h3 class="text-xl font-bold text-white mb-4">{{ step.title }}</h3>
              <p class="text-gray-300">{{ step.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Demo Video Section -->
      <div class="demo-container relative">
        <div
          class="absolute -inset-1 bg-gradient-to-r from-primary-600/20 via-blue-500/20 to-primary-600/20 rounded-xl blur-xl"
        ></div>

        <div class="relative rounded-xl overflow-hidden border border-primary-600/30">
          <!-- Video placeholder with play button -->
          <div
            class="relative bg-slate-900 aspect-video flex items-center justify-center group cursor-pointer"
          >
            <img
              src="/images/hero-image.jpg"
              alt="AstroQuery Demo"
              class="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-300"
            />

            <!-- Play button overlay -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div
                class="w-20 h-20 rounded-full bg-primary-600/90 flex items-center justify-center group-hover:bg-primary-600 transition-colors duration-300 shadow-lg shadow-primary-600/30"
              >
                <Icon
                  name="mdi:play"
                  class="text-white ml-1"
                  size="36"
                />
              </div>
            </div>

            <!-- Video title overlay -->
            <div
              class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent p-6"
            >
              <h3 class="text-2xl font-bold text-white mb-2">See AstroQuery in Action</h3>
              <p class="text-gray-300">Watch a 2-minute demo of real-time astronomy research</p>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA button -->
      <div class="mt-12 text-center">
        <PrimeButton
          size="large"
          class="bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-500 hover:to-blue-500 transition-all duration-300"
        >
          Try AstroQuery Now
          <Icon
            name="mdi:rocket-launch"
            class="ml-2"
            size="20"
          />
        </PrimeButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.step-card {
  transition: transform 0.3s ease;
}

.step-card:hover {
  transform: translateY(-5px);
}
</style>
