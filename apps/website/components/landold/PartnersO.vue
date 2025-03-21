<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'

// Partners data organized by category
const partnerCategories = ref([
  {
    id: 'research',
    title: 'Research Partners',
    partners: [
      {
        id: 1,
        name: 'NASA',
        logo: '/images/hero-image.jpg',
        description: 'Space research and exploration data provider',
      },
      {
        id: 2,
        name: 'ESA',
        logo: '/images/hero-image.jpg',
        description: 'European research and mission datasets',
      },
      {
        id: 3,
        name: 'ISRO',
        logo: '/images/hero-image.jpg',
        description: 'Indian space research collaboration',
      },
    ],
  },
  {
    id: 'data',
    title: 'Data Sources',
    partners: [
      {
        id: 4,
        name: 'ArXiv',
        logo: '/images/hero-image.jpg',
        description: 'Academic paper repository access',
      },
      {
        id: 5,
        name: 'JWST',
        logo: '/images/hero-image.jpg',
        description: 'James Webb Space Telescope data',
      },
      {
        id: 6,
        name: 'DST',
        logo: '/images/hero-image.jpg',
        description: 'Department of Science and Technology',
      },
    ],
  },
])

onMounted(() => {
  if (import.meta.client) {
    // Animate logos
    gsap.from('.partner-logo', {
      opacity: 0,
      scale: 0.8,
      duration: 0.5,
      stagger: 0.1,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '.partners-section',
        start: 'top bottom-=100px',
      },
    })
  }
})
</script>

<template>
  <section class="partners-section py-16 bg-slate-900/50">
    <div class="wrapper max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <LandTitle
        title="Supported by"
        subtitle="Credible organizations backing our mission to democratize space knowledge"
      />

      <div
        v-for="category in partnerCategories"
        :key="category.id"
        class="mt-10"
      >
        <h3 class="text-xl font-medium text-white mb-6 text-center">{{ category.title }}</h3>

        <div
          class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-items-center"
        >
          <div
            v-for="partner in category.partners"
            :key="partner.id"
            class="partner-logo-wrapper group relative"
          >
            <div
              class="absolute inset-0 bg-primary-600/5 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>
            <div
              class="relative bg-slate-800/70 border border-primary-600/10 rounded-lg p-6 h-32 w-40 flex items-center justify-center hover:border-primary-600/30 transition-all duration-300"
            >
              <img
                :src="partner.logo"
                :alt="partner.name"
                class="partner-logo max-h-16 max-w-full opacity-70 group-hover:opacity-100 transition-opacity duration-300 invert"
              />

              <!-- Tooltip -->
              <div
                class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 translate-y-full bg-slate-800 border border-primary-600/20 rounded px-3 py-2 text-sm text-gray-300 w-40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10"
              >
                <div class="font-medium text-white mb-1">{{ partner.name }}</div>
                <div class="text-xs text-gray-400">{{ partner.description }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Become a partner button -->
      <div class="mt-12 text-center">
        <PrimeButton
          outlined
          severity="secondary"
          class="border-primary-600/30 text-primary-600 hover:border-primary-600 transition-all duration-300"
        >
          <Icon
            name="mdi:handshake"
            class="mr-2"
            size="18"
          />
          Partner With Us
        </PrimeButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.partner-logo-wrapper::before {
  content: '';
  position: absolute;
  inset: -5px;
  border-radius: 0.5rem;
  background: linear-gradient(45deg, transparent, rgba(var(--primary-600-rgb), 0.2), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.partner-logo-wrapper:hover::before {
  opacity: 1;
}
</style>
