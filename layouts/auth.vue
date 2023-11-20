<template>
  <div
    class="w-full lg:grid lg:grid-cols-[500px_1fr] min-h-[calc(100vh-var(--nav-height-sm))] lg:min-h-[calc(100vh-var(--nav-height-lg))]"
  >
    <div
      class="lg:col-start-1 p-8 w-full h-full flex flex-col justify-center items-center relative z-20 border-r-2 border-color"
    >
      <slot />
    </div>
    <div
      v-if="nasa"
      class="h-full hidden lg:flex relative col-start-2 overflow-hidden"
    >
      <div class="dark:bg-black/30 absolute w-full h-full left-0 top-0" />
      <NuxtImg
        :src="nasa.url"
        alt=""
        class="w-full object-cover object-center"
        @load="imageLoaded = true"
      />
      <div
        v-show="false"
        class="group bg-[#00000040] text-white p-6 rounded-lg shadow-lg absolute top-2 lg:left-2 w-[90%] max-w-[420px] transition-all duration-300 backdrop-blur-md"
      >
        <h1 class="text-xl font-semibold pb-2">
          {{ nasa.title }}
        </h1>
        <p
          class="h-[0px] xl:h-[100px] overflow-auto group-hover:h-[48vh] transition-all duration-300 scrollbar-hidden"
        >
          {{ nasa.explanation }}
        </p>
        <div class="flex flex-row gap-2 pt-2 items-center">
          <p class="text-sm font-bold">
            {{ nasa.date }}
          </p>
          <p class="text-xs"> Copyright: {{ nasa.copyright }} </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { NasaImg } from '@/types/nasa'

const imageLoaded = ref(false)
const nasa = ref({ url: '/astron-era-hero.jpg' })

// const { data, error } = await useFetch('/api/iotd')
// if (error.value) console.error('error fetching nasa iotd: ', error.value)
</script>

<style scoped>
::-webkit-scrollbar {
  display: none;
}
</style>
