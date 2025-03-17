<template>
  <div>
    <IBImageHero
      :img="about.images[0]"
      :title="{
        main: 'The AstronEra Journey',
      }"
      fit="cover"
      object-position="center"
    />
    <div class="wrapper mx-auto flex flex-col gap-12 xl:gap-24 xl:py-24">
      <div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-12">
        <LandingGlass>
          <h3 class="pb-4 text-2xl font-bold leading-7"> The Mission </h3>
          <p class="pb-3 text-base font-normal">
            {{ about.mission }}
          </p>
        </LandingGlass>
        <LandingGlass>
          <h3 class="pb-4 text-2xl font-bold leading-7"> The Vision </h3>
          <p class="pb-3 text-base font-normal">
            {{ about.vision }}
          </p>
        </LandingGlass>
        <div class="flex flex-col gap-8">
          <div
            v-for="section in about.sections"
            :key="section.title"
            class="w-full text-left leading-6"
          >
            <h3 class="pb-4 text-2xl font-bold leading-7 xl:pb-8">
              {{ section.title }}
            </h3>
            <p
              v-for="item in section.paragraphs"
              :key="item"
              class="pb-3 text-base font-normal"
            >
              {{ item }}
            </p>
          </div>
        </div>

        <div class="h-auto w-full">
          <h3 class="pb-4 text-2xl font-bold leading-7"> Timeline </h3>
          <AboutTimeline :timeline="about.timeline" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import about from '../data/home/about.json'

definePageMeta({
  name: 'About',
})
</script>
