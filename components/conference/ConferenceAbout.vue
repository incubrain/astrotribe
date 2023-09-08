<template>
  <div>
    <div class="grid items-start grid-cols-1 gap-6 xl:gap-12 lg:grid-cols-2">
      <CommonTitle
        class="row-start-1 col-span-1"
        :title="about.title"
        :subtitle="about.subtitle"
      />
      <div
        class="foreground justify-between row-start-2 flex flex-col gap-4 rounded-md p-4 xl:p-8 h-full"
      >
        <div
          v-for="(section, i) in about.sections"
          :key="`about-conference-section-${i}`"
          class="flex flex-col pb-3 w-full"
        >
          <h4 class="text-lg font-semibold pb-4"> {{ section.title }}</h4>
          <ul class="list-disc space-y-2">
            <li
              v-for="(point, i2) in section.points"
              :key="`about-conference-point-${i2}`"
              class="text-sm mx-4"
            >
              {{ point }}
            </li>
          </ul>
        </div>
      </div>
      <div class="flex flex-col row-start-3 lg:row-start-2 gap-6 xl:gap-12">
        <NuxtImg
          v-for="(img, i) in images"
          :key="i"
          class="rounded-md"
          :src="img.src"
          :alt="img.alt"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const images = [
  {
    src: 'conference/shweta-kulkarni-speaking-to-group.jpg',
    alt: 'Shweta Kulkarni talking to an audience about astronomy'
  },
  {
    src: 'conference/audience-members-listening.jpg',
    alt: 'Shweta Kulkarni talking to an audience about astronomy'
  }
]

const about = {
  title: 'INTRODUCTION',
  subtitle:
    'As our skies face the challenges of light pollution and environmental changes, the urgency to act has never been more apparent. This conference serves as a bridge connecting academia, policy, and public engagement, forging alliances to safeguard our shared treasure – the celestial tapestry above.',
  sections: [
    {
      title: 'Key Themes:',
      points: [
        'Satellite Constellations and Space Debris Impact on Observations',
        'Astronomy in Everyday Life: Bridging Science and Culture',
        'Controlling Light Pollution for Enhanced Astronomical Visibility',
        'Advancing Astronomy Research and Outreach Initiatives',
        'Art and Astronomy: Unveiling Creative Cosmos Connections'
      ]
    },
    {
      title: 'Conference Highlights:',
      points: [
        'Expert Panel Discussions, Working Groups, and Inspirational Keynote Speeches',
        'Interactive Workshops on Dark Sky-Friendly Lighting Solutions and Practices',
        'Presentations Showcasing Successful Astrotourism Initiatives from Around the Globe',
        'Networking Opportunities with Professionals and Enthusiasts from Diverse Disciplines',
        "Stargazing and Astrophotography Sessions to Experience the Night Sky's Splendor Firsthand"
      ]
    }
  ]
}
</script>
