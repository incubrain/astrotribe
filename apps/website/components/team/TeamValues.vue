<script setup lang="ts">
import { ref } from 'vue'

// Team values data
const values = [
  {
    title: 'Knowledge Accessibility',
    description:
      'We believe astronomy should be accessible to everyone, regardless of background or location.',
    icon: 'mdi:book-open-page-variant',
    illustration: '/images/illustrations/astronomy-education.svg',
  },
  {
    title: 'Dark Sky Conservation',
    description:
      'Preserving our night skies is essential for both science and our connection to the cosmos.',
    icon: 'mdi:weather-night',
    illustration: '/images/illustrations/dark-sky.svg',
  },
  {
    title: 'Cultural Integration',
    description:
      'Astronomy bridges cultures and connects humanity through our shared celestial heritage.',
    icon: 'mdi:earth',
    illustration: '/images/illustrations/cultural-astronomy.svg',
  },
  {
    title: 'Sustainable Innovation',
    description: 'We pioneer sustainable approaches to astronomy education and astro-tourism.',
    icon: 'mdi:sprout',
    illustration: '/images/illustrations/sustainable-innovation.svg',
  },
]

// Active value for mobile view
const activeValueIndex = ref(0)

// Toggle active value for mobile
const setActiveValue = (index: number) => {
  activeValueIndex.value = index
}

const { stars, isClient } = useStarfield(30, 3)
</script>

<template>
  <section class="team-values-section py-20 relative overflow-hidden">
    <div class="wrapper relative z-10">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold mb-4 text-white">Our Guiding Stars</h2>
        <p class="text-xl text-primary-200 max-w-2xl mx-auto">
          The core values that drive our mission and shape our approach to astronomy education
        </p>
      </div>

      <!-- Desktop Values Display -->
      <div class="hidden lg:grid grid-cols-2 gap-8">
        <div
          v-for="(value, index) in values"
          :key="index"
          class="value-card"
        >
          <LandingGlass
            hover-effect="glow"
            glow-color="purple"
            gradient="mixed"
            intensity="medium"
            interactive
            class="h-full"
          >
            <div class="flex flex-col md:flex-row items-center gap-6 p-6">
              <!-- Illustration -->
              <div class="md:w-1/3 flex justify-center">
                <div class="w-32 h-32 relative">
                  <!-- Fallback image if SVG not available -->
                  <div
                    class="absolute inset-0 rounded-full bg-primary-800/50 flex items-center justify-center"
                  >
                    <Icon
                      :name="value.icon"
                      size="48"
                      class="text-primary-400"
                    />
                  </div>

                  <!-- SVG Illustration would go here -->
                  <!-- <img :src="value.illustration" :alt="value.title" class="w-full h-full object-contain" /> -->

                  <!-- Orbit decoration -->
                  <div
                    class="absolute inset-0 border border-primary-500/20 rounded-full animate-slow-spin"
                  ></div>
                  <div
                    class="absolute inset-2 border border-primary-500/10 rounded-full animate-reverse-spin"
                  ></div>

                  <!-- Small star decorations -->
                  <div
                    v-for="i in 3"
                    :key="i"
                    class="absolute w-2 h-2 bg-primary-400 rounded-full"
                    :style="{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animation: `pulse ${1 + Math.random()}s infinite alternate`,
                    }"
                  ></div>
                </div>
              </div>

              <!-- Text content -->
              <div class="md:w-2/3 text-center md:text-left">
                <h3 class="text-xl font-bold mb-3 text-white">{{ value.title }}</h3>
                <p class="text-primary-200">{{ value.description }}</p>
              </div>
            </div>
          </LandingGlass>
        </div>
      </div>

      <!-- Mobile Values Display (Tabs) -->
      <div class="lg:hidden">
        <!-- Value tabs -->
        <div class="flex overflow-x-auto no-scrollbar mb-6">
          <button
            v-for="(value, index) in values"
            :key="index"
            class="px-4 py-2 whitespace-nowrap text-sm transition-all duration-300"
            :class="[
              activeValueIndex === index
                ? 'bg-primary-700/50 text-white font-medium rounded-full border border-primary-500/30'
                : 'text-primary-300',
            ]"
            @click="setActiveValue(index)"
          >
            <div class="flex items-center gap-2">
              <Icon
                :name="value.icon"
                size="16"
              />
              <span>{{ value.title }}</span>
            </div>
          </button>
        </div>

        <!-- Active value card -->
        <LandingGlass
          hover-effect="glow"
          glow-color="purple"
          gradient="mixed"
          intensity="medium"
          class="p-6"
        >
          <div class="flex flex-col items-center text-center">
            <div class="w-28 h-28 relative mb-6">
              <div
                class="absolute inset-0 rounded-full bg-primary-800/50 flex items-center justify-center"
              >
                <Icon
                  :name="values[activeValueIndex].icon"
                  size="40"
                  class="text-primary-400"
                />
              </div>

              <!-- Orbit decoration -->
              <div
                class="absolute inset-0 border border-primary-500/20 rounded-full animate-slow-spin"
              ></div>
              <div
                class="absolute inset-2 border border-primary-500/10 rounded-full animate-reverse-spin"
              ></div>
            </div>

            <h3 class="text-xl font-bold mb-3 text-white">{{ values[activeValueIndex].title }}</h3>
            <p class="text-primary-200">{{ values[activeValueIndex].description }}</p>
          </div>
        </LandingGlass>
      </div>
    </div>

    <!-- Background stars -->
    <div class="absolute inset-0 bg-primary-950 opacity-30"></div>
    <div
      class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-primary-950/10 to-primary-950/0"
    ></div>

    <!-- Subtle parallax stars -->
    <div
      v-if="isClient"
      class="absolute inset-0"
    >
      <div
        v-for="star in stars"
        :key="star.id"
        class="absolute rounded-full bg-white"
        :style="star.style"
      ></div>
    </div>
  </section>
</template>

<style scoped>
.animate-slow-spin {
  animation: spin 20s linear infinite;
}

.animate-reverse-spin {
  animation: spin 15s linear infinite reverse;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.value-card {
  opacity: 0;
  transform: translateY(30px);
  animation: fadeIn 0.6s forwards cubic-bezier(0.215, 0.61, 0.355, 1);
}

.value-card:nth-child(1) {
  animation-delay: 0ms;
}

.value-card:nth-child(2) {
  animation-delay: 150ms;
}

.value-card:nth-child(3) {
  animation-delay: 300ms;
}

.value-card:nth-child(4) {
  animation-delay: 450ms;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


</style>
