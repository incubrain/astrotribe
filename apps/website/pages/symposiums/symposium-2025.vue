<script setup lang="ts">
const toc = [
  {
    id: 1,
    depth: 1,
    text: 'About',
    link: 'about',
  },

  {
    id: 3,
    depth: 1,
    text: 'Venue',
    link: 'venue',
  },
  {
    id: 5,
    depth: 1,
    text: 'Schedule',
    link: 'schedule',
  },
  {
    id: 6,
    depth: 1,
    text: 'Speakers',
    link: 'speakers',
  },
  {
    id: 7,
    depth: 1,
    text: 'Brochure',
    link: 'brochure',
  },
  {
    id: 8,
    depth: 1,
    text: 'Watch Stream',
    link: 'watchLive',
  },
]

// !todo: low priority - reduce the amount of text at the beginning of the page
// !todo: low priority - fix the styling of the conference schedule
// consider: creating a 20-30 second video of the conference to use as the Hero Section
</script>

<template>
  <div class="relative">
    <CommonHero
      :img="{
        src: 'images/milkyway-background.jpg',
        alt: 'Milky Way',
      }"
      :title="{
        centered: false,
        main: `IDSPS Symposium: India's Dark Sky Policy & Sustainability`,
        subtitle: '1st March 2025 | 11.00am -12.30 pm IST',
      }"
      position="object-top"
    >
    </CommonHero>
    <div class="flex min-h-screen">
      <div class="hidden md:block w-1/4 h-full sticky top-0">
        <PrimeAccordion
          value="0"
          class="z-10 py-6 px-6 xl:gap-12 xl:py-12"
        >
          <PrimeAccordionPanel value="0">
            <PrimeAccordionHeader
              class="flex gap-4 bg-primary-800 px-4 py-2 rounded-md items-center"
            >
              <h3 class="text-lg font-semibold"> Table of Contents </h3>
            </PrimeAccordionHeader>
            <PrimeAccordionContent>
              <ul>
                <li
                  v-for="item in toc"
                  :key="item.id"
                  class="py-1"
                >
                  <NuxtLink
                    :to="`#${item.link}`"
                    class="text-lg font-[Oswald] p-button-text"
                  >
                    <h4>
                      {{ item.text }}
                    </h4>
                  </NuxtLink>
                </li>
              </ul>
            </PrimeAccordionContent>
          </PrimeAccordionPanel>
        </PrimeAccordion>
      </div>
      <div class="wrapper w-screen flex flex-col gap-6 py-6 xl:gap-12 xl:py-12">
        <SymposiumAbout id="about" />
        <hr />
        <SymposiumVenue id="venue" />
        <hr />
        <SymposiumSchedule id="schedule" />
        <hr />
        <SymposiumSpeakers id="speakers" />
        <hr />
        <div class="flex flex-col gap-2 md:flex-row">
          <SymposiumPDFResource
            id="brochure"
            pdf="/symposium/idsps_symposium_report.pdf"
            label="Report"
          />
          <SymposiumPDFResource
            id="brochure"
            pdf="/symposium/brochure_symposium_2025.pdf"
            label="Brochure"
          />
        </div>
        <hr />
        <div
          id="watchLive"
          class="w-full aspect-video"
        >
          <iframe
            class="w-full h-full"
            src="https://www.youtube.com/embed/_Du8pF2pru4?si=oAh8KtSqxrSJbGWg"
            title="IDSPS Symposium: India's Dark Sky Policy & Sustainability"
            frameborder="0"
            allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          />
        </div>
      </div>
    </div>
    <Mascot />
  </div>
</template>
