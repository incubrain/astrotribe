<template>
  <div>
    <div class="grid items-start grid-cols-1 gap-6 xl:gap-12 lg:grid-cols-2">
      <CommonTitle
        class="row-start-1 col-span-1"
        :title="about.title"
        :subtitle="about.subtitle"
        :has-border="false"
      >
        <p>
          As our skies face the challenges of light pollution and environmental changes, the urgency
          to act has never been more apparent. This conference serves as a bridge connecting
          academia, policy, and public engagement, forging alliances to safeguard our shared
          treasure – the celestial tapestry above.
        </p>
      </CommonTitle>
      <div
        v-for="(section, i) in about.sections"
        :key="`about-conference-section-${i}`"
        :class="`row-start-${i + 2} col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-12`"
      >
        <div class="flex flex-col pb-3 w-full foreground rounded-md p-4 xl:p-8">
          <h4 class="text-lg xl:text-xl font-bold pb-4"> {{ section.title }}</h4>
          <UBadge
            v-for="(point, i2) in section.points"
            :key="`about-conference-point-${i2}`"
            class="mb-4"
            variant="outline"
          >
            {{ i2 + 1 }}: {{ point }}
          </UBadge>
        </div>
        <NuxtImg
          class="rounded-md"
          :class="i === 1 ? 'order-first' : 'order-last'"
          :src="section.img.src"
          :alt="section.img.alt"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const about = {
  title: 'Conference Mission',
  subtitle: 'Dark Sky Conservation Awareness',
  sections: [
    {
      title: 'Key Themes',
      img: {
        src: 'conference/shweta-kulkarni-speaking-to-group.jpg',
        alt: 'Shweta Kulkarni talking to an audience about astronomy'
      },
      points: [
        'Satellite Constellations and Space Debris Impact on Observations',
        'Astronomy in Everyday Life: Bridging Science and Culture',
        'Controlling Light Pollution for Enhanced Astronomical Visibility',
        'Advancing Astronomy Research and Outreach Initiatives',
        'Art and Astronomy: Unveiling Creative Cosmos Connections'
      ]
    },
    {
      title: 'Conference Highlights',
      img: {
        src: 'conference/audience-members-listening.jpg',
        alt: 'Shweta Kulkarni talking to an audience about astronomy'
      },
      points: [
        'Expert Panel Discussions, Working Groups, and Inspirational Keynotes',
        'Interactive Workshops on Dark Sky-Friendly Lighting Solutions and Practices',
        'Presentations Showcasing Successful Astrotourism Initiatives.',
        'Networking with Professionals and Enthusiasts from Diverse Disciplines',
        'Stargazing/Astrophotography to Experience the Splendor of Manali Skies'
      ]
    }
  ]
}
</script>
