<script setup lang="ts">
import { ref } from 'vue'
import { useAnimation } from '~/composables/useAnimation'

const { conf: motionConstants } = useAnimation()

// Dashboard features/capabilities
const capabilities = ref([
  {
    icon: 'mdi:format-list-checks',
    text: 'Create custom feed from 20+ astronomy categories',
    color: 'from-blue-500 to-primary-600',
  },
  {
    icon: 'mdi:bookmark-multiple',
    text: 'Save searches and create research collections',
    color: 'from-indigo-500 to-violet-600',
  },
  {
    icon: 'mdi:account-group',
    text: 'Follow space agencies, researchers, and companies',
    color: 'from-primary-600 to-cyan-600',
  },
  {
    icon: 'mdi:bell-ring',
    text: 'Set alerts for mission updates and astronomical events',
    color: 'from-violet-600 to-purple-600',
  },
  {
    icon: 'mdi:graph',
    text: 'Track research trends and citation metrics',
    color: 'from-cyan-600 to-blue-600',
  },
  {
    icon: 'mdi:share-variant',
    text: 'Share discoveries with your network',
    color: 'from-purple-600 to-primary-600',
  },
])

// Simulated dashboard stats
const stats = ref({
  papers: '1M+',
  sources: '50+',
  updates: '24/7',
  categories: '20+',
})

// Dashboard tabs
const tabs = ref([
  { id: 'feed', label: 'Feed', icon: 'mdi:view-dashboard' },
  { id: 'research', label: 'Research', icon: 'mdi:book-open-page-variant' },
  { id: 'collections', label: 'Collections', icon: 'mdi:folder-multiple' },
  { id: 'alerts', label: 'Alerts', icon: 'mdi:bell' },
  { id: 'settings', label: 'Settings', icon: 'mdi:cog' },
])
const activeTab = ref('feed')

// Recent articles for dashboard preview
const articles = ref([
  {
    id: 1,
    title: 'JWST Discovers Potential Ocean World in Nearby Star System',
    description: 'New observations suggest the presence of water vapor...',
    category: 'Research',
    categoryColor: 'blue',
    image: '/images/hero-image.jpg',
  },
  {
    id: 2,
    title: 'Mars Rover Discovers Ancient Riverbed',
    source: 'NASA',
    sourceColor: 'primary',
    image: '/images/hero-image.jpg',
  },
  {
    id: 3,
    title: 'Gaia Mission Maps 2 Billion Stars',
    source: 'ESA',
    sourceColor: 'indigo',
    image: '/images/hero-image.jpg',
  },
])

// Search terms for dashboard
const searchTerms = ref([
  { text: 'Exoplanet atmospheres' },
  { text: 'JWST deep field' },
  { text: 'Quantum gravity research' },
])
</script>

<template>
  <section
    id="dashboard"
    class="dashboard-section py-20 md:py-28 relative overflow-hidden"
  >
    <!-- Dark background overlay with subtle noise texture -->
    <div class="absolute inset-0 bg-slate-950 z-0 opacity-95"></div>

    <!-- Noise texture -->
    <div class="absolute inset-0 bg-[url('/patterns/noise-pattern.svg')] opacity-5 z-0"></div>

    <!-- Subtle grid overlay -->
    <div class="absolute inset-0 bg-[url('/patterns/grid-pattern.svg')] opacity-3 z-0"></div>

    <!-- Glowing orbs -->
    <div class="absolute top-20 right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
    <div class="absolute -left-20 bottom-0 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl"></div>
    <div class="absolute top-1/4 left-1/3 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl"></div>

    <div class="wrapper relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visibleOnce="{
          opacity: 1,
          y: 0,
          transition: {
            type: 'spring',
            stiffness: 250,
            damping: 20,
          },
        }"
        class="text-left max-w-xl mb-16"
      >
        <div class="flex items-center gap-2 mb-3">
          <div class="h-px w-8 bg-primary-600"></div>
          <span class="text-primary-600 uppercase text-sm font-medium tracking-wider"
            >Space Research</span
          >
        </div>
        <h2 class="text-3xl md:text-5xl font-bold mb-4 text-white leading-tight">
          Your
          <span class="bg-gradient-to-r from-blue-500 to-primary-600 bg-clip-text text-transparent"
            >Space Intelligence</span
          >
          <span class="inline-block">Platform</span>
        </h2>
        <p class="text-xl text-gray-300"
          >Personalized to your cosmic interests with intelligent features for modern researchers</p
        >
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10 items-start">
        <!-- Left column with features and stats -->
        <div
          v-motion
          :initial="{ opacity: 0, x: -50 }"
          :visibleOnce="{
            opacity: 1,
            x: 0,
            transition: { type: 'spring', stiffness: 150, damping: 25 },
          }"
          class="lg:col-span-2 space-y-8"
        >
          <!-- Dashboard capabilities list -->
          <div
            class="capabilities-list p-6 bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl"
          >
            <h3 class="text-lg font-medium text-white mb-6 flex items-center">
              <Icon
                name="mdi:rocket-launch"
                class="mr-2 text-primary-600"
                size="18"
              />
              Platform Capabilities
            </h3>

            <div class="space-y-5">
              <div
                v-for="(capability, index) in capabilities"
                :key="index"
                v-motion
                :initial="{ opacity: 0, x: -20 }"
                :visibleOnce="{
                  opacity: 1,
                  x: 0,
                  transition: {
                    delay: 0.1 + index * 0.08,
                    type: 'spring',
                    stiffness: 200,
                    damping: 20,
                  },
                }"
                class="capability-item flex items-start gap-3 group cursor-pointer p-2 rounded-lg transition-all duration-300 hover:bg-slate-800/70"
              >
                <!-- Icon with gradient background -->
                <div class="flex-shrink-0 mt-0.5">
                  <div
                    class="w-8 h-8 rounded-lg bg-gradient-to-br shadow-lg shadow-primary-900/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    :class="capability.color"
                  >
                    <Icon
                      :name="capability.icon"
                      class="text-white"
                      size="16"
                    />
                  </div>
                </div>

                <!-- Text -->
                <div>
                  <p
                    class="text-sm text-gray-300 group-hover:text-white transition-colors duration-300"
                  >
                    {{ capability.text }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Dashboard stats -->
          <div class="stats-grid grid grid-cols-2 gap-4">
            <div
              v-for="(value, key, index) in stats"
              :key="key"
              v-motion
              :initial="{ opacity: 0, y: 20 }"
              :visibleOnce="{
                opacity: 1,
                y: 0,
                transition: {
                  delay: 0.3 + index * 0.1,
                  type: 'spring',
                  stiffness: 150,
                  damping: 15,
                },
              }"
              class="stat-item relative backdrop-blur-sm bg-slate-900/30 border border-slate-800/40 rounded-lg p-4 group hover:border-primary-700/30 transition-all duration-300 hover:bg-slate-800/50"
            >
              <!-- Background glow effect -->
              <div
                class="absolute inset-0 bg-gradient-to-b from-primary-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg blur-md"
              ></div>

              <!-- Stat content -->
              <div class="relative z-10">
                <h4 class="text-2xl font-bold text-white mb-1">{{ value }}</h4>
                <p class="text-xs text-gray-400 capitalize">{{ key }}</p>
              </div>
            </div>
          </div>

          <!-- CTA button -->
          <div
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :visibleOnce="{
              opacity: 1,
              y: 0,
              transition: { delay: 0.4, type: 'spring', stiffness: 200, damping: 20 },
            }"
          >
            <div class="p-0.5 rounded-md bg-gradient-to-r from-primary-600 to-blue-600">
              <PrimeButton
                class="w-full border-none bg-slate-900 hover:bg-slate-800/80 text-white transition-all duration-300 font-medium py-2.5"
              >
                Try the Dashboard
                <Icon
                  name="mdi:arrow-right"
                  class="ml-2"
                  size="18"
                />
              </PrimeButton>
            </div>
          </div>
        </div>

        <!-- Right side with dashboard mockup -->
        <div
          v-motion
          :initial="{ opacity: 0, y: 40, scale: 0.95 }"
          :visibleOnce="{
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { delay: 0.2, type: 'spring', stiffness: 100, damping: 15 },
          }"
          class="dashboard-mockup lg:col-span-3 relative"
        >
          <!-- Glow effect behind dashboard -->
          <div
            class="absolute -inset-3 bg-gradient-to-tr from-primary-600/10 to-blue-500/10 rounded-xl blur-xl"
          ></div>

          <!-- Dashboard container -->
          <div
            class="relative rounded-xl overflow-hidden border border-primary-800/30 shadow-xl shadow-primary-900/20 bg-slate-900/70 backdrop-blur-md"
          >
            <!-- Top navigation bar -->
            <div class="bg-slate-800/90 border-b border-slate-700/70 px-4 py-3 flex items-center">
              <div class="flex items-center space-x-3">
                <div class="w-3 h-3 rounded-full bg-red-500"></div>
                <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div class="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div class="mx-auto font-medium text-white">AstroQuery Dashboard</div>
              <div class="flex items-center gap-3">
                <Icon
                  name="mdi:account-circle"
                  class="text-gray-400 hover:text-gray-300 transition-colors duration-300 cursor-pointer"
                  size="20"
                />
                <Icon
                  name="mdi:bell-outline"
                  class="text-gray-400 hover:text-gray-300 transition-colors duration-300 cursor-pointer"
                  size="20"
                />
              </div>
            </div>

            <!-- Dashboard tabs -->
            <div
              class="bg-slate-900/90 border-b border-slate-700/70 px-4 py-2 flex items-center overflow-x-auto no-scrollbar"
            >
              <div
                v-for="(tab, index) in tabs"
                :key="tab.id"
                v-motion
                :initial="{ opacity: 0, y: 10 }"
                :visibleOnce="{
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: 0.3 + index * 0.05,
                    type: 'spring',
                    stiffness: 200,
                    damping: 25,
                  },
                }"
                class="px-3 py-2 flex items-center gap-2 rounded-md text-sm mr-2 cursor-pointer transition-colors duration-300"
                :class="
                  activeTab === tab.id
                    ? 'bg-primary-900/40 text-primary-500 border border-primary-700/30'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-slate-800/60 border border-transparent'
                "
                @click="activeTab = tab.id"
              >
                <Icon
                  :name="tab.icon"
                  size="16"
                />
                <span>{{ tab.label }}</span>
              </div>

              <div class="ml-auto flex items-center">
                <div
                  class="bg-slate-800/90 rounded-md flex items-center px-2 py-1.5 border border-slate-700/70"
                >
                  <Icon
                    name="mdi:magnify"
                    class="text-gray-400 mr-1.5"
                    size="16"
                  />
                  <span class="text-xs text-gray-500">Search space research...</span>
                </div>
              </div>
            </div>

            <!-- Dashboard content -->
            <div class="p-4 bg-slate-900/90">
              <!-- Feed header -->
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-base font-medium text-white flex items-center">
                  <span class="mr-2">Your Space Feed</span>
                  <span
                    class="text-xs px-1.5 py-0.5 bg-primary-900/40 text-primary-500 rounded-full border border-primary-700/30"
                  >
                    24 new
                  </span>
                </h3>
                <div class="flex items-center gap-2">
                  <div
                    class="p-1.5 rounded-md bg-slate-800/90 border border-slate-700/70 cursor-pointer hover:bg-primary-900/40 transition-colors duration-300"
                  >
                    <Icon
                      name="mdi:refresh"
                      class="text-gray-400"
                      size="16"
                    />
                  </div>
                  <div
                    class="p-1.5 rounded-md bg-slate-800/90 border border-slate-700/70 cursor-pointer hover:bg-primary-900/40 transition-colors duration-300"
                  >
                    <Icon
                      name="mdi:filter-variant"
                      class="text-gray-400"
                      size="16"
                    />
                  </div>
                </div>
              </div>

              <!-- Feed content mock -->
              <div class="grid grid-cols-4 gap-4">
                <!-- Main article card -->
                <div
                  v-motion
                  :initial="{ opacity: 0, y: 20 }"
                  :visibleOnce="{
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: 0.4,
                      type: 'spring',
                      stiffness: 200,
                      damping: 20,
                    },
                  }"
                  class="col-span-4 bg-slate-800/60 rounded-lg overflow-hidden border border-slate-700/70 group hover:border-primary-700/30 transition-all duration-300"
                >
                  <div class="relative h-44 overflow-hidden">
                    <img
                      :src="articles[0].image"
                      :alt="articles[0].title"
                      class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div
                      class="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-80"
                    ></div>
                    <div class="absolute top-2 right-2">
                      <span
                        class="text-xs px-2 py-1 rounded-full border backdrop-blur-sm"
                        :class="`bg-${articles[0].categoryColor}-600/30 text-${articles[0].categoryColor}-400 border-${articles[0].categoryColor}-700/30`"
                      >
                        {{ articles[0].category }}
                      </span>
                    </div>
                    <div class="absolute bottom-0 left-0 right-0 p-4">
                      <h4 class="text-white font-medium">{{ articles[0].title }}</h4>
                      <p class="text-gray-300 text-sm mt-1">{{ articles[0].description }}</p>
                    </div>
                  </div>
                </div>

                <!-- Smaller article cards -->
                <div
                  v-for="(article, index) in articles.slice(1)"
                  :key="article.id"
                  v-motion
                  :initial="{ opacity: 0, y: 20 }"
                  :visibleOnce="{
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: 0.4 + index * 0.1,
                      type: 'spring',
                      stiffness: 200,
                      damping: 20,
                    },
                  }"
                  class="col-span-2 bg-slate-800/60 rounded-lg overflow-hidden border border-slate-700/70 p-3 group hover:border-primary-700/30 transition-all duration-300"
                >
                  <div class="flex items-start gap-3">
                    <div class="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
                      <img
                        :src="article.image"
                        :alt="article.title"
                        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div>
                      <span
                        class="text-xs px-2 py-0.5 rounded-full border text-xs backdrop-blur-sm"
                        :class="`bg-${article.sourceColor}-600/30 text-${article.sourceColor}-400 border-${article.sourceColor}-700/30`"
                      >
                        {{ article.source }}
                      </span>
                      <h5 class="text-white text-sm font-medium mt-1 line-clamp-2">{{
                        article.title
                      }}</h5>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Recent searches section -->
              <div class="mt-4">
                <div class="flex items-center justify-between mb-2">
                  <h4 class="text-white text-sm font-medium">Recent Searches</h4>
                  <span
                    class="text-xs text-primary-500 cursor-pointer hover:text-primary-400 transition-colors duration-300"
                    >View All</span
                  >
                </div>

                <div class="flex flex-wrap gap-2">
                  <div
                    v-for="(term, index) in searchTerms"
                    :key="index"
                    v-motion
                    :initial="{ opacity: 0, scale: 0.9 }"
                    :visibleOnce="{
                      opacity: 1,
                      scale: 1,
                      transition: {
                        delay: 0.5 + index * 0.05,
                        type: 'spring',
                        stiffness: 200,
                        damping: 20,
                      },
                    }"
                    class="bg-slate-800/80 text-gray-300 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-slate-700/70 hover:border-primary-700/30 transition-colors duration-300 cursor-pointer"
                  >
                    <Icon
                      name="mdi:history"
                      size="12"
                      class="text-gray-400"
                    />
                    <span>{{ term.text }}</span>
                  </div>
                </div>
              </div>

              <!-- Interactive elements - hot spots -->
              <div
                class="absolute top-[35%] right-[20%] w-28 h-16 border-2 border-primary-600/70 rounded-lg animate-pulse opacity-30"
              ></div>
              <div
                class="absolute bottom-[20%] left-[15%] w-32 h-10 border-2 border-blue-500/70 rounded-full animate-pulse opacity-30"
                style="animation-delay: 1s"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.animate-pulse {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Hover effect for the dashboard mockup */
.dashboard-mockup {
  transform-style: preserve-3d;
  perspective: 1000px;
  transition: transform 0.5s ease;
}

.dashboard-mockup:hover {
  transform: translateY(-5px);
}

/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
