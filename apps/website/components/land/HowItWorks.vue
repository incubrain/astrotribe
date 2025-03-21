<script setup lang="ts">
import { ref } from 'vue'

const { conf: motionConstants } = useAnimation()

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
</script>

<template>
  <section
    id="how-it-works"
    class="py-20 md:py-28 relative"
  >
    <!-- Background with subtle gradient -->
    <div class="absolute inset-0 bg-gradient-to-b from-slate-950 to-primary-950/80 z-0"></div>

    <!-- Glow effects -->
    <div class="absolute left-0 top-1/4 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl"></div>
    <div class="absolute right-0 bottom-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>

    <div class="wrapper container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <div
        v-motion="motionConstants.sectionTitle"
        class="text-center max-w-3xl mx-auto mb-16"
      >
        <h2 class="text-3xl md:text-5xl font-bold mb-4 text-white leading-tight">
          How
          <span class="bg-gradient-to-r from-blue-500 to-primary-600 bg-clip-text text-transparent"
            >AstroQuery Works</span
          >
        </h2>
        <p class="text-xl text-gray-300"> Astronomy knowledge at your fingertips </p>
      </div>

      <!-- Steps Process -->
      <div class="relative mt-10 mb-20">
        <!-- Horizontal connector line for desktop -->
        <div
          v-motion
          :initial="{ scaleX: 0, opacity: 0 }"
          :visibleOnce="{ scaleX: 1, opacity: 1, transition: { duration: 1, delay: 0.5 } }"
          class="hidden md:block absolute top-36 left-0 right-0 h-1 bg-gradient-to-r from-primary-600/10 via-primary-600/50 to-primary-600/10 transform origin-left"
        ></div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
          <div
            v-for="(step, index) in steps"
            :key="step.id"
            v-motion
            :initial="{ opacity: 0, y: 50 }"
            :visibleOnce="{
              opacity: 1,
              y: 0,
              transition: {
                type: 'spring',
                stiffness: 200,
                damping: 20,
                delay: 0.2 + index * 0.2,
              },
            }"
            class="relative"
          >
            <!-- Vertical connector line for mobile -->
            <div
              v-if="index < steps.length - 1"
              v-motion
              :initial="{ scaleY: 0, opacity: 0 }"
              :visibleOnce="{
                scaleY: 1,
                opacity: 1,
                transition: { duration: 0.8, delay: 0.5 + index * 0.2 },
              }"
              class="md:hidden absolute left-[22px] top-[80px] w-1 h-28 bg-gradient-to-b from-primary-600/70 to-transparent transform origin-top"
            ></div>

            <!-- Step number badge -->
            <div
              class="absolute -top-6 -left-6 md:left-1/2 md:-translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center z-20 shadow-lg shadow-primary-900/30"
              :class="step.color"
            >
              <span class="text-white font-bold">{{ step.id }}</span>
            </div>

            <!-- Step card content -->
            <div
              class="relative h-full rounded-xl backdrop-blur-sm bg-slate-900/50 border border-slate-800/50 hover:border-primary-600/30 transition-all duration-300 p-8 pt-10 md:text-center hover:shadow-lg hover:shadow-primary-900/10 transform hover:-translate-y-2 transition-transform duration-300"
            >
              <!-- Icon -->
              <div class="mb-6 md:flex md:justify-center">
                <div
                  class="w-16 h-16 rounded-full bg-gradient-to-br flex items-center justify-center shadow-lg shadow-primary-900/20"
                  :class="step.color"
                >
                  <Icon
                    :name="step.icon"
                    class="text-white"
                    size="28"
                  />
                </div>
              </div>

              <!-- Text content -->
              <h3 class="text-xl font-bold text-white mb-4">{{ step.title }}</h3>
              <p class="text-gray-300">{{ step.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Demo Video Section -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visibleOnce="{ opacity: 1, y: 0, transition: { type: 'spring', delay: 0.8 } }"
        class="relative"
      >
        <div
          class="absolute -inset-1 bg-gradient-to-r from-primary-600/20 via-blue-500/20 to-primary-600/20 rounded-xl blur-xl"
        ></div>

        <div class="relative rounded-xl overflow-hidden border border-primary-600/30">
          <!-- Video placeholder with play button -->
          <div
            v-motion
            class="relative bg-slate-900 aspect-video flex items-center justify-center group cursor-pointer"
            :initial="{ scale: 0.95 }"
            :visibleOnce="{
              scale: 1,
              transition: { type: 'spring', stiffness: 200, damping: 20, delay: 1 },
            }"
            :hovered="{ scale: 1.02, transition: { type: 'spring', stiffness: 300, damping: 15 } }"
          >
            <img
              src="/images/hero-image.jpg"
              alt="AstroQuery Demo"
              class="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-300"
            />

            <!-- Play button overlay -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div
                v-motion
                class="w-20 h-20 rounded-full bg-primary-600/90 flex items-center justify-center group-hover:bg-primary-500 transition-colors duration-300 shadow-lg shadow-primary-600/30"
                :hovered="{
                  scale: 1.1,
                  transition: { type: 'spring', stiffness: 400, damping: 8 },
                }"
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
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 1.2 } }"
        class="mt-14 text-center"
      >
        <div class="inline-block p-0.5 rounded-md bg-gradient-to-r from-primary-600 to-blue-600">
          <PrimeButton
            size="large"
            class="bg-slate-900 hover:bg-slate-800/80 text-white shadow-lg shadow-primary-900/20 transition-all duration-300 border-none"
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
    </div>
  </section>
</template>

<style scoped>
.transform {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  will-change: transform;
}
</style>
