<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'

// Dashboard features/capabilities
const capabilities = ref([
  { icon: 'mdi:format-list-checks', text: 'Create custom feed from 20+ astronomy categories' },
  { icon: 'mdi:bookmark-multiple', text: 'Save searches and create research collections' },
  { icon: 'mdi:account-group', text: 'Follow space agencies, researchers, and companies' },
  { icon: 'mdi:bell-ring', text: 'Set alerts for mission updates and astronomical events' },
  { icon: 'mdi:graph', text: 'Track research trends and citation metrics' },
  { icon: 'mdi:share-variant', text: 'Share discoveries with your network' },
])

// Simulated dashboard stats
const stats = ref({
  papers: '1M+',
  sources: '50+',
  updates: '24/7',
  categories: '20+',
})

onMounted(() => {
  if (import.meta.client) {
    // Animate dashboard reveal
    gsap.from('.dashboard-mockup', {
      y: 80,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.dashboard-section',
        start: 'top bottom-=100px',
      },
    })

    // Animate capability items
    gsap.from('.capability-item', {
      x: -30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6,
      scrollTrigger: {
        trigger: '.capabilities-list',
        start: 'top bottom-=50px',
      },
    })
  }
})
</script>

<template>
  <section class="dashboard-section py-16 md:py-24 bg-gradient-to-b from-slate-900 to-slate-950">
    <div class="wrapper max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <LandTitle
        title="Your Space Hub"
        subtitle="Personalized to your cosmic interests"
      />

      <div class="mt-12 grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        <div class="lg:col-span-2 space-y-8">
          <!-- Dashboard capabilities list -->
          <div class="capabilities-list space-y-6">
            <div
              v-for="(capability, index) in capabilities"
              :key="index"
              class="capability-item flex items-start gap-4 group"
            >
              <div
                class="flex-shrink-0 mt-1 w-10 h-10 rounded-lg bg-primary-600/20 flex items-center justify-center group-hover:bg-primary-600/40 transition-colors duration-300"
              >
                <Icon
                  :name="capability.icon"
                  class="text-primary-600"
                  size="20"
                />
              </div>
              <div>
                <p class="text-gray-300 group-hover:text-white transition-colors duration-300">
                  {{ capability.text }}
                </p>
              </div>
            </div>
          </div>

          <!-- Quick dashboard stats -->
          <div class="grid grid-cols-2 gap-4">
            <div
              v-for="(value, key) in stats"
              :key="key"
              class="relative backdrop-blur-sm bg-slate-800/30 border border-primary-600/20 rounded-lg p-4"
            >
              <div class="absolute inset-0 bg-primary-600/5 rounded-lg blur-md"></div>
              <div class="relative z-10">
                <h4 class="text-2xl font-bold text-white mb-1">{{ value }}</h4>
                <p class="text-sm text-gray-400 capitalize">{{ key }}</p>
              </div>
            </div>
          </div>

          <!-- CTA button -->
          <div>
            <PrimeButton
              class="w-full bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-500 hover:to-blue-500 transition-all duration-300"
            >
              Try the Dashboard
              <Icon
                name="mdi:rocket-launch"
                class="ml-2"
                size="20"
              />
            </PrimeButton>
          </div>
        </div>

        <!-- Dashboard mockup -->
        <div class="dashboard-mockup lg:col-span-3 relative">
          <!-- Glow effect -->
          <div
            class="absolute -inset-4 bg-gradient-to-tr from-primary-600/10 to-blue-500/10 rounded-xl blur-xl"
          ></div>

          <!-- Dashboard frame -->
          <div
            class="relative rounded-xl overflow-hidden border border-primary-600/30 shadow-lg shadow-primary-600/20"
          >
            <!-- Top navigation bar -->
            <div class="bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center">
              <div class="flex items-center space-x-3">
                <div class="w-3 h-3 rounded-full bg-red-500"></div>
                <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div class="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div class="mx-auto font-medium text-white">AstroQuery Dashboard</div>
              <div class="flex items-center gap-2">
                <Icon
                  name="mdi:account-circle"
                  class="text-gray-400"
                  size="20"
                />
                <Icon
                  name="mdi:bell-outline"
                  class="text-gray-400"
                  size="20"
                />
              </div>
            </div>

            <!-- Dashboard content -->
            <div class="relative bg-slate-900">
              <img
                src="/images/hero-image.jpg"
                alt="AstroQuery Dashboard"
                class="w-full"
              />

              <!-- Animated highlight overlays -->
              <div
                class="absolute top-[15%] left-[20%] w-40 h-24 border-2 border-primary-600 rounded-lg animate-pulse opacity-60"
              ></div>
              <div
                class="absolute top-[45%] right-[15%] w-32 h-32 border-2 border-blue-500 rounded-lg animate-pulse opacity-60"
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
@keyframes pulse {
  0%,
  100% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.05);
  }
}

.animate-pulse {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
