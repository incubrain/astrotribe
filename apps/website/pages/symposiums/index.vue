<script setup lang="ts">
const symposiums = [
  {
    title: 'IDSPS Symposium: India’s Dark Sky Policy & Sustainability',
    description: `AstronEra proudly presents India's Dark Sky Policy & Sustainability
                Symposium, a platform dedicated to tackling the critical issue of light pollution.
                Excessive artificial lighting disrupts ecosystems, harms human health, wastes
                energy, and diminishes cultural and astronomical heritage. This event aims to bring
                together policymakers, lighting companies, and global experts to inspire actionable
                solutions for India, starting with Maharashtra.`,
    date: '1st March 2025 | 11.00am -12.30 pm IST',
    image: {
      src: '/images/milkyway-background.jpg',
      description: 'Milky Way',
    },
    slug: '/symposiums/symposium-2025',
  },
]
</script>

<template>
  <div>
    <CommonHero
      :img="{
        src: '/images/events/astrotribe-paid-events-shweta-hosting-event.png',
        alt: `AstronEra Rocket Launch Hero Image`,
        width: 1080,
        height: 720,
      }"
      :title="{
        main: 'AstronEra Symposiums',
        subtitle: 'Come Look At Our Symposiums',
      }"
      position="center"
      invert
    />
    <div
      class="pt-20 wrapper relative grid w-full grid-cols-1 items-start md:gap-4 lg:grid-cols-[0.5fr_1fr] lg:gap-8"
    >
      <BlogAdFloat />
      <div
        v-show="symposiums.length"
        class="grid grid-cols-1 md:grid-cols-2 md:gap-4 lg:gap-8"
      >
        <ProjectCard
          v-for="symposium in symposiums"
          :key="symposium.slug"
          :project="symposium"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
