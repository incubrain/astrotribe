<template>
  <Swiper
    v-if="items.length > 0"
    :modules="[SwiperGrid, SwiperAutoplay]"
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
        spaceBetween: 24,
        grid: {
          rows: 1,
          fill: 'row'
        }
      },
      1280: {
        slidesPerView: 2,
        spaceBetween: 48,
        grid: {
          rows: 2,
          fill: 'row'
        }
      }
    }"
    class="pb-1 gap-6"
  >
    <SwiperSlide
      v-for="(item, index) in items"
      :key="`swiper-slide-${index}`"
    >
      <slot :item="item"></slot>
    </SwiperSlide>
  </Swiper>
</template>

<script setup lang="ts" generic="T">
defineProps<{
  items: T[]
}>()
</script>

<style>
.testimonial-slider {
  width: 100%;
}
</style>
