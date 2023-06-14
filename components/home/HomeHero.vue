<template>
  <div class="h-[calc(100vh-60px)] text-white">
    <div
      :style="{ backgroundImage: `url('${bgImg}')` }"
      class="absolute w-full h-full top-0 left-0 bg-cover bg-center bg-no-repeat"
    />
    <div class="absolute w-full h-full top-0 left-0 bg-zinc-900/40 dark:bg-zinc-900/60" />
    <div
      class="relative gap-4 md:gap-4 lg:gap-20 py-[40px] md:py-[80px] lg:py-[160px] px-[40px] md:px-[80px] lg:px-[160px] grid lg:grid-cols-[1.5fr,1.75fr] max-w-[1920px] mx-auto"
    >
      <!-- Hero Left -->
      <div class="relative z-50 w-full h-full flex flex-col md:items-start text-left gap-4">
        <div class="p-4 bg-white w-24 h-24 rounded-full overflow-hidden shadow-lg ">
          <NuxtImg
            src="/astronera-logo.jpg"
          />
        </div>
        <h1 class="text-5xl font-bold leading-tight pt-4 max-w-lg">
          Explore The Universe And Grow With Us
        </h1>
        <p class="text-xl font-semibold max-w-sm">
          AstroTribe is a community of astronomers and enthusiasts unveiling the mysteries of the
          cosmos together.
        </p>
        <div class="pt-4">
          <UButton
            color="primary"
            variant="solid"
            size="xl"
          >
            Start Your Cosmic Journey
          </UButton>
        </div>
      </div>
      <!-- Hero Right -->
      <div class="relative z-50 w-full max-w-[600px] md:mx-auto">
        <LightgalleryYoutube
          :media="video"
          class="w-full h-full"
        >
          <!-- <p
            class="absolute left-0 bottom-0 mb-[-50px] w-full text-center text-xl font-semibold text-white py-2 px-4 rounded-[0_8px_8px_0]"
          >
            AstroTribe 2022 Project in Review
          </p> -->
        </LightgalleryYoutube>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const video = [
  {
    id: 1,
    url: 'https://www.youtube.com/watch?v=x5ijmeCJ42s',
    thumbnail: 'hero-image.jpg',
    alt: 'Video'
  }
]

const bgImg = '/cover1.jpg'
</script>
