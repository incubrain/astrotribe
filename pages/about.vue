<template>
  <div>
    <div class="relative flex items-center justify-center">
      <NuxtImg
        class="w-full object-cover object-top h-[50vh] md:h-[540px]"
        :src="about.images[0].src"
        :alt="about.images[0].alt"
      />
      <h2 class="absolute z-10 text-3xl font-bold leading-7 text-white xl:text-5xl xl:leading-9">
        The AstronEra Journey
      </h2>
      <div class="absolute top-0 left-0 w-full h-full bg-black/25" />
    </div>

    <div class="flex flex-col max-w-6xl gap-12 p-4 mx-auto xl:gap-24 xl:py-24">
      <h2 class="text-3xl font-bold leading-7 text-center xl:text-4xl xl:leading-9 pt-6 xl:pt-0">
        Our Story
      </h2>

      <div class="grid items-start grid-cols-1 gap-4 lg:grid-cols-2">
        <div class="flex flex-col gap-4 xl:gap-8">
          <div
            v-for="section in about.sections"
            :key="section.title"
            class="w-full leading-6 text-left xl:w-10/12"
          >
            <h3 class="pb-4 xl:pb-8 text-2xl font-bold leading-7">
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

        <div class="w-full h-auto">
          <h3 class="pb-4 xl:pb-8 text-2xl font-bold leading-7">
            Timeline
          </h3>
          <AboutTimeline :timeline="about.timeline" />
        </div>
      </div>

      <AboutTeam />
    </div>
  </div>
</template>

<script setup lang="ts">
import about from '@/data/home/about.json'

definePageMeta({
  name: 'About',
  layout: 'home'
})
</script>
