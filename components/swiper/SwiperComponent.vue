<template>
  <section class="container mx-auto px-4 py-10 w-full">
    <Swiper
      :modules="[SwiperAutoplay]"
      :slides-per-view="1"
      :space-between="20"
      :auto-height="true"
      :loop="true"
      :autoplay="{
        delay: 7000,
        disableOnInteraction: true
      }"
      :breakpoints="{
        640: {
          slidesPerView: 2,
          spaceBetween: 10
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 20
        }
      }"
      class="w-full h-full"
    >
      <SwiperSlide
        v-for="(item, index) in items"
        :key="index"
        class="p-8 rounded-lg flex flex-col items-start justify-start"
      >
        <slot :item="item"></slot>
      </SwiperSlide>
    </Swiper>
  </section>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true
  }
})
</script>
