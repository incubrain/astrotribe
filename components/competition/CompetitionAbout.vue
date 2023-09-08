<template>
  <div>
    <CommonTitle
      class="w-full lg:w-1/2 mx-auto"
      :title="about.title"
      :subtitle="about.subtitle"
    >
      <div class="w-full leading-6 space-y-4 text-left row-start-2 h-full">
        <p class="text-sm font-normal">
          In our world filled with artificial light, we often overlook the significance of dark
          skies. Beneath the city's glow is a celestial realm, offering not just stargazing
          opportunities, but a connection to the universe's mysteries.
        </p>
        <p class="text-sm font-normal">
          Dark skies reveal galaxies, guiding constellations, and gleaming planets, grounding us in
          cosmic wonder and humility. Moreover, combating light pollution is essential. It disturbs
          ecosystems, impacts wildlife, wastes energy, and disrupts our sleep, affecting our health.
        </p>
        <p class="text-sm font-normal">
          Recognizing the importance of dark skies urges us to combat light pollution, advocating
          for energy-efficient illumination and protecting our planet's natural night. As we embrace
          modernity, preserving these celestial wonders is crucial.
        </p>

        <UButton to="/conference">Conference Info</UButton>
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
  title: 'About',
  subtitle: 'Posters For Dark Sky Conservation India Conference',
  info: '',
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
