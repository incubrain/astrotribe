<template>
  <div class="w-full h-full">
    <NavTop />
    <AppBody class="lg:grid lg:grid-cols-[500px_1fr] foreground">
      <div
        class="lg:col-start-1 px-8 w-full h-full flex flex-col justify-center items-center relative z-20 border-r-2 border-color shadow-xl"
      >
        <slot />
      </div>
      <div
        v-if="nasa"
        class="h-full hidden lg:flex relative col-start-2 overflow-hidden"
      >
        <div class="dark:bg-black/30 absolute w-full h-full left-0 top-0" />
        <NuxtImg
          v-if="!imageLoaded && data"
          ref="blur"
          :src="nasa.url"
          quality="20"
          width="150"
          height="120"
          alt=""
          class="w-full object-cover object-center"
        />
        <NuxtImg
          v-else
          :src="nasa.url"
          alt=""
          class="w-full object-cover object-center"
          @load="imageLoaded = true"
        />
        <div
          v-show="data"
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
    </AppBody>
    <UNotifications />
  </div>
</template>

<script setup lang="ts">
import { NasaImg } from '@/types'

const imageLoaded = ref(false)
const nasa = ref({} as NasaImg | { url: string })

const { data, error } = await useFetch('/api/iotd')
nasa.value = data.value ? data.value : { url: '/astron-era-hero.jpg' }
if (error.value) console.error('error fetching nasa iotd: ', error.value)
</script>

<style scoped>
::-webkit-scrollbar {
  display: none;
}
</style>
