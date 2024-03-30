<template>
  <div class="min-h-[calc(100vh-var(--nav-height-lg))] text-white relative">
    <NuxtImg
      class="absolute top-0 left-0 object-cover w-full h-full bg-center bg-no-repeat"
      quality="80"
      :src="bgImg"
      format="webp"
    />
    <div class="absolute top-0 left-0 w-full h-full bg-zinc-900/40 dark:bg-zinc-900/60" />
    <div
      class="relative mx-auto gap-8 xl:gap-16 py-[40px] md:py-[80px] xl:py-[160px] px-4 md:px-16 xl:px-32 grid lg:grid-cols-[1.5fr_1.75fr] max-w-[1920px]"
    >
      <!-- Hero Left -->
      <div
        class="relative z-50 flex flex-col items-center w-full h-full gap-8 text-center lg:items-start lg:text-left"
      >
        <div
          class="w-16 h-16 lg:w-24 lg:h-24 p-2 lg:p-4 overflow-hidden bg-white rounded-full shadow-lg"
        >
          <NuxtImg src="/astronera-logo.jpg" />
        </div>
        <h1 class="max-w-lg text-4xl lg:text-5xl font-bold leading-tight">
          Explore The Universe And Grow With Us
        </h1>
        <p class="max-w-sm text-xl font-semibold">
          AstroTribe is a community of astronomers and enthusiasts unveiling the mysteries of the
          cosmos together.
        </p>
        <div>
          <PrimeButton
            color="primary"
            variant="solid"
            size="xl"
            to="auth/register"
            @click="$posthog()?.capture('register_app', { location: 'hero_cta' })"
          >
            Begin your cosmic journey now!
          </PrimeButton>
        </div>
      </div>
      <div class="relative z-50 w-full mx-auto">
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
