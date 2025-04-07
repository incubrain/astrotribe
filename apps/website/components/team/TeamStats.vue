<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Stats data with astronomy-themed icons
const stats = [
  {
    value: '30+',
    dataValue: 30,
    label: 'Years Combined Experience',
    icon: 'mdi:telescope',
    description: 'Our team brings decades of astronomy and business expertise',
  },
  {
    value: '50+',
    dataValue: 50,
    label: 'Countries Reached',
    icon: 'mdi:globe-model',
    description: 'Serving astronomy enthusiasts worldwide',
  },
  {
    value: '7K+',
    dataValue: 7000,
    label: 'Students Educated',
    icon: 'mdi:human-capacity-increase',
    description: 'Inspiring the next generation of astronomers',
  },
  {
    value: '25+',
    dataValue: 10000,
    label: 'Minds Inspired',
    icon: 'mdi:star-shooting',
    description: 'We\'ve taken our telescopes all around India and beyond',
  },
]

// Intersection observer for animations
const statsSection = ref(null)
const isIntersecting = ref(false)

const { stars, isClient } = useStarfield(30, 3)
const { animateCounter } = useAnimation()

onMounted(() => {
  if (!import.meta.client) return

  // Create intersection observer
  const observer = new IntersectionObserver(
    (entries) => {
      const [entry] = entries
      isIntersecting.value = entry.isIntersecting

      if (entry.isIntersecting) {
        // Animate counter when in view
        animateCounter('.counter-value', {
          duration: 2000,
          stagger: 0.2,
        })

        // Unobserve after animation starts
        observer.unobserve(entry.target)
      }
    },
    { threshold: 0.1 },
  )

  // Start observing
  if (statsSection.value) {
    observer.observe(statsSection.value)
  }
})
</script>

<template>
  <section
    ref="statsSection"
    class="team-stats-section py-16 relative overflow-hidden"
  >
    <!-- Background elements -->
    <div class="absolute inset-0 bg-primary-950/60"></div>

    <!-- Subtle star background -->
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

    <div class="wrapper relative z-10">
      <div
        v-motion
        class="text-center mb-12"
        :initial="{ opacity: 0, y: 20 }"
        :visible="{ opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } }"
      >
        <h2 class="text-3xl md:text-4xl font-bold mb-4 text-white">Our Cosmic Impact</h2>
        <p class="text-xl text-primary-200 max-w-2xl mx-auto">
          Together, our team is making astronomy education accessible worldwide
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div
          v-for="(stat, index) in stats"
          :key="index"
          v-motion
          class="stats-card"
          :initial="{ opacity: 0, y: 30 }"
          :visible="{
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 200, damping: 20, delay: index * 0.1 },
          }"
        >
          <div
            class="text-center p-6 h-full border border-primary-700/30 rounded-lg bg-primary-900/30 backdrop-blur-sm transition-all duration-300 hover:border-primary-600/30 hover:shadow-[0_0_15px_rgba(102,126,234,0.05)]"
          >
            <div
              class="stats-icon-container mx-auto mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-primary-800/50 border border-primary-600/30"
            >
              <Icon
                :name="stat.icon"
                size="32"
                class="text-primary-300"
              />
            </div>

            <div
              class="counter-value text-4xl font-bold text-white mb-2"
              :data-value="stat.dataValue"
              >{{ stat.value }}</div
            >
            <div class="stat-label text-primary-300 font-semibold mb-2">{{ stat.label }}</div>
            <div class="stat-description text-sm text-primary-400">{{ stat.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stats-icon-container {
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.1);
  transition: all 0.3s ease;
}

.counter-value {
  background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
