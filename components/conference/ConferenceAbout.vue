<template>
  <div>
    <div class="grid grid-cols-1 items-start gap-6 lg:grid-cols-2 xl:gap-12">
      <CommonTitle
        class="col-start-1"
        :title="about.title"
      >
        <p>
          The International Dark Sky Preservation and Astro-Tourism Conference represented a
          groundbreaking event in India, shedding light on the critical importance of preserving
          Dark Skies and harnessing the immense potential of Astro-Tourism.
        </p>
        <p>
          The conference was held from 24th to 27th November 2023, encompassing a diverse range of
          plenary and independent talks delivered by students, young researchers, professionals, and
          entrepreneurs. Additionally, the conference facilitated interactive round table
          discussions, workshops, and working groups to encourage meaningful engagement and
          collaboration.
        </p>
      </CommonTitle>
      <div class="col-start-1 flex flex-col gap-2 lg:col-start-2">
        <p>
          The inception of this conference can be traced back to the transformative experience of
          Ms. Shweta Kulkarni, the esteemed founder and Director of AstronEra, during her visit to
          the Exmoor National Park in the United Kingdom in 2016. Subsequently, her visionary ideas
          and insights were meticulously distilled into a comprehensive proposal which in 2023 was
          accepted and funded by the Department of Science and Technology, Government of India and
          supported by the International Astronomical Union and its Office of Astronomy Development.
        </p>
        <p>
          The International Dark Sky Preservation and Astro-Tourism Conference served as a
          significant milestone in the ongoing efforts to raise awareness, foster scientific
          research, and promote sustainable practices in preserving the pristine darkness of our
          skies. By bringing together a diverse array of stakeholders, the conference provided a
          platform for exchanging knowledge, sharing best practices, and cultivating innovative
          solutions.
        </p>
        <p>
          It is hoped that the outcomes of this conference will serve as a catalyst for future
          endeavours in safeguarding our dark skies and harnessing the potential of Astro-Tourism
          for the benefit of present and future generations.
        </p>
      </div>
      <div
        class="row-start-3 grid grid-cols-1 gap-6 lg:col-span-2 lg:row-start-2 lg:grid-cols-2 xl:gap-12"
      >
        <IBImage
          :img="{
            src: themes.img.src,
            alt: themes.img.alt
          }"
          class="w-full rounded-md"
        />
        <div class="flex w-full flex-col justify-center rounded-md pb-3">
          <p class="pb-4 text-sm font-bold uppercase text-primary-500 dark:text-primary-700">
            {{ themes.title }}
          </p>
          <ul>
            <li
              v-for="(point, i2) in themes.points"
              :key="`about-conference-point-${i2}`"
              class="ml-4 list-disc pb-2"
            >
              {{ point }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const about = {
  title: {
    main: 'Uniting Stakeholders for the Preservation of Dark Skies and Astro-Tourism'
  }
}
const themes = {
  title: 'Key Themes',
  img: {
    src: 'conference/photos/IDSPAC23-shweta-and-participants.jpg',
    alt: 'Shweta Kulkarni talking to an audience about astronomy'
  },
  points: [
    'Satellite constellations and space debris impact on observations',
    'Astronomy in everyday life: bridging science and culture',
    'Controlling light pollution for enhanced astronomical visibility',
    'Advancing astronomy research and outreach initiatives',
    'Art and astronomy: unveiling creative cosmos connections'
  ]
}
</script>
