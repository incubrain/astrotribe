<template>
  <div>
    <CommonTitle
      class="w-full lg:w-1/2 mx-auto foreground"
      :title="about.title"
      :subtitle="about.subtitle"
    >
      <div class="w-full leading-6 space-y-4 text-left row-start-2 h-full">
        <p class="text-sm font-normal">
          {{ about.info }}
        </p>
        <div
          v-for="(theme, ti) in about.themes"
          :key="`poster-competition-theme-${ti}`"
        >
          <UAlert
            variant="soft"
            color="sky"
            :title="theme.title"
            :description="theme.body"
          />
        </div>
        <p class="text-sm font-normal border-t border-color pt-4">
          <strong>Expectation from Participants:</strong>
          Address the aforementioned themes, articulating both the challenges and potential
          solutions. Visual creativity and clarity will be paramount.
        </p>
      </div>
    </CommonTitle>
    <CommonTwoColumn>
      <div class="foreground row-start-2 flex flex-col gap-4 rounded-md p-4 xl:p-8 h-full">
        <div
          v-for="(section, i) in about.sections"
          :key="`competition-section-${i}`"
          class="flex flex-col pb-3 w-full"
        >
          <h4 class="text-lg font-semibold pb-4"> {{ section.title }}</h4>
          <div class="space-y-2">
            <p
              v-for="(point, i2) in section.points"
              :key="`competition-section-point-${i2}`"
              class="text-base"
            >
              {{ point }}
            </p>
          </div>
        </div>
      </div>
      <div class="flex flex-col row-start-3 lg:row-start-2 gap-6 xl:gap-12">
        <NuxtImg
          class="rounded-md h-full"
          :src="image.src"
          :alt="image.alt"
          fit="fill"
        />
      </div>
    </CommonTwoColumn>
  </div>
</template>

<script setup lang="ts">
const image = {
  src: 'competition/astronera-poster-competition-details.jpg',
  alt: 'Shweta Kulkarni talking to an audience about astronomy'
}

const about = {
  title: 'Competition Objective',
  subtitle: 'Spotlight on Light Pollution',
  info: 'Highlight the pressing challenges surrounding the escalating issue of light pollution. Through the medium of posters, participants are urged to delineate the identified problems and propose viable solutions.',
  themes: [
    {
      title: 'Importance of DARK SKY PRESERVATION',
      body: 'Emphasize the significance of maintaining natural darkness for the benefit of our ecosystem and heritage.'
    },
    {
      title: 'Dark Sky Conservation and Implementation for SDGs',
      body: 'Connect the goal of preserving dark skies with the Sustainable Development Goals, elucidating how they can be symbiotic.'
    },
    {
      title: 'Satellite Constellation - A Challenge for Astronomy',
      body: 'Shed light on how the increasing number of satellites can obstruct astronomical observations and study.'
    },
    {
      title: 'Astro-tourism: The Emerging Frontier',
      body: 'Dive into the potential of astro-tourism as an industry and how it can promote the preservation of dark skies.'
    },
    {
      title: 'Indian Astronomy: Past and Future',
      body: 'Trace the legacy of astronomical studies in India and envision its future against the backdrop of current challenges.'
    },
    {
      title: 'Increasing Light Pollution',
      body: 'Highlight the growing concern of urban light pollution, its adverse impacts, and the urgent need for mitigation.'
    }
  ],

  sections: [
    {
      title: 'Challenge',
      points: [
        'Deliver ideas on the specified topics following submission guidelines.',
        'Use visual interpretations and graphics for a lasting impact.',
        'Minimize word usage.',
        'Entries are judged on clarity and creativity. Ensure concepts are easily understandable and showcase innovative thinking that challenges conventional views.'
      ]
    },
    {
      title: 'Opportunity',
      points: [
        'Share your perspectives on preserving our Dark Skies against urbanization and ensure their appreciation by future generations.',
        'Present your ideas at the Dark Sky Preservation and Conservation Conference in Manali, in collaboration with the Central government and the International Astronomical Union.',
        'Recognize the multifaceted threat leading us towards starless skies.'
      ]
    }
  ]
}
</script>
