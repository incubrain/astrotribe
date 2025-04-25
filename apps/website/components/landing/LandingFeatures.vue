<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import { useId } from '#app'

const features = [
  {
    id: useId(),
    title: '24/7 News Coverage',
    subtitle: '20+ trusted space news sources in one place',
    icon: 'mdi:earth',
    metrics: ['Live updates', 'Global coverage'],
  },
  {
    id: useId(),
    title: 'Community-Driven',
    subtitle: 'Quality content rises to the top',
    icon: 'mdi:thumb-up',
    metrics: ['Upvote/Downvote', 'Trending news'],
  },
  {
    id: useId(),
    title: 'Custom Categories',
    subtitle: 'Follow what interests you',
    icon: 'mdi:tune-vertical',
    metrics: ['Personalized feed', 'Topic filters'],
  },
  {
    id: useId(),
    title: 'Smart Bookmarks',
    subtitle: 'Save and organize your reading list',
    icon: 'mdi:bookmark-multiple',
    metrics: ['Custom folders', 'Quick access'],
  },
]

onMounted(() => {
  gsap.from('.feature-card', {
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.features-grid',
      start: 'top bottom-=100px',
      toggleActions: 'play none none reverse',
    },
  })
})

const { loginPath, authURL } = useRuntimeConfig().public
</script>

<template>
  <section>
    <LandingGlass
      gradient="blue"
      intensity="low"
      class="mb-24"
      isolate-content
    >
      <div class="py-8 md:py-12 space-y-8">
        <LandingTitle
          title="Your Space Hub"
          subtitle="All your space in one place"
          class="!pb-8"
        />

        <div class="features-grid grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="feature in features"
            :key="feature.id"
            class="feature-card"
          >
            <PrimeCard
              class="h-full bg-primary-900/30 border border-primary-900/50 hover:border-sky-500/30 transition-all duration-300"
            >
              <template #title>
                <div class="flex items-center space-x-3">
                  <div class="p-2 flex rounded-lg bg-sky-500/10">
                    <Icon
                      :name="feature.icon"
                      class="text-sky-400"
                      size="24"
                    />
                  </div>
                  <div>
                    <h3 class="text-lg font-medium text-white">{{ feature.title }}</h3>
                    <p class="text-sm text-gray-400">{{ feature.subtitle }}</p>
                  </div>
                </div>
              </template>

              <template #content>
                <div class="flex flex-wrap gap-2 mt-4">
                  <span
                    v-for="(metric, index) in feature.metrics"
                    :key="index"
                    class="px-3 py-1 rounded-full text-xs bg-sky-900/30 text-sky-300 border border-sky-900/50"
                  >
                    {{ metric }}
                  </span>
                </div>
              </template>
            </PrimeCard>
          </div>
        </div>
      </div>
    </LandingGlass>
    <div class="mt-6 flex justify-center">
      <NuxtLink
        :to="String(`${authURL}${loginPath}`)"
        external
        class="relative group"
      >
        <PrimeButton
          size="large"
          class="flex !text-2xl gap-4 min-w-[280px] relative z-10 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-700 hover:from-primary-500 hover:via-primary-400 hover:to-primary-600 transition-all duration-300 text-lg shadow-lg shadow-primary-600/30 hover:shadow-primary-500/40 hover:-translate-y-0.5"
        >
          Start Exploring Today,
          <strong> It's Free </strong>
          <Icon
            name="mdi:rocket"
            size="48"
            class="text-white"
          />
        </PrimeButton>
        <div
          class="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-primary-400/20 blur-xl group-hover:blur-2xl transition-all duration-300 z-0"
        ></div>
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
@keyframes twinkle {
  0%,
  100% {
    opacity: 0.4;
  }
  50% {
    opacity: 1;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.animate-twinkle {
  animation: twinkle 2s ease-in-out infinite;
}

.animate-twinkle-delayed {
  animation: twinkle 2s ease-in-out infinite;
  animation-delay: 1s;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float 3s ease-in-out infinite;
  animation-delay: 1.5s;
}
</style>
