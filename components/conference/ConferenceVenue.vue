<template>
  <div class="grid items-start grid-cols-1 gap-6 xl:gap-12 lg:grid-cols-2 relative">
    <ConferenceTitle
      class="lg:col-start-2 row-start-1"
      :title="venue.title"
      :subtitle="venue.subtitle"
    >
      <div class="w-full leading-6 space-y-4 text-left row-start-2 h-full">
        <h4 class="text-md font-semibold leading-7"> Why Manu Allaya? </h4>
        <p class="text-sm font-normal">
          {{ venue.about }}
        </p>
        <UButton to="https://www.manuallaya.com/"> More Info </UButton>
      </div>
    </ConferenceTitle>
    <div class="w-full grid grid-cols-2 gap-6 xl:gap-12 h-auto row-start-2 lg:col-span-2">
      <NuxtImg
        v-for="img in venue.images"
        :key="img.src"
        class="rounded-md"
        :src="img.src"
        :alt="img.alt"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const venue = {
  title: 'Conference Venue',
  subtitle: 'Manu Allaya, Manali, Himachal Pradesh, India',
  website: 'https://www.manuallaya.com/',
  about:
    "Nestled under the expansive canopy of the Himalayan skies, ManuAllaya is not just a luxury resort but a celestial gateway. Here, the night comes alive with the brilliance of a thousand stars, offering unparalleled views of the mesmerizing Milky Way. Located in the heart of Himachal, this resort celebrates the region's rich history, art, and culture while seamlessly blending it with modern elegance.",
  images: [
    {
      src: 'conference/manu-allaya-milkyway-poster.jpg',
      alt: 'Manu Allaya resort at night with the milky way in the background'
    },
    {
      src: 'conference/manu-allaya-courtyard-mountains.jpg',
      alt: 'Views of the Himalayan mountains from the Manu Allaya resort'
    }
  ]
}
</script>
