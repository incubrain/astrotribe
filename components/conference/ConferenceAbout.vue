<template>
  <div>
    <div class="grid items-start grid-cols-1 gap-6 xl:gap-12 lg:grid-cols-2">
      <CommonTitle
        class="row-start-1 col-span-1"
        :title="about.title"
      >
        <p> </p>
      </CommonTitle>
      <div
        v-for="(section, i) in about.sections"
        :key="`about-conference-section-${i}`"
        :class="`row-start-${i + 2} col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-12`"
      >
        <div
          class="flex flex-col pb-3 w-full border border-color justify-center background rounded-md p-4 xl:p-8"
        >
          <h4
            class="text-lg xl:text-xl font-bold pb-4 underline"
          >
            {{ section.title }}
          </h4>
          <p
            v-for="(point, i2) in section.points"
            :key="`about-conference-point-${i2}`"
            class="pb-2 text-sm"
          >
            {{ point }}
          </p>
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
  title: {
    label: 'Conference Mission',
    main: 'Dark Sky Conservation Awareness',
    subtitle: `As our skies face the challenges of light pollution and environmental changes, the urgency
          to act has never been more apparent. This conference serves as a bridge connecting
          academia, policy, and public engagement, forging alliances to safeguard our shared
          treasure – the celestial tapestry above.`
  },
  sections: [
    {
      title: 'Key Themes',
      img: {
        src: 'conference/shweta-kulkarni-speaking-to-group.jpg',
        alt: 'Shweta Kulkarni talking to an audience about astronomy'
      },
      points: [
        'Satellite constellations and space debris impact on observations',
        'Astronomy in everyday life: bridging science and culture',
        'Controlling light pollution for enhanced astronomical visibility',
        'Advancing astronomy research and outreach initiatives',
        'Art and astronomy: unveiling creative cosmos connections'
      ]
    },
    {
      title: 'Conference Highlights',
      img: {
        src: 'conference/audience-members-listening.jpg',
        alt: 'Shweta Kulkarni talking to an audience about astronomy'
      },
      points: [
        'Expert panel discussions, working groups, and inspirational keynotes',
        'Workshops on dark sky friendly lighting solutions/practices',
        'Presentations showcasing successful astrotourism initiatives.',
        'Networking with professionals and enthusiasts from diverse disciplines',
        'Stargazing/astrophotography to experience the Manali skies'
      ]
    }
  ]
}
</script>
