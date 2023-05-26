<template>
  <Swiper
    v-if="items.length > 0"
    :modules="modules"
    :pagination="{ clickable: true }"
    :autoplay="{
      delay: 5000
    }"
    :breakpoints="{
      640: {
        slidesPerView: 1,
        grid: {
          rows: 1,
          fill: 'row'
        }
      },
      768: {
        slidesPerView: 2,
        grid: {
          rows: 1,
          fill: 'row'
        }
      },
      1024: {
        slidesPerView: 2,
        grid: {
          rows: 2,
          fill: 'row'
        }
      }
    }"
    :space-between="40"
    class="pb-20"
  >
    <SwiperSlide
      v-for="(item, index) in items"
      :key="index"
    >
      <slot :item="item"></slot>
    </SwiperSlide>
  </Swiper>
</template>

<script setup lang="ts" generic="T">
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue'

// Import Swiper styles
import 'swiper/css'

import 'swiper/css/grid'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'

// import required modules
import { Grid, Autoplay, Pagination } from 'swiper'

const modules = [Grid, Autoplay, Pagination]

defineProps<{
  items: T[]
}>()
</script>

<style scoped>
.testimonial-slider {
  width: 100%;
}

</style>
