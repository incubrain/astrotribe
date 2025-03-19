<script setup lang="ts">
import astrotribe from './astrotribe.json'

const tab = ref('Overview')

const toc = [
  {
    id: 'Overview',
    depth: 1,
    text: 'Overview',
  },
  {
    id: 'About',
    depth: 1,
    text: 'About',
  },
  {
    id: 'Astroguides',
    depth: 1,
    text: 'Astroguides',
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
      main: astrotribe.title,
    }"
    invert
  />

  <div class="flex p-4">
    <PrimeAccordion
      value="0"
      class="z-10 py-6 px-6 xl:gap-12 xl:py-12"
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
              <NuxtLink :to="`#${item.text}`">
                {{ item.text }}
              </NuxtLink>
            </li>
          </ul>
        </PrimeAccordionContent>
      </PrimeAccordionPanel>
    </PrimeAccordion>
    <div class="flex gap-2 flex-col">
      <h1
        id="Overview"
        class="text-2xl"
        >Overview</h1
      >
      <div class="flex">
        <LandingGlass
          hover-effect="glow"
          glow-color="blue"
          gradient="blue"
          intensity="low"
          interactive
          class="flex flex-1"
        >
          <p class="text-base mb-6">{{ astrotribe.overview.description }}</p>
          <div class="flex mb-6">
            <div
              class="flex gap-2 items-center text-center flex-col justify-center flex-wrap"
              v-for="sdg in astrotribe.overview.sdgs"
            >
              <IBImage :img="{ src: sdg.image }" />
              <h4>{{ sdg.title }}</h4>
            </div>
          </div>
          <p class="text-base mb-6">{{ astrotribe.overview.joinUs }}</p>
        </LandingGlass>
        <div class="flex flex-2">
          <IBImage
            v-for="image in astrotribe.overview.logos"
            :img="{ src: image }"
            layout="intrinsic"
            width="300"
            height="auto"
            class="max-w-full"
          />
        </div>
      </div>
      <hr />
      <div
        id="About"
        class="row-start-1"
      >
        <h1 class="text-2xl">About</h1>
        <p>{{ astrotribe.about.text }}</p>
        <LandingGlass
          hover-effect="glow"
          glow-color="blue"
          gradient="blue"
          intensity="low"
          interactive
          class="flex flex-1"
          v-for="section in astrotribe.about.sections"
        >
          <h2>{{ section.name }}</h2>
          {{ section.text }}
        </LandingGlass>
        <div class="flex gap-2 justify-self-center m-6">
          <NuxtLink
            v-for="project in astrotribe.about.projects"
            :to="project.link"
          >
            <PrimeButton
              class="flex flex-col items-center justify-center"
              outlined
            >
              <h2 class="text-2xl">{{ project.title }}</h2>
              {{ project.subtitle }}
            </PrimeButton>
          </NuxtLink>
        </div>
        <div class="flex gap-2 flex-col justify-self-center m-6">
          <h2 class="text-center text-2xl">Resources</h2>
          <NuxtLink
            :to="social.link"
            target="_blank"
            rel="noopener"
            class="flex items-center gap-2"
            v-for="social in astrotribe.about.socials"
          >
            <Icon
              :name="social.icon"
              size="24px"
            />
            <p>{{ social.text }}</p>
          </NuxtLink>
        </div>
      </div>
      <hr />
      <CommonTitle
        v-if="tab == 'Programs & Training'"
        :title="{ main: 'Programs & Training' }"
        class="row-start-1"
      >
        AstroTribe’s multi-level training equips students to become skilled AstroGuides.<br />
        <h1>Level 1:</h1>
        Foundation Training Topics: Earth’s motion, astronomical terms, solar system, cosmic
        address. Activities: Interactive models, simulations, public speaking practice. Example:
        4th-6th July 2023, EMRS Ajmer Saundane (44 tribal, 3 non-tribal students).
        <h1>Level 2: Advanced Training</h1>
        Topics: Telescopes, stellar life cycles, exoplanets, mythology in constellations.
        Activities: Stargazing, telescope handling, VR experiences, event planning. Example:
        12th-14th October 2023, EMRS Ajmer Saundane (16 tribal, 3 non-tribal students).
        <h1>Independent Events:</h1> Trained AstroGuides lead public stargazing sessions, applying
        their skills practically.
      </CommonTitle>
      <div
        id="Astroguides"
        class="pt-4 lg:pt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-8"
      >
        <ProjectAstroguideCard
          v-for="astroguide in astrotribe.astroguides"
          :astroguide="astroguide"
        />
      </div>
    </div>
  </div>
</template>
