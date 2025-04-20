<script setup lang="ts">
const conferences = [
  {
    title: 'Dark Sky Conservation India Conference',
    description: `The conference effectively laid the groundwork for substantive discussions concerning
              the preservation of dark skies and the promotion of astro-tourism in India,
              successfully achieving its stated goals and objectives. In light of the insights
              garnered from this conference, the subsequent steps entail the organization of an
              in-person workshop spanning 2-3 days, aimed at convening stakeholders, government
              officials, engineers, architects, and space policy representatives.`,
    date: '24th-26th November 2023',
    image: {
      src: '/conference/photos/IDSPAC23-ruchira-huchgol.jpg',
      description: 'Featured image for the Dark Sky Conservation India Conference',
    },
    slug: '/conferences/idspac-2023',
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
        main: 'AstronEra Conferences',
        subtitle: 'Come Look At Our Conferences',
      }"
      position="center"
      invert
    />
    <div
      class="pt-20 wrapper relative grid w-full grid-cols-1 items-start md:gap-4 lg:grid-cols-[0.5fr_1fr] lg:gap-8"
    >
      <BlogAdFloat />
      <div
        v-show="conferences.length"
        class="grid grid-cols-1 md:grid-cols-2 md:gap-4 lg:gap-8"
      >
        <ProjectCard
          v-for="conference in conferences"
          :key="conference.slug"
          :project="conference"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
