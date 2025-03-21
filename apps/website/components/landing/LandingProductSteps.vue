<script setup lang="ts">
import { ref, onMounted } from 'vue'

const steps = [
  {
    icon: 'mdi:earth',
    title: 'Global Space Coverage',
    description:
      'Stay informed with comprehensive space news coverage from every corner of the globe.',
    img: '/images/features/news.jpeg',
    color: 'from-blue-500/20 to-purple-500/20',
  },
  {
    icon: 'mdi:newspaper-variant-outline',
    title: 'Daily Newsletter',
    description:
      'Get curated summaries of the most important space sector developments, delivered daily.',
    img: '/images/features/summaries.jpeg',
    color: 'from-sky-500/20 to-blue-500/20',
  },
  {
    icon: 'mdi:telescope',
    title: 'Industry Insights',
    description:
      'Track the latest developments from leading space tech companies and emerging startups.',
    img: '/images/features/companies.jpeg',
    color: 'from-purple-500/20 to-blue-500/20',
  },
  {
    icon: 'mdi:briefcase-search',
    title: 'Career Opportunities',
    description:
      'Discover your next role in the space sector with our curated job listings and career resources.',
    img: '/images/features/jobs.jpeg',
    color: 'from-indigo-500/20 to-sky-500/20',
  },
]

</script>

<template>
  <section class="wrapper">
    <LandingTitle
      class="mb-12"
      title="Not Just News"
      subtitle="Just like the universe... we're expanding!"
    />

    <!-- Steps Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 max-w-5xl mx-auto">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="step-item group relative"
      >
        <!-- Step Number -->
        <!-- <div
          class="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-primary-900/50 backdrop-blur-lg flex items-center justify-center border border-sky-500/20 z-10 transition-all duration-300 group-hover:border-sky-500/40 group-hover:bg-primary-900/70"
        >
          <span class="font-space text-sky-400 text-xl">{{ index + 1 }}</span>
        </div> -->

        <PrimeCard
          class="h-full bg-slate-900/30 backdrop-blur-md border border-slate-800/30 hover:border-sky-500/30 transition-all duration-500 overflow-hidden"
        >
          <!-- Content -->
          <template #header>
            <div class="relative w-full aspect-square rounded-lg overflow-hidden bg-slate-950/50">
              <!-- Replace with actual GIF -->
              <div class="absolute inset-0 flex items-center justify-center">
                <NuxtImg
                  :src="step.img"
                  :width="260"
                  :height="260"
                  alt="Featured image"
                  class="relative md:rounded-md"
                />
              </div>

              <!-- Overlay with icon -->
              <div
                class="absolute inset-0 bg-gradient-to-t from-primary-900/80 to-transparent group-hover:from-primary-900/90 transition-all duration-500"
              >
                <Icon
                  :name="step.icon"
                  size="32"
                  class="absolute bottom-4 right-4 text-sky-400/80 transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            </div>
          </template>

          <template #title>
            <h3 class="text-xl font-space text-white mb-2 relative z-10">
              {{ step.title }}
            </h3>
          </template>

          <template #content>
            <div
              class="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-40 transition-opacity duration-500"
              :class="step.color"
            ></div>
            <p class="text-gray-300 relative z-10">{{ step.description }}</p>
          </template>
        </PrimeCard>

        <!-- Card Glow -->
        <div
          class="absolute inset-0 bg-sky-500/5 group-hover:bg-sky-500/10 blur-xl transition-all duration-500 -z-10"
        ></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Ensure proper stacking */
.how-to-use-section {
  isolation: isolate;
}
</style>
