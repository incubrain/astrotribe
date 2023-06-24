<template>
  <div class="min-h-[calc(100vh-60px)] text-white relative">
    <NuxtImg
      class="absolute w-full h-full top-0 left-0 object-cover bg-center bg-no-repeat"
      quality="80"
      :src="bgImg"
      format="webp"
    />
    <div class="absolute w-full h-full top-0 left-0 bg-zinc-900/40 dark:bg-zinc-900/60" />
    <div
      class="relative mx-auto gap-8 lg:gap-20 py-[40px] md:py-[80px] lg:py-[160px] px-[40px] md:px-[80px] lg:px-[160px] grid lg:grid-cols-[1.5fr,1.75fr] max-w-[1920px]"
    >
      <!-- Hero Left -->
      <div class="relative text-center items-center z-50 w-full h-full flex flex-col lg:items-start lg:text-left gap-8">
        <div class="p-4 bg-white w-24 h-24 rounded-full overflow-hidden shadow-lg ">
          <NuxtImg
            src="/astronera-logo.jpg"
          />
        </div>
        <h1 class="text-5xl font-bold leading-tight max-w-lg">
          Explore The Universe And Grow With Us
        </h1>
        <p class="text-xl font-semibold max-w-sm">
          AstroTribe is a community of astronomers and enthusiasts unveiling the mysteries of the
          cosmos together.
        </p>
        <div>
          <NuxtLink to="auth/register-interest">
            <UButton
              color="primary"
              variant="solid"
              size="xl"
            >
              Start Your Cosmic Journey
            </UButton>
          </NuxtLink>
        </div>
      </div>
      <div class="relative z-50 w-full mx-auto">
        <LightgalleryYoutube
          :media="video"
          class="w-full h-full"
        />
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
