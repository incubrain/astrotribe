<script setup lang="ts">
import { ref } from 'vue'
import { useAnimation } from '~/composables/useAnimation'

const { conf: motionConstants } = useAnimation()

// Use cases data
const useCases = ref([
  {
    id: 'researchers',
    title: 'Researchers',
    description: 'Find relevant papers, analyze data trends, and evaluate research novelty',
    icon: 'mdi:flask',
    color: 'blue',
    image: '/images/hero-image.jpg',
    oldWay: 'Spend weeks digging through databases, manually cross-referencing papers',
    newWay: 'Discover key research and identify gaps in minutes with AI assistance',
    features: [
      'Accelerate literature reviews by 70%',
      'Identify research gaps and opportunities',
      'Connect with relevant researchers',
      'Stay updated on field developments',
    ],
  },
  {
    id: 'educators',
    title: 'Students & Educators',
    description:
      'Access simplified explanations of complex astronomy concepts with reliable sources',
    icon: 'mdi:school',
    color: 'emerald',
    image: '/images/hero-image.jpg',
    oldWay: 'Struggle to translate complex research into accessible teaching materials',
    newWay: 'Get instant explanations at any complexity level with visualizations',
    features: [
      'Create detailed lesson materials',
      'Find explanations at multiple complexity levels',
      'Access visualizations and interactive content',
      'Link concepts to current research',
    ],
  },
  {
    id: 'enthusiasts',
    title: 'Space Enthusiasts',
    description: 'Stay updated on missions, discoveries, and space events with expert context',
    icon: 'mdi:star',
    color: 'amber',
    image: '/images/hero-image.jpg',
    oldWay: 'Search through scattered news sites with varying accuracy and depth',
    newWay: 'One reliable hub for space news with context from leading researchers',
    features: [
      'Understand complex astronomy concepts',
      'Follow space missions and events',
      'Connect with the astronomy community',
      'Find local stargazing opportunities',
    ],
  },
  {
    id: 'organizations',
    title: 'Organizations',
    description:
      'Monitor industry trends, track competitors, and discover collaboration opportunities',
    icon: 'mdi:domain',
    color: 'indigo',
    image: '/images/hero-image.jpg',
    oldWay: 'Invest in multiple research teams and expensive market analysis',
    newWay: 'Instantly access industry intelligence and identify partnership opportunities',
    features: [
      'Identify industry trends and patterns',
      'Monitor technology developments',
      'Discover potential collaboration partners',
      'Streamline competitive intelligence',
    ],
  },
])

// Active use case for tablet/mobile view and the comparison section
const activeUseCase = ref(useCases.value[0])

// Toggle to show the difference between old and new approaches
const isShowingNewWay = ref(true)
const toggleWay = () => {
  isShowingNewWay.value = !isShowingNewWay.value
}
</script>

<template>
  <section
    id="use-cases"
    class="py-20 md:py-28 relative overflow-hidden"
  >
    <!-- Background with pure black -->
    <div class="absolute inset-0 bg-slate-950 z-0"></div>

    <!-- Subtle noise texture -->
    <div class="absolute inset-0 bg-[url('/patterns/noise-pattern.svg')] opacity-5 z-0"></div>

    <!-- Subtle grid overlay -->
    <div class="absolute inset-0 bg-[url('/patterns/grid-pattern.svg')] opacity-3 z-0"></div>

    <!-- Subtle blue glow effects -->
    <div class="absolute top-40 -left-40 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
    <div class="absolute bottom-40 -right-40 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>

    <div class="wrapper container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Modern heading with gradient text -->
      <div class="text-center mb-16">
        <h2 class="text-5xl md:text-6xl font-bold tracking-tight">
          <span class="text-white">Who Uses</span>
          <span class="text-blue-500 block md:inline"> AstroQuery?</span>
        </h2>
        <p class="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
          Serving the entire astronomy community
        </p>
      </div>

      <!-- User category selector - clean, simple tabs -->
      <div class="flex justify-center mb-16">
        <div
          class="inline-flex bg-slate-900/60 backdrop-blur-sm rounded-full p-1.5 border border-slate-800/50"
        >
          <button
            v-for="useCase in useCases"
            :key="useCase.id"
            class="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2"
            :class="
              activeUseCase.id === useCase.id
                ? `bg-${useCase.color}-600 text-white shadow-lg shadow-${useCase.color}-900/20`
                : 'text-gray-400 hover:text-white'
            "
            @click="activeUseCase = useCase"
          >
            <Icon
              :name="useCase.icon"
              size="18"
            />
            <span>{{ useCase.title }}</span>
          </button>
        </div>
      </div>

      <!-- Old way vs New way comparison - inspired by your idea -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visibleOnce="{ opacity: 1, y: 0 }"
        class="mb-16 max-w-4xl mx-auto"
      >
        <div
          class="relative bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-800/50 overflow-hidden"
        >
          <!-- Top toggle bar -->
          <div class="flex border-b border-slate-800/50">
            <button
              class="flex-1 py-3 text-center font-medium text-sm relative transition-colors duration-200"
              :class="!isShowingNewWay ? 'text-white' : 'text-gray-500 hover:text-gray-300'"
              @click="isShowingNewWay = false"
            >
              <span class="flex items-center justify-center gap-2">
                <Icon
                  name="mdi:clock-time-eight-outline"
                  size="18"
                />
                Traditional Approach
              </span>
              <div
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 transform scale-x-0 transition-transform duration-300"
                :class="{ 'scale-x-100': !isShowingNewWay }"
              ></div>
            </button>

            <button
              class="flex-1 py-3 text-center font-medium text-sm relative transition-colors duration-200"
              :class="isShowingNewWay ? 'text-white' : 'text-gray-500 hover:text-gray-300'"
              @click="isShowingNewWay = true"
            >
              <span class="flex items-center justify-center gap-2">
                <Icon
                  name="mdi:rocket-launch-outline"
                  size="18"
                />
                With AstroQuery
              </span>
              <div
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 transform scale-x-0 transition-transform duration-300"
                :class="{ 'scale-x-100': isShowingNewWay }"
              ></div>
            </button>
          </div>

          <!-- Content area -->
          <div class="p-8 min-h-40">
            <!-- Icon and category -->
            <div class="flex items-center gap-3 mb-6">
              <div
                class="w-12 h-12 rounded-full flex items-center justify-center"
                :class="`bg-${activeUseCase.color}-600/20 text-${activeUseCase.color}-500`"
              >
                <Icon
                  :name="activeUseCase.icon"
                  size="24"
                />
              </div>
              <div>
                <h3 class="text-xl font-bold text-white">{{ activeUseCase.title }}</h3>
                <p class="text-gray-400 text-sm">{{ activeUseCase.description }}</p>
              </div>
            </div>

            <!-- Approach comparison with animation -->
            <div
              class="relative overflow-hidden rounded-lg bg-slate-800/50 p-6 border border-slate-700/50"
            >
              <div
                class="transition-all duration-500 transform"
                :class="isShowingNewWay ? 'translate-x-0' : '-translate-x-full'"
              >
                <div class="flex items-start gap-4">
                  <div
                    class="mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-blue-600/20"
                  >
                    <Icon
                      name="mdi:check"
                      class="text-blue-500"
                      size="20"
                    />
                  </div>
                  <div>
                    <h4 class="text-lg font-medium text-white mb-1">The AstroQuery Way</h4>
                    <p class="text-gray-300">{{ activeUseCase.newWay }}</p>
                  </div>
                </div>
              </div>

              <div
                class="absolute inset-0 transition-all duration-500 transform p-6"
                :class="!isShowingNewWay ? 'translate-x-0' : 'translate-x-full'"
              >
                <div class="flex items-start gap-4">
                  <div
                    class="mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-red-600/20"
                  >
                    <Icon
                      name="mdi:close"
                      class="text-red-500"
                      size="20"
                    />
                  </div>
                  <div>
                    <h4 class="text-lg font-medium text-white mb-1">The Traditional Way</h4>
                    <p class="text-gray-300">{{ activeUseCase.oldWay }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Key features -->
            <div class="mt-8">
              <h4 class="text-white font-medium mb-4">Key Benefits</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  v-for="(feature, featureIndex) in activeUseCase.features"
                  :key="featureIndex"
                  v-motion
                  :initial="{ opacity: 0, x: -10 }"
                  :visibleOnce="{
                    opacity: 1,
                    x: 0,
                    transition: {
                      delay: 0.1 + featureIndex * 0.1,
                    },
                  }"
                  class="flex items-start gap-3"
                >
                  <div
                    class="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center bg-slate-800/80 border border-slate-700/50 flex-shrink-0"
                  >
                    <Icon
                      name="mdi:check"
                      :class="`text-${activeUseCase.color}-500`"
                      size="12"
                    />
                  </div>
                  <span class="text-gray-300 text-sm">{{ feature }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- User cards - simplified from your original design -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(useCase, index) in useCases"
          :key="useCase.id"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :visibleOnce="{
            opacity: 1,
            y: 0,
            transition: {
              type: 'spring',
              stiffness: 200,
              damping: 20,
              delay: 0.2 + index * 0.1,
            },
          }"
          class="group cursor-pointer"
          @click="activeUseCase = useCase"
        >
          <div
            class="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-xl p-6 h-full transition-all duration-300 hover:border-blue-600/30 hover:shadow-lg hover:shadow-blue-900/10 hover:-translate-y-1"
            :class="
              activeUseCase.id === useCase.id
                ? 'border-blue-600/30 shadow-lg shadow-blue-900/10 -translate-y-1'
                : ''
            "
          >
            <div
              class="w-12 h-12 rounded-full flex items-center justify-center mb-4"
              :class="`bg-${useCase.color}-600/20 text-${useCase.color}-500`"
            >
              <Icon
                :name="useCase.icon"
                size="24"
              />
            </div>
            <h3 class="text-xl font-bold text-white mb-2">{{ useCase.title }}</h3>
            <p class="text-gray-400 text-sm mb-4">{{ useCase.description }}</p>

            <div class="flex justify-end">
              <button
                class="text-sm font-medium flex items-center gap-1 transition-colors duration-200"
                :class="`text-${useCase.color}-500 hover:text-${useCase.color}-400`"
              >
                <span>Learn more</span>
                <Icon
                  name="mdi:arrow-right"
                  size="16"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Simple CTA -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 0.5 } }"
        class="mt-16 text-center"
      >
        <PrimeButton
          size="large"
          class="bg-blue-600 hover:bg-blue-500 border-none shadow-lg shadow-blue-900/20 transition-all duration-300 px-8"
        >
          Find Your Use Case
          <Icon
            name="mdi:arrow-right"
            class="ml-2"
            size="20"
          />
        </PrimeButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Simple fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
