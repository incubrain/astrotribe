<template>
  <div class="min-h-screen text-white relative">
    <BaseImage
      :img="{
        src: bgImg,
        quality: '80',
        format: 'webp'
      }"
      class="absolute top-0 left-0 object-cover w-full h-full bg-center bg-no-repeat"
    />
    <div class="absolute top-0 left-0 w-full h-full bg-zinc-900/40 dark:bg-zinc-900/60" />
    <div
      class="relative mx-auto gap-8 xl:gap-16 py-32 px-4 md:px-16 xl:px-32 grid lg:grid-cols-[1.5fr_1.75fr] max-w-[1920px]"
    >
      <!-- Hero Left -->
      <div
        class="relative z-50 flex flex-col items-center w-full h-full gap-8 text-center lg:items-start lg:text-left"
      >
        <div
          class="w-16 h-16 lg:w-24 lg:h-24 p-2 xl:p-4 overflow-hidden bg-white rounded-full shadow-lg"
        >
          <BaseImage
            :img="{
              src: '/astronera-logo.jpg'
            }"
          />
        </div>
        <h1 class="max-w-lg text-4xl lg:text-5xl font-bold leading-tight">
          Explore The Universe And Grow With Us
        </h1>
        <p class="max-w-sm text-xl font-semibold">
          AstroTribe is a community of astronomers and enthusiasts unveiling the mysteries of the
          cosmos together.
        </p>
        <div>
          <NuxtLink to="auth/register">
            <PrimeButton @click="$posthog()?.capture('register_app', { location: 'hero_cta' })">
              Join AstronEra Today!
            </PrimeButton>
          </NuxtLink>
        </div>
      </div>
      <div class="relative z-50 w-full mx-auto h-full flex justify-center items-center">
        <AppVideoModal :video="video" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const video = {
  url: 'https://www.youtube.com/embed/x5ijmeCJ42s?si=V_t46bCe9ClaKmrN?mute=0&autoplay=1',
  thumbnail: 'images/hero-image.jpg',
  alt: 'Astron Era Hero Video'
}

const bgImg = '/astron-era-hero.jpg'
</script>
