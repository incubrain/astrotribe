<script setup lang="ts">
import { gsap } from 'gsap'

// Stats to showcase platform reach
const stats = [
  { id: useId(), value: 50, suffix: '+', label: 'News Sources' },
  { id: useId(), value: 50, suffix: '+', label: 'Space Agencies & Companies' },
  { id: useId(), value: 24, suffix: '/7', label: 'Coverage' },
]

onMounted(() => {
  // Animate stats - trigger earlier
  gsap.from('.stat-value', {
    textContent: 0,
    duration: 2,
    ease: 'power1.out',
    snap: { textContent: 1 },
    stagger: 0.2,
    scrollTrigger: {
      trigger: '.stats-grid',
      start: 'top bottom', // Changed from bottom-=100px
      toggleActions: 'play none none reverse',
    },
  })
})
</script>

<template>
  <div>
    <div class="stats-grid grid grid-cols-2 md:grid-cols-3 gap-8 w-full">
      <div
        v-for="stat in stats"
        :key="stat.id"
        class="text-center flex flex-col w-full justify-center items-center"
      >
        <span class="flex items-center">
          <h3
            class="stat-value text-4xl md:text-5xl font-bold text-primary-400 mb-2"
            :data-stat-id="stat.id"
          >
            {{ stat.value }}
          </h3>
          <p class="text-2xl font-bold pl-1">{{ stat.suffix }}</p>
        </span>
        <p class="text-gray-400 text-sm md:text-base">{{ stat.label }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
