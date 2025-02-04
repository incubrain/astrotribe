<script setup lang="ts">
const tab = ref('About')

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

const selectItem = (item: string) => {
  tab.value = item
}

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
        class="z-10 py-6 px-6 xl:gap-12 xl:py-12"
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
        <template v-if="tab == 'About'">
          <div class="flex flex-col items-start gap-6 xl:gap-12">
            <CommonTitle
              class="row-start-1"
              :title="{ main: 'About the Symposium' }"
            >
              <p
                >AstronEra proudly presents India's Dark Sky Preservation & Sustainability
                Symposium, a platform dedicated to tackling the critical issue of light pollution.
                Excessive artificial lighting disrupts ecosystems, harms human health, wastes
                energy, and diminishes cultural and astronomical heritage. This event aims to bring
                together policymakers, lighting companies, and global experts to inspire actionable
                solutions for India, starting with Maharashtra.
              </p>
            </CommonTitle>
            <CommonTitle
              class="row-start-1"
              :title="{ main: 'Why Attend?' }"
            >
              <ul class="list-disc">
                <li>Understand the ecological, health, and cultural impacts of light pollution.</li>
                <li>Learn from global experts on successful dark sky conservation initiatives.</li>
                <li
                  >Collaborate with policymakers and industries to create sustainable solutions.</li
                >
                <li
                  >Be a part of drafting policies and frameworks for dark sky preservation in
                  India.</li
                >
              </ul>
              <IBImage
                :img="{
                  src: 'symposium/light_pollution_map.jpg',
                  alt: 'https://djlorenz.github.io/astronomy/lp2022/',
                }"
              />
            </CommonTitle>
            <CommonTitle
              class="row-start-1"
              :title="{ main: 'Objectives' }"
            >
              <ul class="list-disc">
                <li
                  >Raise awareness about light pollution and its impacts on nature, humans, and
                  astronomy.</li
                >
                <li
                  >Inspire pilot projects in rural areas to measure the impact of dark sky
                  conservation efforts.</li
                >
                <li
                  >Initiate conversations about drafting policies for sustainable urban planning,
                  light pollution mitigation, and creation of dark sky reserves.</li
                >
                <li>Highlight dark skies as a fundamental right for every global citizen.</li>
              </ul>
              <IBImage
                :img="{
                  src: 'symposium/before_and_after_germany.jpg',
                  alt: 'https://www.instagram.com/darksky_intl?igsh=MWJqOGV1dGNrbGZ1OQ==',
                }"
              />
              <IBImage
                :img="{
                  src: 'symposium/before_and_after_wales.jpg',
                }"
              />
            </CommonTitle>
            <CommonTitle
              class="row-start-1"
              :title="{ main: 'Be the changemaker' }"
            >
              <p
                >This symposium offers a unique opportunity for, policymakers, and lighting
                companies to take a leadership role in combating light pollution. Together, let�s
                create a sustainable future by preserving our nightscapes.</p
              >
              <IBImage
                :img="{
                  src: 'symposium/five_principals_for_lighting.jpg',
                }"
              />
            </CommonTitle>
          </div>
        </template>
        <template v-else-if="tab == 'Venue'">
          <SymposiumVenue />
        </template>
        <template v-else-if="tab == 'Schedule'">
          <SymposiumSchedule />
        </template>
        <template v-else-if="tab == 'Speakers'">
          <SymposiumSpeakers />
        </template>
      </div>
    </div>
  </div>
</template>
