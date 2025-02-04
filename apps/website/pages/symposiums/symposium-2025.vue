<script setup lang="ts">
const toc = [
  {
    id: 1,
    depth: 1,
    text: 'About',
  },

  {
    id: 3,
    depth: 1,
    text: 'Venue',
  },
  {
    id: 5,
    depth: 1,
    text: 'Schedule',
  },
  {
    id: 6,
    depth: 1,
    text: 'Speakers',
  },
]

// !todo: low priority - reduce the amount of text at the beginning of the page
// !todo: low priority - fix the styling of the conference schedule
// consider: creating a 20-30 second video of the conference to use as the Hero Section
</script>

<template>
  <div>
    <CommonHero
      :img="{
        src: 'images/milkyway-background.jpg',
        alt: 'Milky Way',
      }"
      :title="{
        centered: false,
        main: `IDSPS Symposium: India's Dark Sky Preservation & Sustainability`,
        subtitle: '1st March 2025 | 11.00am -12.30 pm IST',
      }"
      position="object-top"
    >
    </CommonHero>
    <div class="flex">
      <PrimeAccordion
        value="0"
        class="z-10 py-6 px-6 hidden md:block xl:gap-12 xl:py-12"
      >
        <PrimeAccordionPanel value="0">
          <PrimeAccordionHeader class="flex gap-4 bg-primary-800 px-4 py-2 rounded-md items-center">
            <h3 class="text-lg font-semibold"> Table of Contents </h3>
          </PrimeAccordionHeader>
          <PrimeAccordionContent>
            <ul>
              <li
                v-for="item in toc"
                :key="item.id"
                class="py-1"
              >
                <PrimeButton
                  :class="{
                    outline: item.text == tab,
                  }"
                  class="text-lg font-[Oswald] p-button-text"
                  @click="selectItem(item.text)"
                >
                  <h4>
                    {{ item.text }}
                  </h4>
                </PrimeButton>
              </li>
            </ul>
          </PrimeAccordionContent>
        </PrimeAccordionPanel>
      </PrimeAccordion>
      <div class="wrapper flex flex-col gap-6 py-6 xl:gap-12 xl:py-12">
        <SymposiumAbout />
        <hr />
        <SymposiumVenue />
        <hr />
        <SymposiumSchedule />
        <hr />
        <SymposiumSpeakers />
      </div>
    </div>
  </div>
</template>
