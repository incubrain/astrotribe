<template>
  <div class="w-full bg-primary-600 dark:bg-primary-950 text-white">
    <div class="wrapper padded-x flex flex-col gap-6 xl:gap-12 py-6 xl:py-12">
      <div class="grid items-start grid-cols-1 gap-8 xl:gap-12 lg:grid-cols-2 w-full h-full">
        <div class="flex flex-col">
          <CommonTitle
            :title="manali.title"
            label-white
          />
          <p v-html="manali.about" />
        </div>
        <div class="flex flex-col justofy-center h-full w-full gap-4">
          <h3 class="text-2xl font-semibold">More Info</h3>
          <div class="flex gap-4 flex-wrap items-center w-full'">
            <UButton
              v-for="info in manali.info"
              :key="info.title"
              :to="info.url"
              :disabled="info.disabled || false"
              color="white"
            >
              {{ info.title }}
            </UButton>
          </div>
        </div>
        <div
          class="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-12 h-auto row-start-2 lg:col-span-2"
        >
          <NuxtImg
            v-for="img in images"
            :key="img.src"
            class="rounded-md"
            :src="img.src"
            :alt="img.alt"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const manali = {
  title: {
    label: 'Visit Manali',
    main: 'Tucked away in the Himalayas'
  },
  about: `
    Nestled in the heart of the Himalayas, Manali is a tapestry of rich history and vibrant traditions.
    Often dubbed the "Valley of the Gods", this picturesque town offers not only pristine landscapes but also clear, pollution-free night skies that promise enchanting views of the Milky Way.
    <br>
    <br>
    As you wander its terrains, from the tranquil Hadimba Temple to the exhilarating Solang Valley or the therapeutic hot springs of Vashisht, Manali effortlessly weaves nature's beauty with cultural charm, making it an idyllic backdrop for an astronomy event.`,
  info: [
    {
      title: 'Visa Info',
      url: 'https://www.handyvisas.com/visa-policy/india/'
    },
    {
      title: 'Tourist Attractions',
      url: 'https://www.tourmyindia.com/blog/best-places-visit-manali-himachal/'
    },
    {
      title: 'Food',
      url: 'https://instahimachal.com/blog/best-traditional-himachali-food-in-manali/'
    },
    {
      title: 'Getting to Manali (Bus from Delhi will be organized)',
      url: 'https://www.himachaltourism.gov.in/destination/manali/',
      disabled: true
    },
    {
      title: 'Climate',
      url: 'https://www.accuweather.com/en/in/manali/198332/november-weather/198332?year=2023'
    }
  ]
}

const images = [
  {
    src: 'conference/manali-city-with-mountains.jpg',
    alt: 'Manali city with mountains in the background'
  },
  {
    src: 'conference/old-manali-houses-on-hill.jpg',
    alt: 'Old Manali village houses on a hill'
  }
]
</script>
