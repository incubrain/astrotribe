<template>
  <div>
    <div class="relative flex justify-center items-center">
      <NuxtImg
        class="w-full object-cover object-top h-[540px]"
        :src="about.images[0].src"
        :alt="about.images[0].alt"
      />
      <h2 class="absolute z-10 font-bold text-3xl lg:text-5xl leading-7 lg:leading-9 text-white">
        The AstronEra Journey
      </h2>
      <div class="absolute left-0 top-0 w-full h-full bg-black/25" />
    </div>

    <div class="max-w-6xl mx-auto flex flex-col gap-12 lg:gap-24 p-6 lg:py-24">
      <h2 class="font-bold text-3xl lg:text-4xl leading-7 lg:leading-9 text-center"> Our Story </h2>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div class="flex flex-col gap-8">
          <div
            v-for="section in about.sections"
            :key="section.title"
            class="leading-6 w-full xl:w-10/12 text-left"
          >
            <h3 class="font-bold text-xl leading-7 pb-4">{{ section.title }}</h3>
            <p
              v-for="item in section.paragraphs"
              :key="item"
              class="font-normal text-base pb-3"
            >
              {{ item }}
            </p>
          </div>
        </div>

        <div class="w-full h-auto">
          <h3 class="font-bold text-xl leading-7 pb-4">Timeline</h3>
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
