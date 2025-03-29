<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Stats data with more astronomy-themed icons
const stats = [
  {
    value: '30+',
    label: 'Years Combined Experience',
    icon: 'mdi:telescope',
    description: 'Our team brings decades of astronomy expertise',
  },
  {
    value: '50+',
    label: 'Countries Reached',
    icon: 'mdi:globe-model',
    description: 'Serving astronomy enthusiasts worldwide',
  },
  {
    value: '10K+',
    label: 'Students Educated',
    icon: 'mdi:human-capacity-increase',
    description: 'Inspiring the next generation of astronomers',
  },
  {
    value: '25+',
    label: 'Major Events Organized',
    icon: 'mdi:star-shooting',
    description: 'Creating memorable astronomy experiences',
  },
]

// Animation states
const isVisible = ref(false)
const hasAnimated = ref(false)

const { stars, isClient } = useStarfield(30, 3)

// Intersection observer to trigger animations when section comes into view
onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !hasAnimated.value) {
        isVisible.value = true
        hasAnimated.value = true
      }
    },
    { threshold: 0.2 },
  )

  const element = document.querySelector('.team-stats-section')
  if (element) {
    observer.observe(element)
  }

  // Cleanup
  return () => {
    if (element) {
      observer.unobserve(element)
    }
  }
})
</script>

<template>
  <section class="team-stats-section py-16 relative overflow-hidden">
    <!-- Background elements -->
    <div class="absolute inset-0 bg-primary-950 opacity-60"></div>
    <div class="absolute inset-0 bg-noise opacity-20"></div>

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
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold mb-4 text-white">Our Cosmic Impact</h2>
        <p class="text-xl text-primary-200 max-w-2xl mx-auto">
          Together, our team is making astronomy education accessible worldwide
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div
          v-for="(stat, index) in stats"
          :key="index"
          class="stats-card"
          :class="[isVisible ? 'stats-visible' : 'stats-hidden']"
          :style="{ 'animation-delay': `${index * 150}ms` }"
        >
          <LandingGlass
            hover-effect="glow"
            glow-color="blue"
            gradient="mixed"
            intensity="low"
            interactive
            class="text-center p-6 h-full"
          >
            <div class="stats-icon-container mx-auto mb-4 flex items-center justify-center">
              <Icon
                :name="stat.icon"
                size="32"
                class="stats-icon"
              />
            </div>

            <div class="stat-value text-4xl font-bold text-white mb-2">{{ stat.value }}</div>
            <div class="stat-label text-primary-300 mb-2">{{ stat.label }}</div>
            <div class="stat-description text-sm text-primary-400">{{ stat.description }}</div>
          </LandingGlass>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes twinkle {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

.bg-noise {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}

.stats-card {
  transition: all 0.6s cubic-bezier(0.215, 0.61, 0.355, 1);
}

.stats-hidden {
  opacity: 0;
  transform: translateY(40px);
}

.stats-visible {
  opacity: 1;
  transform: translateY(0);
}

.stats-icon-container {
  width: 70px;
  height: 70px;
  background-color: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 9999px;
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.1);
  transition: all 0.3s ease;
}

.stats-icon {
  color: rgba(255, 255, 255, 0.8);
}

LandingGlass:hover .stats-icon-container {
  background-color: rgba(59, 130, 246, 0.15);
  transform: translateY(-5px);
}

.stat-value {
  background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
