<script setup lang="ts">
import { onMounted } from 'vue'
import { useAnimation } from '~/composables/useAnimation'

const { fadeInUp } = useAnimation()

const steps = [
  {
    icon: 'mdi:checkbox-marked-circle-outline',
    title: 'Select Interests',
    description: 'Customize your feed with your favorite space topics.',
  },
  {
    icon: 'mdi:newspaper-variant-outline',
    title: 'Explore Content',
    description: 'Dive into curated news and cutting-edge research.',
  },
  {
    icon: 'mdi:clock-time-four-outline',
    title: 'Save Time',
    description: 'Focus on discovery, not searching for information.',
  },
]

onMounted(() => {
  fadeInUp('.step-item')
})
</script>

<template>
  <section class="how-to-use-section py-24">
    <div class="container mx-auto px-4">
      <LandingTitle
        title="How it works"
        subtitle="Discover the universe effortlessly with our intuitive platform. Here's how:"
      />
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <PrimeCard
          v-for="(step, index) in steps"
          :key="index"
          class="step-item border border-color foreground overflow-hidden relative"
        >
          <template #header>
            <div class="w-full aspect-video bg-gray-200 flex items-center justify-center">
              <span class="text-gray-400">GIF Placeholder</span>
            </div>
          </template>
          <template #title>
            <div class="flex items-center mb-4 mt-4">
              <h3 class="text-xl font-bold font-space">{{ step.title }}</h3>
            </div>
          </template>
          <template #content>
            <p>{{ step.description }}</p>
          </template>
          <Icon
            :name="step.icon"
            size="48"
            class="text-primary-600 shrink-0 absolute -top-6 right-4 bg-foreground rounded-full p-2"
          />
        </PrimeCard>
      </div>
    </div>
  </section>
</template>

<style scoped>
.font-space {
  font-family: 'Orbitron', sans-serif;
}
</style>
