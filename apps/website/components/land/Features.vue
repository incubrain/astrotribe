<script setup lang="ts">
import { ref } from 'vue'
import { useAnimation } from '~/composables/useAnimation'

const { conf: motionConstants } = useAnimation()

// Features data
const features = ref([
  {
    id: 1,
    title: 'AstroQuery AI',
    description:
      'Ask complex astronomy questions and get accurate, research-backed answers instantly.',
    icon: 'mdi:brain',
    image: '/images/hero-image.jpg',
    color: 'from-blue-600 to-primary-600',
    highlight: 'Instant answers',
    bullets: [
      'Natural language processing for astronomy terminology',
      'Real-time access to latest research findings',
      'Citation tracking and source verification',
    ],
  },
  {
    id: 2,
    title: 'Knowledge Clusters',
    description:
      'Organize your research, compare ideas, and discover similar work from the astronomy community.',
    icon: 'mdi:graph',
    image: '/images/hero-image.jpg',
    color: 'from-indigo-600 to-blue-500',
    highlight: 'Research organization',
    bullets: [
      'Visual mapping of related research topics',
      'Automatic categorization of papers and data',
      'Collaborative sharing with research teams',
    ],
  },
  {
    id: 3,
    title: 'Research Context',
    description:
      'Add papers and datasets to your queries for highly specific answers based on your own research.',
    icon: 'mdi:book-open-page-variant',
    image: '/images/hero-image.jpg',
    color: 'from-primary-600 to-cyan-600',
    highlight: 'Custom context',
    bullets: [
      'Upload and analyze your own datasets',
      'Get personalized insights from your research',
      'Create custom knowledge bases for your projects',
    ],
  },
  {
    id: 4,
    title: 'Idea Novelty Analysis',
    description:
      'Automatically evaluate your research ideas against existing literature to identify unique opportunities.',
    icon: 'mdi:lightbulb',
    image: '/images/hero-image.jpg',
    color: 'from-violet-600 to-purple-600',
    highlight: 'Innovation insights',
    bullets: [
      'Gap analysis in current research landscape',
      'Trend identification in astronomy publications',
      'Opportunity scoring for research proposals',
    ],
  },
])

const selectedFeature = ref(features.value[0]!)
</script>

<template>
  <section
    id="features"
    class="features-section py-20 md:py-28 relative overflow-hidden"
  >
    <!-- Background with subtle dark gradient -->
    <div class="absolute inset-0 bg-gradient-to-b from-slate-950 to-slate-950 z-0"></div>

    <!-- Subtle patterns -->
    <div class="absolute inset-0 bg-[url('/patterns/noise-pattern.svg')] opacity-5 z-0"></div>

    <!-- Subtle grid overlay -->
    <div class="absolute inset-0 bg-[url('/patterns/grid-pattern.svg')] opacity-2 z-0"></div>

    <!-- Glowing orbs -->
    <div class="absolute -right-20 top-40 w-72 h-72 bg-blue-600/5 rounded-full blur-3xl"></div>
    <div class="absolute -left-40 bottom-20 w-80 h-80 bg-primary-600/5 rounded-full blur-3xl"></div>
    <div class="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl"></div>

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
            >AI-Powered</span
          >
        </div>
        <h2 class="text-3xl md:text-5xl font-bold mb-4 text-white leading-tight">
          <span class="inline-block">Explore</span>
          <span
            class="bg-gradient-to-r from-blue-500 to-primary-600 bg-clip-text text-transparent inline-block"
          >
            The Universe
          </span>
        </h2>
        <p class="text-xl text-gray-300"
          >Advanced tools helping researchers discover insights faster than ever before</p
        >
      </div>

      <!-- New interactive feature showcase -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        <!-- Feature selector tabs - left side -->
        <div class="lg:col-span-4">
          <div
            class="bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-800/50 overflow-hidden"
          >
            <div class="p-4 border-b border-slate-800/50">
              <h3 class="text-white font-medium">Research Tools</h3>
            </div>

            <div class="feature-tabs">
              <div
                v-for="(feature, index) in features"
                :key="feature.id"
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
                class="feature-tab-item border-b border-slate-800/30 cursor-pointer transition-all duration-300"
                :class="
                  selectedFeature.id === feature.id
                    ? 'bg-slate-800/60 border-l-4 border-l-primary-600'
                    : 'hover:bg-slate-800/30 border-l-4 border-l-transparent'
                "
                @click="selectedFeature = feature"
              >
                <div class="p-4 flex items-start gap-3">
                  <!-- Icon with gradient circle -->
                  <div
                    class="mt-1 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br shadow-lg shadow-primary-900/10 flex-shrink-0"
                    :class="feature.color"
                  >
                    <Icon
                      :name="feature.icon"
                      class="text-white"
                      size="18"
                    />
                  </div>

                  <!-- Feature content -->
                  <div>
                    <div class="flex justify-between items-start">
                      <h4 class="text-white font-medium">{{ feature.title }}</h4>
                      <span
                        class="text-xs px-1.5 py-0.5 rounded-full"
                        :class="`bg-${feature.color}-900/40 text-${feature.color}-400 border border-${feature.color}-700/30`"
                      >
                        {{ feature.highlight }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-400 mt-1 line-clamp-2">{{ feature.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Feature details panel - right side -->
        <div class="lg:col-span-8">
          <div
            v-motion
            :initial="{ opacity: 0, scale: 0.95 }"
            :visibleOnce="{
              opacity: 1,
              scale: 1,
              transition: {
                type: 'spring',
                stiffness: 150,
                damping: 15,
              },
            }"
            class="bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-800/50 h-full p-6 relative overflow-hidden"
          >
            <!-- Gradient orb specific to feature -->
            <div
              class="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-20 transition-all duration-500"
              :class="`bg-${selectedFeature.color}-600/30`"
            ></div>

            <!-- Feature content -->
            <div class="relative z-10">
              <!-- Feature header -->
              <div class="flex items-start justify-between mb-6">
                <div>
                  <div
                    class="inline-block mb-2 px-2 py-1 rounded-full text-xs border"
                    :class="`bg-${selectedFeature.color}-900/40 text-${selectedFeature.color}-400 border-${selectedFeature.color}-700/30`"
                  >
                    <div class="flex items-center gap-1.5">
                      <Icon
                        :name="selectedFeature.icon"
                        size="12"
                      />
                      <span>{{ selectedFeature.highlight }}</span>
                    </div>
                  </div>
                  <h3 class="text-2xl font-bold text-white mb-2">{{ selectedFeature.title }}</h3>
                  <p class="text-gray-300">{{ selectedFeature.description }}</p>
                </div>
              </div>

              <!-- Feature interface preview -->
              <div class="mt-6 mb-6 relative">
                <div
                  class="relative rounded-lg overflow-hidden shadow-lg shadow-primary-900/10 border border-slate-700/50 bg-slate-800/50"
                >
                  <!-- Feature image -->
                  <img
                    :src="selectedFeature.image"
                    :alt="selectedFeature.title"
                    class="w-full h-48 object-cover"
                  />

                  <!-- Interface overlay elements -->
                  <div
                    class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent opacity-70"
                  ></div>

                  <!-- UI Elements overlay -->
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div
                      class="w-4/5 h-16 border border-slate-700/50 rounded-lg bg-slate-800/60 backdrop-blur-sm flex items-center px-4 shadow-lg"
                      :class="`shadow-${selectedFeature.color}-900/5`"
                    >
                      <Icon
                        :name="selectedFeature.icon"
                        class="mr-3 opacity-70"
                        :class="`text-${selectedFeature.color}-500`"
                        size="20"
                      />
                      <div class="h-4 w-56 rounded-full bg-slate-700/50"></div>
                      <div
                        class="ml-auto px-3 py-1.5 rounded-md flex items-center gap-1.5"
                        :class="`bg-${selectedFeature.color}-600/20 text-${selectedFeature.color}-400`"
                      >
                        <Icon
                          name="mdi:magnify"
                          size="16"
                        />
                        <span class="text-xs font-medium">Search</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Pulse highlight -->
                <div
                  class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-16 border-2 rounded-lg animate-pulse opacity-30"
                  :class="`border-${selectedFeature.color}-500/70`"
                ></div>
              </div>

              <!-- Feature bullets -->
              <div class="mt-6">
                <h4 class="text-white font-medium mb-3">Key Capabilities</h4>
                <ul class="space-y-3">
                  <li
                    v-for="(bullet, index) in selectedFeature.bullets"
                    :key="index"
                    v-motion
                    :initial="{ opacity: 0, x: 20 }"
                    :visibleOnce="{
                      opacity: 1,
                      x: 0,
                      transition: {
                        delay: 0.2 + index * 0.1,
                        type: 'spring',
                        stiffness: 200,
                        damping: 20,
                      },
                    }"
                    class="flex items-start gap-3"
                  >
                    <div
                      class="mt-1 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      :class="`bg-${selectedFeature.color}-600/20`"
                    >
                      <Icon
                        name="mdi:check"
                        :class="`text-${selectedFeature.color}-500`"
                        size="14"
                      />
                    </div>
                    <span class="text-gray-300">{{ bullet }}</span>
                  </li>
                </ul>
              </div>

              <!-- Feature CTA -->
              <div class="mt-8 flex justify-end">
                <PrimeButton
                  class="transition-all duration-300 border-none text-white"
                  :class="`bg-${selectedFeature.color}-600 hover:bg-${selectedFeature.color}-500`"
                >
                  Try This Feature
                  <Icon
                    name="mdi:arrow-right"
                    class="ml-2"
                    size="16"
                  />
                </PrimeButton>
              </div>
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

.feature-tab-item {
  position: relative;
  overflow: hidden;
}

.feature-tab-item::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to right, transparent, rgba(99, 102, 241, 0.1), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.feature-tab-item:hover::after {
  transform: translateX(100%);
}
</style>
