<script setup lang="ts">
import { projects } from './astrotribe.json'

const project = projects.astrotribe_2023

const tab = ref('overview')

const toc = [
  {
    id: 'about',
    depth: 1,
    text: 'About',
  },
  {
    id: 'evaluation',
    depth: 1,
    text: 'Evaluation',
  },
  {
    id: 'achievements',
    depth: 1,
    text: 'Astroguide Achievements',
  },
  {
    id: 'stargazing',
    depth: 1,
    text: 'Independent Stargazing Events',
  },
  {
    id: 'resorts',
    depth: 1,
    text: 'Certified Resort Collaborations',
  },
]
</script>

<template>
  <CommonHero
    :img="{
      src: 'images/astrotribe-guide-training-India.jpg',
      alt: `Astrotribe Guide Training`,
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
      id="about"
      class="flex flex-col gap-5"
    >
      <h2 class="text-2xl">About</h2>
      <p>{{ project.about }}</p>
      <div
        id="Evaluation"
        class="flex flex-col"
      >
        <h2 class="text-2xl">{{ project.evaluation.title }}</h2>
        <IBImage
          class="justify-self-center"
          :img="{ src: project.evaluation.image }"
        />
        <p>{{ project.evaluation.text }}</p>
      </div>
      <div id="Achievements">
        <h2 class="text-2xl">{{ project.achievements.title }}</h2>
        <p v-for="(text, index) in project.achievements.text" :key="index">{{ text }}</p>
      </div>
      <div id="Stargazing">
        <h2 class="text-2xl">{{ project.stargazingEvents.title }}</h2>
        <p><b>Venue: </b>{{ project.stargazingEvents.venue }}</p>
        <p><b>Date: </b>{{ project.stargazingEvents.date }}</p>
        <p>{{ project.stargazingEvents.text }}</p>
      </div>
      <div id="Resorts">
        <h2 class="text-2xl">{{ project.resortCollabs.title }}</h2>
        <p v-for="(resort, index) in project.resortCollabs.resorts" :key="index">{{ resort }}</p>
      </div>
    </div>
  </div>
</template>
