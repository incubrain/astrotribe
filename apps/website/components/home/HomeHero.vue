<template>
  <div class="relative min-h-screen text-white">
    <IBImage
      :img="{
        src: bgImg,
        quality: '80',
        format: 'webp',
      }"
      class="absolute left-0 top-0 h-full w-full bg-center bg-no-repeat object-cover"
    />
    <div class="absolute left-0 top-0 h-full w-full bg-zinc-900/60" />
    <div
      class="relative mx-auto grid max-w-[1920px] gap-8 px-4 py-32 md:px-16 lg:grid-cols-[1.5fr_1.75fr] xl:gap-16 xl:px-32"
    >
      <!-- Hero Left -->
      <div
        class="relative z-50 flex h-full w-full flex-col items-center gap-8 text-center lg:items-start lg:text-left"
      >
        <div
          class="h-16 w-16 overflow-hidden rounded-full bg-white p-2 shadow-lg lg:h-24 lg:w-24 xl:p-4"
        >
          <IBImage
            :img="{
              src: '/astronera-logo.jpg',
            }"
          />
        </div>
        <h1 class="max-w-lg text-4xl font-bold leading-tight lg:text-5xl">
          Explore The Universe And Grow With Us
        </h1>
        <p class="max-w-sm text-xl font-semibold">
          AstroTribe is a community of astronomers and enthusiasts unveiling the mysteries of the
          cosmos together.
        </p>
        <div>
          <NuxtLink :to="`${$config.public.aeAuthUrl}/register`">
            <PrimeButton> Signup, it's FREE! </PrimeButton>
          </NuxtLink>
        </div>
      </div>
      <div class="relative z-50 mx-auto flex h-full w-full items-center justify-center">
        <AppVideoModal :video="video" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const video = {
  url: 'https://www.youtube.com/embed/x5ijmeCJ42s?si=V_t46bCe9ClaKmrN?mute=0&autoplay=1',
  thumbnail: 'images/hero-image.jpg',
  alt: 'Astron Era Hero Video',
}

const bgImg = '/astron-era-hero.jpg'
</script>
