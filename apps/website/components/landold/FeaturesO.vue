<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Features data
const features = ref([
  {
    id: 1,
    title: 'AstroQuery AI',
    description:
      'Ask complex astronomy questions and get accurate, research-backed answers instantly.',
    icon: 'mdi:brain',
    image: '/images/hero-image.jpg',
    color: 'from-blue-500 to-primary-600',
  },
  {
    id: 2,
    title: 'Knowledge Clusters',
    description:
      'Organize your research, compare ideas, and discover similar work from the astronomy community.',
    icon: 'mdi:graph',
    image: '/images/hero-image.jpg',
    color: 'from-purple-500 to-blue-500',
  },
  {
    id: 3,
    title: 'Research Context',
    description:
      'Add papers and datasets to your queries for highly specific answers based on your own research.',
    icon: 'mdi:book-open-page-variant',
    image: '/images/hero-image.jpg',
    color: 'from-primary-600 to-cyan-500',
  },
  {
    id: 4,
    title: 'Idea Novelty Analysis',
    description:
      'Automatically evaluate your research ideas against existing literature to identify unique opportunities.',
    icon: 'mdi:lightbulb',
    image: '/images/hero-image.jpg',
    color: 'from-orange-500 to-pink-500',
  },
])

onMounted(() => {
  if (import.meta.client) {
    gsap.registerPlugin(ScrollTrigger)

    // Animate feature cards
    gsap.from('.feature-card', {
      y: 50,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      scrollTrigger: {
        trigger: '.features-grid',
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
        title="Explore The Universe"
        subtitle="More than just a news platform"
        gradient
      />

      <div class="features-grid grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <div
          v-for="feature in features"
          :key="feature.id"
          class="feature-card group relative"
        >
          <!-- Card with glass effect -->
          <div
            class="relative h-full overflow-hidden rounded-xl bg-slate-900/30 backdrop-blur-sm border border-slate-800/50 transition-all duration-500 hover:border-primary-600/30"
          >
            <!-- Hover gradient -->
            <div
              class="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-xl"
              :class="feature.color"
            ></div>

            <!-- Content -->
            <div class="relative z-10 p-8">
              <!-- Icon in gradient circle -->
              <div
                class="mb-6 w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br shadow-lg"
                :class="feature.color"
              >
                <Icon
                  :name="feature.icon"
                  class="text-white"
                  size="28"
                />
              </div>

              <!-- Title & Description - FIXED (Moved Inside v-for) -->
              <h3 class="text-xl font-bold text-white mb-3">{{ feature.title }}</h3>
              <p class="text-gray-300 mb-6">{{ feature.description }}</p>

              <!-- Interface Preview -->
              <div
                class="relative rounded-lg overflow-hidden border border-slate-700 group-hover:border-primary-600/30 transition-all duration-300"
              >
                <img
                  :src="feature.image"
                  :alt="feature.title"
                  class="w-full h-48 object-cover"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent opacity-60"
                ></div>

                <div class="absolute bottom-3 right-3">
                  <PrimeButton
                    size="small"
                    class="text-xs bg-primary-600/90 hover:bg-primary-600 transition-colors"
                  >
                    Learn More
                    <Icon
                      name="mdi:arrow-right"
                      class="ml-1"
                      size="14"
                    />
                  </PrimeButton>
                </div>
              </div>
            </div>

            <!-- Card Glow -->
            <div
              class="absolute inset-0 bg-primary-600/5 group-hover:bg-primary-600/10 blur-xl transition-all duration-500 -z-10 rounded-xl"
            ></div>
          </div>
        </div>
      </div>

      <!-- CTA button -->
      <div class="mt-12 text-center">
        <PrimeButton
          size="large"
          class="bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-500 hover:to-blue-500 transition-all duration-300"
        >
          Explore All Features
          <Icon
            name="mdi:telescope"
            class="ml-2"
            size="20"
          />
        </PrimeButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.feature-card {
  transform: translateY(0);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}
</style>
