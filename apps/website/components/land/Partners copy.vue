<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAnimation } from '~/composables/useAnimation'

const { conf: motionConstants } = useAnimation()

// Partners data with more entries for a fuller appearance
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
])

// Filter partners by type
const researchPartners = computed(() => partners.value.filter((p) => p.type === 'research'))
const dataPartners = computed(() => partners.value.filter((p) => p.type === 'data'))
</script>

<template>
  <section
    id="partners"
    class="partners-section py-16 md:py-24 relative overflow-hidden"
  >
    <!-- Pure black background -->
    <div class="absolute inset-0 bg-slate-950 z-0"></div>

    <!-- Subtle noise texture -->
    <div class="absolute inset-0 bg-[url('/patterns/noise-pattern.svg')] opacity-3 z-0"></div>

    <!-- Section heading - minimalist -->
    <div class="text-center mb-16">
      <h2 class="text-5xl md:text-6xl font-bold tracking-tight">
        <span class="text-white">Supported</span>
        <span class="text-blue-500"> by</span>
      </h2>
      <p class="mt-4 text-gray-400 max-w-2xl mx-auto">
        Credible organizations backing our mission to democratize space knowledge
      </p>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Research Partners label -->
      <div class="text-center mb-6">
        <h3 class="text-lg font-medium text-gray-200">Research Partners</h3>
      </div>

      <!-- Research partners marquee -->
      <div class="w-full overflow-hidden mb-16">
        <div class="logos-marquee">
          <!-- First set of logos -->
          <div class="logos-container inline-flex">
            <div
              v-for="partner in researchPartners"
              :key="`research1-${partner.id}`"
              class="logo-item mx-3 sm:mx-6"
            >
              <div
                class="partner-logo w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm border border-slate-800/50 rounded-lg p-4 hover:border-blue-800/50 transition-all duration-300"
              >
                <img
                  :src="partner.logo"
                  :alt="partner.name"
                  class="max-h-12 max-w-full opacity-70 hover:opacity-100 transition-opacity duration-300 invert"
                />
              </div>
            </div>
          </div>

          <!-- Duplicate set for continuous scrolling -->
          <div class="logos-container inline-flex">
            <div
              v-for="partner in researchPartners"
              :key="`research2-${partner.id}`"
              class="logo-item mx-3 sm:mx-6"
            >
              <div
                class="partner-logo w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm border border-slate-800/50 rounded-lg p-4 hover:border-blue-800/50 transition-all duration-300"
              >
                <img
                  :src="partner.logo"
                  :alt="partner.name"
                  class="max-h-12 max-w-full opacity-70 hover:opacity-100 transition-opacity duration-300 invert"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Data Sources label -->
      <div class="text-center mb-6">
        <h3 class="text-lg font-medium text-gray-200">Data Sources</h3>
      </div>

      <!-- Data sources marquee (reverse direction) -->
      <div class="w-full overflow-hidden">
        <div class="logos-marquee reverse">
          <!-- First set of logos -->
          <div class="logos-container inline-flex">
            <div
              v-for="partner in dataPartners"
              :key="`data1-${partner.id}`"
              class="logo-item mx-3 sm:mx-6"
            >
              <div
                class="partner-logo w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm border border-slate-800/50 rounded-lg p-4 hover:border-blue-800/50 transition-all duration-300"
              >
                <img
                  :src="partner.logo"
                  :alt="partner.name"
                  class="max-h-12 max-w-full opacity-70 hover:opacity-100 transition-opacity duration-300 invert"
                />
              </div>
            </div>
          </div>

          <!-- Duplicate set for continuous scrolling -->
          <div class="logos-container inline-flex">
            <div
              v-for="partner in dataPartners"
              :key="`data2-${partner.id}`"
              class="logo-item mx-3 sm:mx-6"
            >
              <div
                class="partner-logo w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm border border-slate-800/50 rounded-lg p-4 hover:border-blue-800/50 transition-all duration-300"
              >
                <img
                  :src="partner.logo"
                  :alt="partner.name"
                  class="max-h-12 max-w-full opacity-70 hover:opacity-100 transition-opacity duration-300 invert"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Simple CTA -->
    <div class="mt-16 text-center">
      <PrimeButton
        class="bg-transparent border border-blue-600 text-blue-500 hover:bg-blue-900/20 transition-all duration-300"
      >
        <Icon
          name="mdi:handshake"
          class="mr-2"
          size="18"
        />
        Partner With Us
      </PrimeButton>
    </div>
  </section>
</template>

<style scoped>
/* Marquee animation */
.logos-marquee {
  display: flex;
  width: 100%;
  overflow: hidden;
}

.logos-container {
  display: inline-flex;
  animation: scroll 30s linear infinite;
  white-space: nowrap;
}

.logos-marquee:hover .logos-container {
  animation-play-state: paused;
}

.logos-marquee.reverse .logos-container {
  animation-direction: reverse;
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .logos-container {
    animation-duration: 20s;
  }

  .logo-item {
    margin-left: 8px;
    margin-right: 8px;
  }
}

/* Enhance performance */
.partner-logo {
  backface-visibility: hidden;
  transform: translateZ(0);
  will-change: transform, opacity, border-color;
}
</style>
