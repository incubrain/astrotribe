<template>
  <div class="relative grid grid-cols-1 items-start gap-6 lg:grid-cols-2 xl:gap-12">
    <CommonTitle
      class="row-start-1"
      :title="venue.title"
    >
      <div class="row-start-2 h-full w-full space-y-4 text-left leading-6">
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
    <div class="h-full w-full">
      <IbImage
        :img="{
          src: image.src,
          alt: image.alt,
          width: '440',
          height: '520',
        }"
        class="mx-auto w-full rounded-md"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const venue = {
  title: {
    main: 'Conference Venue, Manu Allaya',
    subtitle: 'Manali, Himachal Pradesh, India',
  },
  website: 'https://www.manuallaya.com/',
  about: `Nestled in the heart of Himachal Pradesh in India, ManuAllaya served as a celestial
    gateway, offering guests an enchanting experience under the vast expanse of the night sky
    adorned with a myriad of stars. Manu Allaya not only provided a luxurious setting but also
    embraced the rich history, art, and culture of the region, seamlessly blending it with modern
    elegance. Overall, the choice of ManuAllaya as the conference venue and the thoughtful selection of
    presentation themes contributed to creating an immersive and intellectually stimulating
    environment, enabling participants to engage deeply with the subject matter and further the
    objectives of the conference.`,
}
const image = {
  src: 'conference/manu-allaya-milkyway-poster.jpg',
  alt: 'Manu Allaya resort at night with the milky way in the background',
}
</script>
