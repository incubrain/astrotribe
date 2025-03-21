<script setup lang="ts">
import { ref } from 'vue'

// Partners data
const partners = ref([
  // Research partners
  {
    id: 1,
    name: 'NASA',
    logo: '/images/hero-image.jpg',
    type: 'research',
  },
  {
    id: 2,
    name: 'ESA',
    logo: '/images/hero-image.jpg',
    type: 'research',
  },
  {
    id: 3,
    name: 'ISRO',
    logo: '/images/hero-image.jpg',
    type: 'research',
  },
  {
    id: 4,
    name: 'JAXA',
    logo: '/images/hero-image.jpg',
    type: 'research',
  },
  {
    id: 5,
    name: 'Roscosmos',
    logo: '/images/hero-image.jpg',
    type: 'research',
  },
  {
    id: 6,
    name: 'CNSA',
    logo: '/images/hero-image.jpg',
    type: 'research',
  },
  // Data sources
  {
    id: 7,
    name: 'ArXiv',
    logo: '/images/hero-image.jpg',
    type: 'data',
  },
  {
    id: 8,
    name: 'JWST',
    logo: '/images/hero-image.jpg',
    type: 'data',
  },
  {
    id: 9,
    name: 'DST',
    logo: '/images/hero-image.jpg',
    type: 'data',
  },
  {
    id: 10,
    name: 'SIMBAD',
    logo: '/images/hero-image.jpg',
    type: 'data',
  },
  {
    id: 11,
    name: 'MAST',
    logo: '/images/hero-image.jpg',
    type: 'data',
  },
  {
    id: 12,
    name: 'NED',
    logo: '/images/hero-image.jpg',
    type: 'data',
  },
  // Added more partners for publishers
  {
    id: 13,
    name: 'Nature',
    logo: '/images/hero-image.jpg',
    type: 'publisher',
  },
  {
    id: 14,
    name: 'Science',
    logo: '/images/hero-image.jpg',
    type: 'publisher',
  },
  {
    id: 15,
    name: 'AAS',
    logo: '/images/hero-image.jpg',
    type: 'publisher',
  },
  {
    id: 16,
    name: 'IEEE',
    logo: '/images/hero-image.jpg',
    type: 'publisher',
  },
  {
    id: 17,
    name: 'Elsevier',
    logo: '/images/hero-image.jpg',
    type: 'publisher',
  },
  {
    id: 18,
    name: 'Springer',
    logo: '/images/hero-image.jpg',
    type: 'publisher',
  },
])

// Create multiple copies of partners to ensure continuous scrolling
const generateMultipleCopies = (items, count = 4) => {
  let result = []
  for (let i = 0; i < count; i++) {
    result = result.concat(items.map((item) => ({ ...item, key: `${item.id}-${i}` })))
  }
  return result
}

// Filter partners by type with multiple copies for smoother infinite scroll
const researchPartners = computed(() =>
  generateMultipleCopies(partners.value.filter((p) => p.type === 'research')),
)
const dataPartners = computed(() =>
  generateMultipleCopies(partners.value.filter((p) => p.type === 'data')),
)
const publisherPartners = computed(() =>
  generateMultipleCopies(partners.value.filter((p) => p.type === 'publisher')),
)

// Simple check for mobile viewport
const isMobile = ref(false)
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})
onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
function checkMobile() {
  isMobile.value = window.innerWidth < 768
}
</script>

<template>
  <section
    id="sources"
    class="sources-section py-16 md:py-24 relative overflow-hidden"
  >
    <!-- Pure black background -->
    <div class="absolute inset-0 bg-black z-0"></div>

    <!-- SVG Noise pattern (used as a component now) -->
    <noise-pattern />

    <!-- Section heading - updated message -->
    <div class="relative z-10 text-center mb-12">
      <h2 class="text-5xl md:text-6xl font-bold tracking-tight">
        <span class="text-white text-shadow-sm">All the sources you</span>
        <span class="text-blue-500 text-shadow-sm"> love</span>
      </h2>
      <p class="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
        Access thousands of trusted astronomy resources in one integrated platform
      </p>
    </div>

    <div class="relative z-10 py-4">
      <!-- Space agencies infinite scroll -->
      <LandInfiniteScroll
        :items="researchPartners"
        direction="normal"
        :duration="80"
        container-class="mb-10"
        :is-mobile="isMobile"
      />

      <!-- Data sources infinite scroll -->
      <LandInfiniteScroll
        :items="dataPartners"
        direction="reverse"
        :duration="60"
        container-class="mb-10"
        :is-mobile="isMobile"
      />

      <!-- Publishers infinite scroll -->
      <LandInfiniteScroll
        :items="publisherPartners"
        direction="normal"
        :duration="70"
        :is-mobile="isMobile"
      />
    </div>

    <!-- Source count with glowing effect -->
    <div class="relative z-10 mt-10 mb-10 text-center">
      <div class="inline-block">
        <div
          class="px-6 py-3 bg-blue-900/20 backdrop-blur-sm border border-blue-800/30 rounded-full"
        >
          <span class="text-lg md:text-xl font-bold text-blue-400">
            <span class="counter-value text-white">50+</span> trusted sources
          </span>
        </div>
        <!-- Subtle glow effect -->
        <div class="absolute -inset-1 bg-blue-500/20 rounded-full blur-md -z-10"></div>
      </div>
    </div>

    <!-- Simple CTA -->
    <div class="relative z-10 mt-8 text-center">
      <PrimeButton
        class="bg-blue-600 hover:bg-blue-500 text-white border-none transition-all duration-300 shadow-lg shadow-blue-900/20"
      >
        <Icon
          name="mdi:database-search"
          class="mr-2"
          size="18"
        />
        Explore All Sources
      </PrimeButton>
    </div>
  </section>
</template>

<style scoped>
/* Text shadow for better visibility */
.text-shadow-sm {
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* Add subtle pulsing to the counter */
@keyframes pulse-subtle {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.counter-value {
  animation: pulse-subtle 2s ease-in-out infinite;
}
</style>
