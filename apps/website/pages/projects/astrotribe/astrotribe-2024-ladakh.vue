<script setup lang="ts">
import { projects } from './astrotribe.json'

const project = projects.astrotribe_2024

const tab = ref('Overview')

const toc = [
  {
    id: 'About',
    depth: 1,
    text: 'About',
  },
  {
    id: 'DPS',
    depth: 1,
    text: 'DPS Manali AstroGuides',
  },
  {
    id: 'SECMOL',
    depth: 1,
    text: 'SECMOL AstroGuides',
  },
  {
    id: 'Comparison',
    depth: 1,
    text: 'Comparative Study',
  },
  {
    id: 'Evaluation',
    depth: 1,
    text: 'Comparative Evaluation',
  },
]
</script>

<template>
  <CommonHero
    :img="{
      src: 'images/astrotribe-ladakh-hp.jpg',
      alt: `Astrotribe Ladakh and Himachal Pradesh`,
    }"
    :title="{
      main: project.title,
    }"
    invert
  />
  <div class="flex p-4 py-6">
    <PrimeAccordion
      value="0"
      class="z-10 px-6 xl:gap-12"
    >
      <PrimeAccordionPanel value="0">
        <PrimeAccordionHeader class="flex gap-4 py-2 rounded-md items-center">
          <h3 class="text-lg font-semibold"> Table of Contents </h3>
        </PrimeAccordionHeader>
        <PrimeAccordionContent>
          <ul>
            <li
              v-for="item in toc"
              :key="item.id"
              class="py-1"
            >
              <NuxtLink :to="`#${item.id}`">
                {{ item.text }}
              </NuxtLink>
            </li>
          </ul>
        </PrimeAccordionContent>
      </PrimeAccordionPanel>
    </PrimeAccordion>
    <div
      id="About"
      class="flex flex-col gap-5"
    >
      <h2 class="text-2xl">About</h2>
      <p>{{ project.about }}</p>

      <div
        id="DPS"
        class="flex flex-col"
      >
        <h2 class="text-2xl">DPS Manali AstroGuides</h2>
        <div class="flex flex-col">
          <p><b>Venue: </b>{{ project.dpsManali.venue }}</p>
          <p><b>Date: </b>{{ project.dpsManali.date }}</p>
          <p><b>Conducted by: </b>{{ project.dpsManali.conductedBy }}</p>
          <h3 class="text-xl mt-2">Event Highlights:</h3>
          <ul class="list-disc ml-5">
            <li v-for="highlight in project.dpsManali.highlights">{{ highlight }}</li>
          </ul>
        </div>
      </div>

      <div
        id="SECMOL"
        class="flex flex-col"
      >
        <h2 class="text-2xl">SECMOL AstroGuides</h2>
        <div class="flex flex-col">
          <p><b>Venue: </b>{{ project.secmol.venue }}</p>
          <p><b>Conducted by: </b>{{ project.secmol.conductedBy }}</p>
          <h3 class="text-xl mt-2">Event Highlights:</h3>
          <ul class="list-disc ml-5">
            <li v-for="highlight in project.secmol.highlights">{{ highlight }}</li>
          </ul>
          <IBImage
            class="justify-self-center my-4"
            :img="{ src: project.secmol.image }"
          />
        </div>
      </div>

      <div
        id="Comparison"
        class="flex flex-col"
      >
        <h2 class="text-2xl">Comparative Study: SECMOL and Delhi Public School Manali</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LandingGlass
            hover-effect="glow"
            glow-color="blue"
            gradient="blue"
            intensity="low"
            interactive
            class="flex flex-1"
          >
            <h3 class="text-xl">SECMOL</h3>
            <p>{{ project.comparison.secmol.description }}</p>
            <h4 class="text-lg mt-2">Key Features:</h4>
            <ul class="list-disc ml-5">
              <li v-for="feature in project.comparison.secmol.features">{{ feature }}</li>
            </ul>
          </LandingGlass>

          <LandingGlass
            hover-effect="glow"
            glow-color="blue"
            gradient="blue"
            intensity="low"
            interactive
            class="flex flex-1"
          >
            <h3 class="text-xl">Delhi Public School (DPS), Manali</h3>
            <p>{{ project.comparison.dps.description }}</p>
            <h4 class="text-lg mt-2">Key Features:</h4>
            <ul class="list-disc ml-5">
              <li v-for="feature in project.comparison.dps.features">{{ feature }}</li>
            </ul>
          </LandingGlass>
        </div>

        <div class="mt-4">
          <h3 class="text-xl">Purpose of Selecting These Schools:</h3>
          <p>{{ project.comparison.purpose }}</p>
          <h4 class="text-lg mt-2">Parameters Compared:</h4>
          <ul class="list-disc ml-5">
            <li v-for="parameter in project.comparison.parameters">{{ parameter }}</li>
          </ul>
        </div>
      </div>

      <div
        id="Evaluation"
        class="flex flex-col"
      >
        <h2 class="text-2xl">Comparative Evaluation</h2>
        <div class="m-4 flex gap-2 justify-center">
          <IBImage
            v-for="image in project.evaluation.images"
            :img="{ src: image }"
            height="500"
            width="auto"
          />
        </div>
        <LandingGlass
          hover-effect="glow"
          glow-color="blue"
          gradient="blue"
          intensity="low"
          interactive
          class="flex flex-1"
        >
          <h3 class="text-xl"
            >Comparison Summary: DPS Manali vs. SECMOL AstroGuides Astronomy Knowledge</h3
          >
          <ol class="list-decimal ml-5">
            <li
              v-for="(item, index) in project.evaluation.items"
              :key="index"
            >
              <span class="font-bold">{{ item.title }}:</span>
              <ul class="list-disc ml-5">
                <li v-for="point in item.points">{{ point }}</li>
              </ul>
            </li>
          </ol>

          <h3 class="text-xl mt-4">Key Takeaways:</h3>
          <ul class="list-disc ml-5">
            <li v-for="takeaway in project.evaluation.takeaways">{{ takeaway }}</li>
          </ul>
        </LandingGlass>

        <div class="flex gap-2 justify-self-center m-6">
          <PrimeButton
            class="flex flex-col items-center justify-center"
            outlined
          >
            <h3 class="text-xl">Download the detailed project report here</h3>
          </PrimeButton>
        </div>
      </div>
    </div>
  </div>
</template>
