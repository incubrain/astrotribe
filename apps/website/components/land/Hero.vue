<script setup lang="ts">
import { ref } from 'vue'

defineProps({
  categories: {
    type: Array,
    required: true,
  },
})

// Search query
const searchQuery = ref('')

const handleSearch = () => {
  // Handle search functionality
  console.log('Searching for:', searchQuery.value)
}

const sectionTitle = {
  initial: {
    opacity: 0,
    y: 30,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 250,
      damping: 20,
    },
  },
}
</script>

<template>
  <section
    class="hero-section relative overflow-hidden min-h-screen flex items-center py-16 md:py-0"
  >
    <!-- Background gradient -->
    <div
      class="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-primary-900/20 z-0"
    ></div>

    <!-- Main Content -->
    <div class="wrapper max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-x-12 gap-y-16 items-center">
        <!-- Hero content - left side -->
        <div class="lg:col-span-3">
          <h1
            v-motion="sectionTitle"
            class="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight"
          >
            <span class="block">Intelligent</span>
            <span
              class="bg-gradient-to-r from-primary-600 to-blue-500 bg-clip-text text-transparent"
              >Space Knowledge</span
            >
            <span class="block">Interface</span>
          </h1>

          <p
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 0.2 } }"
            class="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl"
          >
            Connect with astronomy data, analyze research, and discover cosmic insights in seconds
            with our AI-powered platform.
          </p>

          <!-- Search bar -->
          <div
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 0.3 } }"
            class="relative max-w-2xl mb-8"
          >
            <form
              class="flex items-center"
              @submit.prevent="handleSearch"
            >
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Ask about astronomy or search space research..."
                class="w-full px-5 py-4 rounded-l-lg bg-slate-800/80 border border-primary-600/30 text-white placeholder-gray-400 focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
              />
              <button
                type="submit"
                class="px-6 py-4 rounded-r-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors duration-300 flex items-center"
              >
                <Icon
                  name="mdi:magnify"
                  class="mr-2"
                  size="20"
                />
                <span>Search</span>
              </button>
            </form>
            <div class="mt-2 flex flex-wrap gap-2">
              <span
                v-for="(tag, index) in ['Research papers', 'Exoplanets', 'JWST', 'Nebulae']"
                :key="index"
                v-motion
                :initial="{ opacity: 0, scale: 0.8 }"
                :visibleOnce="{ opacity: 1, scale: 1, transition: { delay: 0.4 + index * 0.1 } }"
                class="text-xs text-primary-400 px-2 py-1 rounded-full border border-primary-600/30 cursor-pointer hover:bg-primary-600/20 transition-colors duration-300"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- CTA buttons -->
          <div
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 0.5 } }"
            class="flex flex-wrap gap-4 mb-8"
          >
            <PrimeButton
              size="large"
              class="bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-500 hover:to-blue-500 transition-all duration-300 text-lg px-8 shadow-lg shadow-primary-900/30"
            >
              Start Free Trial
              <Icon
                name="mdi:rocket-launch"
                class="ml-2"
                size="20"
              />
            </PrimeButton>
            <PrimeButton
              size="large"
              outlined
              class="border-white text-white hover:bg-white/10 transition-all duration-300 text-lg px-8"
            >
              Watch Demo
              <Icon
                name="mdi:play-circle"
                class="ml-2"
                size="20"
              />
            </PrimeButton>
          </div>

          <!-- Stats bar -->
          <div
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 0.6 } }"
            class="flex flex-wrap justify-start gap-x-8 gap-y-4"
          >
            <div class="flex items-center">
              <div class="mr-2 text-primary-600">
                <Icon
                  name="mdi:book-open-page-variant"
                  size="24"
                />
              </div>
              <div>
                <div class="text-xl font-bold text-white">1M+</div>
                <div class="text-sm text-gray-400">Research Papers</div>
              </div>
            </div>

            <div class="flex items-center">
              <div class="mr-2 text-primary-600">
                <Icon
                  name="mdi:source-repository"
                  size="24"
                />
              </div>
              <div>
                <div class="text-xl font-bold text-white">50+</div>
                <div class="text-sm text-gray-400">Data Sources</div>
              </div>
            </div>

            <div class="flex items-center">
              <div class="mr-2 text-primary-600">
                <Icon
                  name="mdi:update"
                  size="24"
                />
              </div>
              <div>
                <div class="text-xl font-bold text-white">24/7</div>
                <div class="text-sm text-gray-400">Updates</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right side - Calendar/Events sidebar -->
        <div
          v-motion
          :initial="{ opacity: 0, x: 50 }"
          :visibleOnce="{
            opacity: 1,
            x: 0,
            transition: { type: 'spring', stiffness: 150, damping: 20, delay: 0.3 },
          }"
          class="lg:col-span-2"
        >
          <div
            class="bg-slate-900/60 backdrop-blur-md border border-primary-800/30 rounded-lg shadow-xl shadow-primary-900/20 overflow-hidden transform transition-all duration-500 hover:-translate-y-1"
          >
            <div class="p-6">
              <h2 class="text-xl font-bold text-white mb-4 flex items-center">
                <Icon
                  name="mdi:calendar-star"
                  size="24"
                  class="mr-2 text-primary-600"
                />
                Astronomical Events
              </h2>

              <!-- Search Feature -->
              <div class="relative mb-6">
                <input
                  type="text"
                  placeholder="Search events..."
                  class="w-full bg-slate-800/60 text-white border border-primary-800/30 rounded-md pl-8 py-2 focus:ring-1 focus:ring-primary-600 focus:outline-none"
                />
                <Icon
                  name="mdi:magnify"
                  class="absolute left-2 top-2.5 text-gray-400"
                  size="16"
                />
              </div>

              <!-- Upcoming Events -->
              <div class="space-y-3 mb-6">
                <h3 class="text-lg font-medium text-white mb-2">Upcoming Highlights</h3>

                <!-- Event Cards -->
                <div
                  v-for="(event, index) in [
                    {
                      title: 'Lyrid Meteor Shower',
                      date: 'April 22, 2025',
                      time: '22:00 - 04:00',
                      icon: 'mdi:meteor',
                      color: 'red',
                    },
                    {
                      title: 'Partial Solar Eclipse',
                      date: 'March 29, 2025',
                      time: '09:00 - 12:00',
                      icon: 'mdi:moon-new',
                      color: 'indigo',
                    },
                    {
                      title: 'SpaceX Starship Launch',
                      date: 'March 15, 2025',
                      time: '14:30 - 16:00',
                      icon: 'mdi:rocket-launch',
                      color: 'blue',
                    },
                  ]"
                  :key="index"
                  v-motion
                  :initial="{ opacity: 0, y: 20 }"
                  :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 0.5 + index * 0.1 } }"
                  class="bg-slate-800/50 backdrop-blur-sm border border-primary-800/20 rounded-lg p-3 cursor-pointer hover:bg-primary-900/40 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <div class="flex justify-between items-start">
                    <div class="flex items-center gap-2">
                      <div
                        :class="`bg-${event.color}-500/20 text-${event.color}-400 p-1.5 rounded-full`"
                      >
                        <Icon
                          :name="event.icon"
                          size="18"
                        />
                      </div>
                      <div>
                        <h4 class="font-medium text-white">{{ event.title }}</h4>
                        <p class="text-xs text-gray-400">{{ event.date }}</p>
                      </div>
                    </div>
                    <div class="bg-slate-900/70 px-2 py-0.5 rounded text-xs text-gray-300">{{
                      event.time
                    }}</div>
                  </div>
                </div>
              </div>

              <!-- Event Categories -->
              <div>
                <h3 class="text-lg font-medium text-white mb-2 flex items-center gap-2">
                  <span>Categories</span>
                  <Icon
                    name="mdi:filter-variant"
                    size="18"
                    class="text-primary-400"
                  />
                </h3>

                <div class="grid grid-cols-2 gap-2 mt-3">
                  <div
                    v-for="(category, idx) in categories.slice(0, 6)"
                    :key="idx"
                    v-motion
                    :initial="{ opacity: 0, x: 20 }"
                    :visibleOnce="{ opacity: 1, x: 0, transition: { delay: 0.7 + idx * 0.05 } }"
                    class="flex items-center gap-2 p-1.5 rounded-md cursor-pointer group hover:bg-primary-900/40 transition-colors duration-300"
                  >
                    <div
                      class="flex items-center justify-center w-5 h-5 rounded-full transition-colors duration-300"
                      :class="`bg-${category.color}-${category.colorIntensity}/20 group-hover:bg-${category.color}-${category.colorIntensity}/30`"
                    >
                      <Icon
                        :name="category.icon"
                        size="12"
                        :class="`text-${category.color}-${category.colorIntensity}`"
                      />
                    </div>
                    <span
                      class="text-sm text-gray-300 group-hover:text-white transition-colors duration-300"
                    >
                      {{ category.name }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
