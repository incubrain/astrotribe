<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAnimation } from '~/composables/useAnimation'

// Get the counter animation function
const { animateCounter } = useAnimation()

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

// Filter tabs for news categories
const categories = ref([
  { id: 'all', name: 'All News' },
  { id: 'research', name: 'Research', icon: 'mdi:microscope' },
  { id: 'missions', name: 'Missions', icon: 'mdi:rocket-launch' },
  { id: 'discoveries', name: 'Discoveries', icon: 'mdi:star' },
  { id: 'companies', name: 'Companies', icon: 'mdi:domain' },
])

const activeCategory = ref('all')

// Animation definitions for consistent use throughout the section
const sectionAnimation = {
  initial: { opacity: 0, y: 50 },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
    },
  },
}

const fadeAnimation = {
  initial: { opacity: 0 },
  enter: {
    opacity: 1,
    transition: {
      type: 'spring',
      duration: 800,
    },
  },
}

onMounted(() => {
  if (import.meta.client) {
    // Animate counters using our dedicated counter animation function
    animateCounter('.stat-counter', {
      duration: 1500,
      delay: 200,
      stagger: 0.1,
    })
  }
})
</script>

<template>
  <section
    id="news"
    class="news-section py-20 relative"
  >
    <!-- Background with subtle gradient -->
    <div class="absolute inset-0 bg-gradient-to-b from-slate-950 to-slate-900 z-0"></div>

    <div class="wrapper relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section header with gradient text -->
      <div
        v-motion
        :initial="sectionAnimation.initial"
        :enter="sectionAnimation.enter"
        class="text-center section-title mb-12"
      >
        <h2
          class="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 to-primary-600 bg-clip-text text-transparent inline-block mb-4"
        >
          Global Space News
        </h2>
        <p class="text-xl text-gray-300 max-w-3xl mx-auto">
          The only newsfeed you need to stay updated on the latest space discoveries
        </p>
      </div>

      <!-- Stats container -->
      <div
        v-motion="fadeAnimation"
        class="stats-container flex flex-wrap justify-center items-center gap-x-12 gap-y-6 mb-12 py-6 border-y border-primary-900/50"
      >
        <div
          v-for="(stat, idx) in stats"
          :key="idx"
          class="text-center flex flex-col items-center"
        >
          <div class="mb-2 p-2 rounded-full bg-primary-900/30 border border-primary-800/30">
            <Icon
              :name="stat.icon"
              class="text-primary-600"
              size="24"
            />
          </div>
          <div class="flex items-center">
            <span
              class="stat-counter text-3xl font-bold text-white"
              :data-value="stat.value"
            >
              0
            </span>
            <span
              v-if="stat.suffix"
              class="text-2xl font-bold text-white"
              >{{ stat.suffix }}</span
            >
          </div>
          <p class="text-sm text-gray-400">{{ stat.label }}</p>
        </div>
      </div>

      <!-- Category filter tabs -->
      <div class="category-filters flex flex-wrap justify-center mb-10 gap-2">
        <button
          v-for="(category, index) in categories"
          :key="category.id"
          v-motion
          :initial="{ opacity: 0 }"
          :visibleOnce="{
            opacity: 1,
            transition: { delay: 0.2 + index * 0.05 },
          }"
          class="category-filter px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300 text-sm"
          :class="
            activeCategory === category.id
              ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/30'
              : 'bg-slate-800/70 text-gray-300 hover:bg-slate-700/70'
          "
          @click="activeCategory = category.id"
        >
          <Icon
            v-if="category.icon"
            :name="category.icon"
            size="16"
          />
          <span>{{ category.name }}</span>
        </button>
      </div>

      <!-- News interface mockup -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visibleOnce="{
          opacity: 1,
          y: 0,
          transition: {
            type: 'spring',
            delay: 0.2,
          },
        }"
        class="news-interface mb-12 relative bg-slate-900/80 rounded-xl shadow-xl shadow-primary-900/20 border border-primary-800/20 overflow-hidden p-4"
      >
        <div class="flex items-center space-x-4 mb-4">
          <div class="h-10 w-10 rounded-full bg-primary-600/20 flex items-center justify-center">
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

          <!-- View toggle buttons -->
          <div class="ml-auto">
            <div class="flex items-center gap-2">
              <div class="p-1.5 rounded-md bg-primary-800/60 cursor-pointer">
                <Icon
                  name="mdi:view-grid"
                  class="text-primary-600"
                  size="18"
                />
              </div>
              <div
                class="p-1.5 rounded-md bg-slate-800/60 cursor-pointer hover:bg-primary-900/60 transition-colors duration-300"
              >
                <Icon
                  name="mdi:view-list"
                  class="text-gray-400"
                  size="18"
                />
              </div>
              <div
                class="p-1.5 rounded-md bg-slate-800/60 cursor-pointer hover:bg-primary-900/60 transition-colors duration-300"
              >
                <Icon
                  name="mdi:tune"
                  class="text-gray-400"
                  size="18"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Search bar -->
        <div class="flex items-center mb-6 border-b border-primary-800/20 pb-4">
          <div
            class="bg-slate-800/60 rounded-l-md py-2.5 px-3 border border-primary-800/20 flex items-center flex-1"
          >
            <Icon
              name="mdi:magnify"
              class="text-gray-400 mr-2"
              size="20"
            />
            <span class="text-gray-500 text-sm">Search astronomy news, papers, events...</span>
          </div>
          <div
            class="bg-primary-800/80 hover:bg-primary-700 cursor-pointer transition-colors duration-300 rounded-r-md py-2.5 px-4 border-t border-r border-b border-primary-800/20"
          >
            <Icon
              name="mdi:filter-variant"
              class="text-primary-400"
              size="20"
            />
          </div>
        </div>
      </div>

      <!-- News cards grid -->
      <div class="news-grid grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="(item, index) in newsItems"
          :key="item.id"
          v-motion
          :initial="{ opacity: 0, y: 50 }"
          :visibleOnce="{
            opacity: 1,
            y: 0,
            transition: {
              type: 'spring',
              delay: 0.4 + index * 0.15,
            },
          }"
          class="news-card group transform transition-all duration-300 hover:-translate-y-2"
        >
          <!-- Card with glass effect -->
          <div
            class="h-full bg-slate-900/70 backdrop-blur-sm border border-primary-800/20 rounded-lg overflow-hidden shadow-lg hover:shadow-primary-900/30 transition-all duration-300"
          >
            <!-- Image container -->
            <div class="h-48 overflow-hidden relative">
              <img
                :src="item.image"
                :alt="item.title"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <!-- Category badge -->
              <div class="absolute top-3 right-3">
                <span
                  class="bg-slate-800/90 text-primary-500 text-xs px-3 py-1 rounded-full border border-primary-800/30 backdrop-blur-sm"
                >
                  {{ item.category }}
                </span>
              </div>

              <!-- Image overlay gradient -->
              <div
                class="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-70"
              ></div>
            </div>

            <!-- Content container -->
            <div class="p-5">
              <!-- Metadata row -->
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

              <!-- Title -->
              <h3
                class="text-lg font-medium text-white group-hover:text-primary-500 transition-colors mb-2"
              >
                {{ item.title }}
              </h3>

              <!-- Description -->
              <p class="text-gray-400 text-sm mb-4">
                {{ item.description }}
              </p>

              <!-- Action button -->
              <div class="flex justify-end">
                <PrimeButton
                  outlined
                  size="small"
                  class="text-xs border-primary-700 text-primary-600 hover:border-primary-600 hover:bg-primary-900/30 transition-colors duration-300"
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
      </div>

      <!-- View more button -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visibleOnce="{
          opacity: 1,
          y: 0,
          transition: {
            type: 'spring',
            delay: 0.8,
          },
        }"
        class="mt-10 text-center"
      >
        <PrimeButton
          class="view-more-button bg-primary-700 hover:bg-primary-600 shadow-md shadow-primary-900/20 transition-all duration-300"
        >
          View All Space News
          <Icon
            name="mdi:chevron-right"
            class="ml-1"
            size="18"
          />
        </PrimeButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.news-card {
  will-change: transform;
}

/* Add subtle hover effect to cards */
.news-card:hover {
  box-shadow: 0 15px 30px -10px rgba(var(--primary-600-rgb), 0.15);
}
</style>
