<template>
  <Swiper
    :modules="modules"
    :loop="true"
    :navigation="{
      nextEl: '.custom-button-next',
      prevEl: '.custom-button-prev'
    }"
    @slide-change="onSlideChange"
  >
    <SwiperSlide
      v-for="image in images"
      :key="image"
    >
      <NuxtImg
        :src="image"
        class="w-full h-full object-cover transform transition-transform duration-300 ease-in-out"
        width="800"
        height="280"
        quality="80"
        loading="lazy"
      />
    </SwiperSlide>
    <div
      class="custom-button-next flex items-center w-12 justify-center h-full bg-black/30 absolute top-0 right-0 z-10 cursor-pointer"
    >
      <UIcon
        name="i-mdi-chevron-right"
        class="w-10 h-10"
      />
    </div>
    <div
      class="custom-button-prev flex items-center w-12 justify-center h-full bg-black/30 absolute top-0 left-0 z-10 cursor-pointer"
    >
      <UIcon
        name="i-mdi-chevron-left"
        class="w-10 h-10"
      />
    </div>
    <div class="custom-pagination absolute bottom-2 flex justify-center z-10 w-full">
      <p class="px-2 py-1 rounded-md bg-black/20 text-white text-sm">
        {{ currentPage }}/{{ totalPage }}
      </p>
    </div>
  </Swiper>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'

// import required modules
import { Navigation, Pagination } from 'swiper'

const modules = [Navigation, Pagination]

const p = defineProps<{
  images: string[]
}>()

const totalPage = ref(p.images.length)
const currentPage = ref(1)

function onSlideChange(s: any) {
  currentPage.value = s.realIndex + 1
}
</script>

<style></style>
