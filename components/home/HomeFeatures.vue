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
          class="mx-auto m-4 bg-white rounded-lg shadow-md py-6 px-16"
        >
          <div v-html="feature.svg"></div>
          <div class="pt-5">
            <h1 class="text-xl lg:text-2xl font-semibold tracking-wider text-gray-800">
              {{ feature.title }}
            </h1>
            <p class="mt-4 tracking-wider leading-8 text-base w-11/12 text-gray-700">
              {{ feature.description }}
            </p>
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
    svg: '...' // SVG markup for Home Insurance
  },
  {
    id: 2,
    title: 'Car Insurance',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra ultrices nunc, non at',
    svg: '...' // SVG markup for Car Insurance
  },
  {
    id: 3,
    title: 'Life Insurance',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra ultrices nunc, non at',
    svg: '...' // SVG markup for Life Insurance
  },
  {
    id: 4,
    title: 'Travel Insurance',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra ultrices nunc, non at',
    svg: '...' // SVG markup for Travel Insurance
  },
  {
    id: 5,
    title: 'Travel Insurance',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra ultrices nunc, non at',
    svg: '...' // SVG markup for Travel Insurance
  },
  {
    id: 6,
    title: 'Travel Insurance',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra ultrices nunc, non at',
    svg: '...' // SVG markup for Travel Insurance
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
