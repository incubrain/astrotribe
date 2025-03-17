<script setup lang="ts">
const projects = [
  {
    title: 'Astrotribe',
    description: `We conducted the AstroTribe Guide Training Workshop to empower tribal students in India with astronomy knowledge and science communication skills, fostering both education and economic opportunities.
    Through hands-on training, telescope sessions, and public stargazing events, we trained 16 AstroGuides, enabling them to earn by guiding astronomy experiences.
    The project connected students with international mentors, onboarded resorts for astrotourism, and aimed to create a sustainable network for future opportunities. With continued support, we are expanding this initiative to Brazil and beyond, strengthening its global impact. 🚀✨`,
    date: '2022',
    image: {
      src: '/images/astrotribe-guide-training-India.jpg',
      description: 'Featured image for the Astrotribe Guide Training',
    },
    slug: '/projects/astrotribe',
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
        main: 'AstronEra Projects',
        subtitle: 'Come Look At Our Projects',
      }"
      position="center"
      invert
    />
    <div
      class="pt-20 wrapper relative grid w-full grid-cols-1 items-start md:gap-4 lg:grid-cols-[0.5fr_1fr] lg:gap-8"
    >
      <BlogAdFloat />
      <div
        v-show="projects.length"
        class="grid grid-cols-1 md:grid-cols-2 md:gap-4 lg:gap-8"
      >
        <ProjectCard
          v-for="project in projects"
          :key="project.slug"
          :project="project"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
