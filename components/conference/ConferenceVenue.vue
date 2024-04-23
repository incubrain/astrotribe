<template>
  <div class="grid items-start grid-cols-1 gap-6 xl:gap-12 lg:grid-cols-2 relative">
    <CommonTitle
      class="row-start-1"
      :title="venue.title"
    >
      <div class="w-full leading-6 space-y-4 text-left row-start-2 h-full">
        <p class="font-normal">
          {{ venue.about }}
        </p>
        <PrimeButton
          to="https://www.manuallaya.com/"
          variant="outline"
        >
          Manu Allaya Website
        </PrimeButton>
      </div>
    </CommonTitle>
    <div class="w-full h-full">
      <BaseImage
        :img="{
          src: image.src,
          alt: image.alt,
          width: '440',
          height: '520'
        }"
        class="rounded-md mx-auto w-full"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const venue = {
  title: {
    main: 'Conference Venue, Manu Allaya',
    subtitle: 'Manali, Himachal Pradesh, India'
  },
  website: 'https://www.manuallaya.com/',
  about: `Nestled in the heart of Himachal Pradesh in India, ManuAllaya served as a celestial
    gateway, offering guests an enchanting experience under the vast expanse of the night sky
    adorned with a myriad of stars. Manu Allaya not only provided a luxurious setting but also
    embraced the rich history, art, and culture of the region, seamlessly blending it with modern
    elegance. Overall, the choice of ManuAllaya as the conference venue and the thoughtful selection of
    presentation themes contributed to creating an immersive and intellectually stimulating
    environment, enabling participants to engage deeply with the subject matter and further the
    objectives of the conference.`
}
const image = {
  src: 'conference/manu-allaya-milkyway-poster.jpg',
  alt: 'Manu Allaya resort at night with the milky way in the background'
}
</script>
