<script setup lang="ts">
import { ref } from 'vue'
import astrotribe from './astrotribe.json'

const tab = ref('overview')

const toc = [
  { id: 'overview', text: 'Overview' },
  { id: 'about', text: 'About' },
  { id: 'astroguides', text: 'Astroguides' },
]

const scrollToSection = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' })
  }
}
</script>

<template>
  <CommonHero
    :img="{ src: 'images/astrotribe-guide-training-India.jpg', alt: `Astrotribe Guide Training` }"
    :title="{ main: astrotribe.title }"
    invert
  />

  <!-- Sticky Tabs Nav -->
  <nav class="sticky top-0 z-50 bg-black border-b border-slate-700 text-white shadow-md">
    <div class="max-w-screen-xl mx-auto flex overflow-x-auto gap-4 px-4 py-2 text-sm lg:text-base">
      <button
        v-for="item in toc"
        :key="item.id"
        class="px-3 py-1 rounded-md transition-all"
        :class="{
          'bg-blue-700 text-white': tab === item.id,
          'hover:bg-slate-800': tab !== item.id,
        }"
        @click="((tab = item.id), scrollToSection(item.id))"
      >
        {{ item.text }}
      </button>
    </div>
  </nav>

  <div class="flex wrapper flex-col px-4 py-8 gap-12">
    <!-- Overview -->
    <section id="overview">
      <h1 class="text-2xl mb-4">Overview</h1>
      <div class="flex flex-col lg:flex-row gap-6">
        <LandingGlass
          hover-effect="glow"
          glow-color="blue"
          gradient="blue"
          intensity="low"
          interactive
          class="flex-1"
        >
          <p class="text-base mb-6">{{ astrotribe.overview.description }}</p>
          <div class="flex mb-6 flex-wrap gap-4 justify-center">
            <div
              v-for="sdg in astrotribe.overview.sdgs"
              :key="sdg.title"
              class="flex flex-col items-center text-center max-w-[120px]"
            >
              <IBImage :img="{ src: sdg.image }" />
              <h4 class="mt-2 text-sm">{{ sdg.title }}</h4>
            </div>
          </div>
          <p class="text-base">{{ astrotribe.overview.joinUs }}</p>
        </LandingGlass>

        <div class="flex-1 flex flex-wrap justify-center items-center gap-4">
          <IBImage
            v-for="(image, index) in astrotribe.overview.logos"
            :key="index"
            :img="{ src: image }"
            layout="intrinsic"
            width="240"
            class="max-w-[240px]"
          />
        </div>
      </div>
    </section>

    <!-- About -->
    <section id="about">
      <h1 class="text-2xl mb-4">About</h1>
      <p class="mb-6">{{ astrotribe.about.text }}</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <IBGlass
          v-for="(section, index) in astrotribe.about.sections"
          :key="index"
          hover-effect="glow"
          glow-color="purple"
          gradient="mixed"
          intensity="low"
          interactive
          padding
        >
          <h3 class="text-2xl font-bold mb-4 text-white">{{ section.name }}</h3>
          <p class="text-base mb-2">{{ section.text }}</p>
        </IBGlass>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        <IBGlass
          v-for="project in astrotribe.about.projects"
          :key="project.title"
          glow-color="blue"
          gradient="blue"
          class="text-center"
        >
          <NuxtLink :to="project.link">
            <h2 class="text-xl font-bold mb-1">{{ project.title }}</h2>
            <p class="text-sm text-slate-400">{{ project.subtitle }}</p>
          </NuxtLink>
        </IBGlass>
      </div>

      <div class="mt-12">
        <IBGlass
          gradient="purple"
          class="p-4 md:p-6 max-w-lg mx-auto"
        >
          <h3 class="text-xl font-semibold mb-4">Resources</h3>
          <ul class="space-y-2">
            <li
              v-for="social in astrotribe.about.socials"
              :key="social.text"
              class="flex items-center gap-2"
            >
              <Icon
                :name="social.icon"
                size="20px"
              />
              <NuxtLink
                :to="social.link"
                target="_blank"
                rel="noopener"
                class="hover:underline"
              >
                {{ social.text }}
              </NuxtLink>
            </li>
          </ul>
        </IBGlass>
      </div>
    </section>

    <!-- Astroguides -->
    <section id="astroguides">
      <h2 class="text-2xl mb-4">Astroguides</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        <ProjectAstroguideCard
          v-for="(astroguide, index) in astrotribe.astroguides"
          :key="`astroguide-${index}-${astroguide.given_name}`"
          :astroguide="astroguide"
        />
      </div>
    </section>
  </div>
</template>
