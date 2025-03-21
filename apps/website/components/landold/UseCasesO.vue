<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'

// Use cases data
const useCases = ref([
  {
    id: 'researchers',
    title: 'Researchers',
    description: 'Find relevant papers, analyze data trends, and evaluate research novelty',
    icon: 'mdi:flask',
    color: 'from-blue-500 to-primary-600',
    image: '/images/hero-image.jpg',
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
    color: 'from-primary-600 to-emerald-500',
    image: '/images/hero-image.jpg',
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
    color: 'from-amber-500 to-orange-500',
    image: '/images/hero-image.jpg',
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
    color: 'from-indigo-500 to-purple-600',
    image: '/images/hero-image.jpg',
    features: [
      'Identify industry trends and patterns',
      'Monitor technology developments',
      'Discover potential collaboration partners',
      'Streamline competitive intelligence',
    ],
  },
])

// Active use case for tablet/mobile view
const activeUseCase = ref(useCases.value[0].id)

onMounted(() => {
  if (import.meta.client) {
    // Animate use case cards
    gsap.from('.use-case-card', {
      y: 30,
      opacity: 0,
      stagger: 0.15,
      duration: 0.7,
      scrollTrigger: {
        trigger: '.use-cases-grid',
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
        title="Who Uses AstroQuery?"
        subtitle="Serving the entire astronomy community"
        gradient
      />

      <!-- Desktop view (grid layout) -->
      <div class="use-cases-grid hidden lg:grid grid-cols-2 gap-8 mt-12">
        <div
          v-for="useCase in useCases"
          :key="useCase.id"
          class="use-case-card group"
        >
          <!-- Card with glass effect -->
          <div
            class="relative h-full rounded-xl backdrop-blur-sm bg-slate-900/30 border border-slate-800/50 transition-all duration-500 hover:border-primary-600/30 overflow-hidden"
          >
            <!-- Background image with overlay -->
            <div class="absolute inset-0 z-0">
              <img
                :src="useCase.image"
                :alt="useCase.title"
                class="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500"
              />
              <div
                class="absolute inset-0 bg-gradient-to-br opacity-80"
                :class="useCase.color"
              ></div>
            </div>

            <!-- Content -->
            <div class="relative z-10 p-8">
              <!-- Icon -->
              <div
                class="mb-6 w-16 h-16 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-sm"
              >
                <Icon
                  :name="useCase.icon"
                  class="text-white"
                  size="28"
                />
              </div>

              <!-- Text Content -->
              <h3 class="text-2xl font-bold text-white mb-3">{{ useCase.title }}</h3>
              <p class="text-white/90 mb-6">{{ useCase.description }}</p>

              <!-- Features list -->
              <ul class="space-y-2">
                <li
                  v-for="(feature, index) in useCase.features"
                  :key="`${useCase.id}-feature-${index}`"
                  class="flex items-center gap-2"
                >
                  <Icon
                    name="mdi:check-circle"
                    class="text-white"
                    size="18"
                  />
                  <span class="text-white/90">{{ feature }}</span>
                </li>
              </ul>

              <!-- Learn more button -->
              <div class="mt-8">
                <PrimeButton
                  class="bg-white/20 hover:bg-white/30 transition-colors duration-300 backdrop-blur-sm"
                >
                  Learn More
                  <Icon
                    name="mdi:arrow-right"
                    class="ml-1"
                    size="18"
                  />
                </PrimeButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile/Tablet view (tabs layout) -->
      <div class="lg:hidden mt-12">
        <!-- Tabs -->
        <div class="flex overflow-x-auto pb-4 hide-scrollbar">
          <button
            v-for="useCase in useCases"
            :key="`tab-${useCase.id}`"
            class="flex-shrink-0 px-4 py-2 rounded-full mr-2 transition-colors duration-300"
            :class="
              activeUseCase === useCase.id
                ? 'bg-gradient-to-r from-primary-600 to-blue-600 text-white'
                : 'bg-slate-800/50 text-gray-300 hover:bg-slate-800'
            "
            @click="activeUseCase = useCase.id"
          >
            <div class="flex items-center gap-2">
              <Icon
                :name="useCase.icon"
                size="18"
              />
              <span>{{ useCase.title }}</span>
            </div>
          </button>
        </div>

        <!-- Active tab content -->
        <div
          v-for="useCase in useCases"
          v-show="activeUseCase === useCase.id"
          :key="`content-${useCase.id}`"
        >
          <div
            class="relative rounded-xl backdrop-blur-sm bg-slate-900/30 border border-slate-800/50 overflow-hidden"
          >
            <!-- Background image with overlay -->
            <div class="absolute inset-0 z-0">
              <img
                :src="useCase.image"
                :alt="useCase.title"
                class="w-full h-full object-cover opacity-20"
              />
              <div
                class="absolute inset-0 bg-gradient-to-br opacity-80"
                :class="useCase.color"
              ></div>
            </div>

            <!-- Content -->
            <div class="relative z-10 p-6">
              <h3 class="text-2xl font-bold text-white mb-3">{{ useCase.title }}</h3>
              <p class="text-white/90 mb-6">{{ useCase.description }}</p>

              <!-- Features list -->
              <ul class="space-y-2">
                <li
                  v-for="(feature, index) in useCase.features"
                  :key="`mobile-${useCase.id}-feature-${index}`"
                  class="flex items-center gap-2"
                >
                  <Icon
                    name="mdi:check-circle"
                    class="text-white"
                    size="18"
                  />
                  <span class="text-white/90">{{ feature }}</span>
                </li>
              </ul>

              <!-- Learn more button -->
              <div class="mt-8">
                <PrimeButton
                  class="bg-white/20 hover:bg-white/30 transition-colors duration-300 backdrop-blur-sm"
                >
                  Learn More
                  <Icon
                    name="mdi:arrow-right"
                    class="ml-1"
                    size="18"
                  />
                </PrimeButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA button -->
      <div class="mt-16 text-center">
        <PrimeButton
          size="large"
          class="bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-500 hover:to-blue-500 transition-all duration-300"
        >
          Find Your Use Case
          <Icon
            name="mdi:account-search"
            class="ml-2"
            size="20"
          />
        </PrimeButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.use-case-card {
  transform: translateY(0);
  transition: transform 0.3s ease;
}

.use-case-card:hover {
  transform: translateY(-5px);
}

/* Hide scrollbar but keep functionality */
.hide-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}
</style>
