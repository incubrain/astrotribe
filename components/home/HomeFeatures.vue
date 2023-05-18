<template>
  <div class="py-home">
    <div class="mx-auto">
      <div class="mb-4 lg:mb-20">
        <h1 class="text-center text-2xl lg:text-5xl font-bold text-gray-800 tracking-1px">
          Choose your Insurance
        </h1>
        <h2 class="text-base lg:text-lg text-center text-gray-700 mt-5 tracking-wider">
          Keep your Life Simple, Safe and Wealthy
        </h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center items-top">
        <div
          v-for="feature in features"
          :key="feature.id"
          class="mx-auto m-4 bg-white rounded-lg shadow-md p-8 relative overflow-hidden"
        >
          <div class="absolute w-full h-full top-0 left-0" :style="{ backgroundImage: 'url(' + feature.backgroundImage + ')' }" />
          <div class="absolute w-full h-full top-0 left-0 bg-gray-900 bg-opacity-40" />
          <div class="relative z-50 text-white">
            <Icon
              :name="feature.icon"
              class="w-[38px] h-[38px]"
            ></Icon>
            <div class="pt-4">
              <h1 class="text-xl lg:text-2xl font-semibold tracking-wider">
                {{ feature.title }}
              </h1>
              <p class="mt-2 tracking-wider leading-normal text-base w-11/12">
                {{ feature.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const features = [
  {
    id: 1,
    title: 'Home Insurance',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra ultrices nunc, non at',
    icon: 'mdi:home',
    backgroundImage: '/cover1.jpg'
  },
  {
    id: 2,
    title: 'Car Insurance',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra ultrices nunc, non at',
    icon: 'mdi:home',
    backgroundImage: '/cover1.jpg'
  },
  {
    id: 3,
    title: 'Life Insurance',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra ultrices nunc, non at',
    icon: 'mdi:home',
    backgroundImage: '/cover1.jpg'
  },
  {
    id: 4,
    title: 'Travel Insurance',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra ultrices nunc, non at',
    icon: 'mdi:home',
    backgroundImage: '/cover1.jpg'
  },
  {
    id: 5,
    title: 'Travel Insurance',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra ultrices nunc, non at',
    icon: 'mdi:home',
    backgroundImage: '/cover1.jpg'
  },
  {
    id: 6,
    title: 'Travel Insurance',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra ultrices nunc, non at',
    icon: 'mdi:home',
    backgroundImage: '/cover1.jpg'
  }
]
</script>

<style scoped>
@import url('https://cdn.tuk.dev/dist/css/tailwind-v2.2.11.min.css');
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
.f-f-p {
  font-family: 'Poppins', sans-serif;
}
</style>
