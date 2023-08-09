<template>
  <Swiper
    v-if="items.length > 0"
    :modules="[SwiperGrid, SwiperPagination, SwiperAutoplay]"
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
    class="pb-10"
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

defineProps<{
  items: T[]
}>()
</script>

<style>
.testimonial-slider {
  width: 100%;
}

</style>
