<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAnimation } from '~/composables/useAnimation'

const { fadeInUp } = useAnimation()

const steps = [
  {
    icon: 'mdi:checkbox-marked-circle-outline',
    title: 'Customize Your Feed',
    description: 'Select your favorite topics and interests to personalize your news feed.',
    gif: '/images/gifs/select-interests.gif',
    color: 'from-blue-500/20 to-purple-500/20',
  },
  {
    icon: 'mdi:newspaper-variant-outline',
    title: '',
    description: '',
    gif: '/images/gifs/explore-content.gif',
    color: 'from-sky-500/20 to-blue-500/20',
  },
  {
    icon: 'mdi:bell-outline',
    title: 'Stay Updated',
    description: 'Receive personalized notifications for events and breaking news.',
    gif: '/images/gifs/track-missions.gif',
    color: 'from-purple-500/20 to-blue-500/20',
  },
  {
    icon: 'mdi:clock-time-four-outline',
    title: 'Save Time',
    description: 'The more you use it, the better it gets at delivering the news you care about.',
    gif: '/images/gifs/stay-updated.gif',
    color: 'from-indigo-500/20 to-sky-500/20',
  },
]

onMounted(() => {
  fadeInUp('.step-item')
})
</script>

<template>
  <section class="py-24 container">
    <LandingTitle
      class="mb-12"
      title="How it works"
      subtitle="Discover the universe effortlessly with our intuitive platform. Here's how:"
    />

    <!-- Steps Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="step-item group relative"
      >
        <!-- Step Number -->
        <div
          class="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-primary-900/50 backdrop-blur-lg flex items-center justify-center border border-sky-500/20 z-10 transition-all duration-300 group-hover:border-sky-500/40 group-hover:bg-primary-900/70"
        >
          <span class="font-space text-sky-400 text-xl">{{ index + 1 }}</span>
        </div>

        <PrimeCard
          class="h-full bg-primary-900/30 backdrop-blur-md border border-primary-800/30 hover:border-sky-500/30 transition-all duration-500 overflow-hidden"
        >
          <!-- Content -->
          <template #header>
            <div class="relative w-full aspect-video rounded-lg overflow-hidden bg-primary-950/50">
              <!-- Replace with actual GIF -->
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-gray-400">GIF Placeholder</span>
              </div>

              <!-- Overlay with icon -->
              <div
                class="absolute inset-0 bg-gradient-to-t from-primary-900/80 to-transparent group-hover:from-primary-900/90 transition-all duration-500"
              >
                <Icon
                  :name="step.icon"
                  size="48"
                  class="absolute bottom-4 right-4 text-sky-400/80 transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            </div>
          </template>

          <template #title>
            <h3 class="text-2xl font-space text-white mb-2 relative z-10">
              {{ step.title }}
            </h3>
          </template>

          <template #content>
            <div
              class="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-40 transition-opacity duration-500"
              :class="step.color"
            ></div>
            <p class="text-gray-300 relative z-10">{{ step.description }}</p>
          </template>
        </PrimeCard>

        <!-- Card Glow -->
        <div
          class="absolute inset-0 bg-sky-500/5 group-hover:bg-sky-500/10 blur-xl transition-all duration-500 -z-10"
        ></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Ensure proper stacking */
.how-to-use-section {
  isolation: isolate;
}
</style>
