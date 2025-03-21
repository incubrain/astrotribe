<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// News data
const newsItems = ref([
  {
    id: 1,
    title: 'JWST Discovers Potential Ocean World in Nearby Star System',
    description:
      'New observations suggest the presence of water vapor in the atmosphere of an exoplanet orbiting around a star just 40 light-years from Earth.',
    source: 'NASA',
    date: '2 hours ago',
    category: 'Research',
    image: '/images/hero-image.jpg',
  },
  {
    id: 2,
    title: 'SpaceX Successfully Launches Starship on Fifth Test Flight',
    description:
      'The latest test of the fully integrated Starship and Super Heavy booster achieved multiple mission objectives including controlled descent.',
    source: 'SpaceX',
    date: '1 day ago',
    category: 'Companies',
    image: '/images/hero-image.jpg',
  },
  {
    id: 3,
    title: 'New Study Suggests Dark Matter May Have Different Properties Than Expected',
    description:
      'Researchers comparing galaxy rotation curves find inconsistencies with current dark matter models, suggesting new physics may be needed.',
    source: 'Nature Astronomy',
    date: '3 days ago',
    category: 'Research',
    image: '/images/hero-image.jpg',
  },
])

const stats = ref([
  { value: 50, label: 'News Sources', icon: 'mdi:newspaper' },
  { value: 24, suffix: '/7', label: 'Updates', icon: 'mdi:update' },
  { value: 5, label: 'Categories', icon: 'mdi:format-list-bulleted-type' },
])

onMounted(() => {
  if (import.meta.client) {
    gsap.registerPlugin(ScrollTrigger)

    // Animate news cards
    gsap.from('.news-card', {
      y: 50,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      scrollTrigger: {
        trigger: '.news-grid',
        start: 'top bottom-=100px',
      },
    })

    // Animate stats counters
    gsap.from('.stat-value', {
      textContent: 0,
      duration: 2,
      ease: 'power1.out',
      snap: { textContent: 1 },
      stagger: 0.2,
      scrollTrigger: {
        trigger: '.stats-grid',
        start: 'top bottom-=100px',
      },
    })
  }
})
</script>

<template>
  <section class="py-16 md:py-24 wrapper">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <LandTitle
        title="Global Space News"
        subtitle="The only newsfeed you need to stay updated on the latest space discoveries"
        gradient
      />

      <!-- Stats bar -->
      <div class="stats-grid grid grid-cols-3 gap-8 my-12">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="text-center"
        >
          <div class="flex items-center justify-center mb-2">
            <div class="p-3 rounded-full bg-primary-600/10 border border-primary-600/30">
              <Icon
                :name="stat.icon"
                class="text-primary-600"
                size="24"
              />
            </div>
          </div>
          <div class="flex items-center justify-center">
            <h3
              class="stat-value text-3xl md:text-4xl font-bold text-white mb-1"
              :data-target="stat.value"
            >
              {{ stat.value }}
            </h3>
            <span
              v-if="stat.suffix"
              class="text-2xl font-bold text-white ml-1"
              >{{ stat.suffix }}</span
            >
          </div>
          <p class="text-gray-400">{{ stat.label }}</p>
        </div>
      </div>

      <!-- News section -->
      <div class="relative">
        <!-- News interface mockup -->
        <div class="mb-12 relative">
          <div class="absolute inset-0 bg-primary-600/5 blur-xl"></div>
          <div class="relative border border-primary-600/20 rounded-xl overflow-hidden p-1">
            <div class="bg-slate-900/80 rounded-lg p-4">
              <div class="flex items-center space-x-4 mb-4">
                <div
                  class="h-10 w-10 rounded-full bg-primary-600/20 flex items-center justify-center"
                >
                  <Icon
                    name="mdi:satellite-variant"
                    class="text-primary-600"
                    size="20"
                  />
                </div>
                <div>
                  <h3 class="text-lg font-medium text-white">AstroQuery News Interface</h3>
                  <p class="text-gray-400 text-sm">Personalized space news dashboard</p>
                </div>
                <div class="ml-auto">
                  <div class="flex items-center gap-2">
                    <div class="p-1 rounded-md bg-primary-900/60 cursor-pointer">
                      <Icon
                        name="mdi:cards-outline"
                        class="text-primary-600"
                        size="20"
                      />
                    </div>
                    <div class="p-1 rounded-md bg-primary-900/60 cursor-pointer">
                      <Icon
                        name="mdi:view-list"
                        class="text-gray-400"
                        size="20"
                      />
                    </div>
                    <div class="p-1 rounded-md bg-primary-900/60 cursor-pointer">
                      <Icon
                        name="mdi:tune-vertical"
                        class="text-gray-400"
                        size="20"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Search and filter mockup -->
              <div class="flex items-center mb-6 border-b border-primary-600/20 pb-4">
                <div
                  class="bg-primary-900/60 rounded-l-md py-2 px-3 border border-primary-600/20 flex items-center flex-1"
                >
                  <Icon
                    name="mdi:magnify"
                    class="text-gray-400 mr-2"
                    size="20"
                  />
                  <span class="text-gray-500">Search astronomy news, papers, events...</span>
                </div>
                <div
                  class="bg-primary-800 rounded-r-md py-2 px-4 border-t border-r border-b border-primary-600/20"
                >
                  <Icon
                    name="mdi:filter-variant"
                    class="text-primary-600"
                    size="20"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- News cards grid -->
        <div class="news-grid grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="item in newsItems"
            :key="item.id"
            class="news-card bg-slate-900/50 border border-primary-600/20 rounded-lg overflow-hidden shadow-lg hover:shadow-primary-600/10 transition-all duration-300 group"
          >
            <div class="h-48 overflow-hidden relative">
              <img
                :src="item.image"
                :alt="item.title"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div class="absolute top-2 right-2">
                <span class="bg-primary-800/90 text-primary-600 text-xs px-2 py-1 rounded-full">
                  {{ item.category }}
                </span>
              </div>
              <div
                class="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-50"
              ></div>
            </div>
            <div class="p-5">
              <div class="flex items-center justify-between text-xs text-gray-400 mb-2">
                <span class="flex items-center">
                  <Icon
                    name="mdi:source-repository"
                    class="mr-1"
                    size="14"
                  />
                  {{ item.source }}
                </span>
                <span>{{ item.date }}</span>
              </div>
              <h3
                class="text-lg font-medium text-white group-hover:text-primary-600 transition-colors mb-2"
              >
                {{ item.title }}
              </h3>
              <p class="text-gray-400 text-sm mb-4">
                {{ item.description }}
              </p>
              <div class="flex justify-end">
                <PrimeButton
                  outlined
                  size="small"
                  class="text-xs"
                >
                  Read More
                  <Icon
                    name="mdi:arrow-right"
                    class="ml-1"
                    size="14"
                  />
                </PrimeButton>
              </div>
            </div>
          </div>
        </div>

        <!-- View more button -->
        <div class="mt-8 text-center">
          <PrimeButton class="bg-primary-600 hover:bg-primary-700 transition-colors">
            View All Space News
            <Icon
              name="mdi:chevron-right"
              class="ml-1"
              size="18"
            />
          </PrimeButton>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.news-card {
  transform: translateY(0);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.news-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px -5px rgba(var(--primary-600-rgb), 0.15);
}
</style>
