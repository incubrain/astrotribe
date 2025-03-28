<script setup lang="ts">
interface ImpactStatistic {
  value: string
  description: string
  globalStat?: string
}

defineProps<{
  stats: ImpactStatistic[]
  title: string
  subtitle?: string
}>()
</script>

<template>
  <section class="relative py-12 bg-gradient-to-b from-primary-950 to-primary-900">
    <div class="wrapper">
      <LandingTitle
        :title="title"
        :subtitle="subtitle"
        class="mb-10"
      />

      <!-- Main Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <div
          v-for="(stat, index) in stats"
          :key="index"
          class="bg-primary-800/50 backdrop-blur-sm rounded-lg p-6 border border-primary-700/30 flex flex-col items-center text-center hover:bg-primary-700/50 transition-all duration-300"
        >
          <div class="text-4xl font-bold text-primary-400 mb-4">{{ stat.value }}</div>
          <p class="text-white text-sm mb-3">{{ stat.description }}</p>
          <div
            v-if="stat.globalStat"
            class="text-xs px-3 py-1 bg-primary-700/40 border border-primary-600/30 rounded-full text-white"
          >
            {{ stat.globalStat }}
          </div>
        </div>
      </div>

      <div class="mt-8 text-center">
        <NuxtLink
          to="https://www.darksky.org/light-pollution/light-pollution-statistics/"
          target="_blank"
        >
          <PrimeButton
            size="small"
            severity="secondary"
            outlined
          >
            Learn more about these statistics
            <Icon
              name="mdi:arrow-right"
              class="ml-2"
            />
          </PrimeButton>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
