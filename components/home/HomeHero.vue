<template>
  <div>
    <div
      :style="{ backgroundImage: `url('${bgImg}')` }"
      class="absolute w-full h-full top-0 left-0 bg-cover bg-center bg-no-repeat"
    />
    <div class="absolute w-full h-full top-0 left-0 bg-black opacity-30" />
    <div
      class="relative w-full h-[100vh] gap-4 md:gap-4 lg:gap-20 py-home px-home grid lg:grid-cols-[1.5fr,1.75fr] max-w-[1920px] mx-auto"
    >
      <!-- Hero Left -->
      <div
        class="relative z-50 w-full h-full flex flex-col sm:items-center md:items-start md:text-left sm:text-center gap-4"
      >
        <div class="w-24 h-24 aspect-square rounded-full shadow-lg p-4 bg-white">
          <img
            src="/astronera-logo.jpg"
            class=""
          />
        </div>
        <h1 class="head-1 leading-tight pt-4 max-w-lg"> This is the main title </h1>
        <p class="text-xl font-semibold max-w-sm">
          Convincing people to sign up to the product in just 2 lines
        </p>
        <div class="pt-4">
          <v-btn
            color="primary"
            variant="flat"
            size="large"
          >
            Join Free Today
          </v-btn>
        </div> 
      </div>
      <!-- Hero Right -->
      <div class="relative z-50 w-full max-w-[600px] mx-auto">
        <LightgalleryYoutube
          :media="video"
          class="w-full h-full"
        >
          <p class="absolute left-0 bottom-0 mb-[-50px] w-full text-center text-xl font-semibold text-white py-2 px-4 rounded-[0_8px_8px_0]">
            AstroTribe 2022 Project in Review
          </p>
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
