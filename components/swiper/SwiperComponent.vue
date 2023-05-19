<template>
  <section class="container mx-auto px-4 py-10 w-full">
    <swiper-container
      :slides-per-view="3"
      :space-between="20"
      :auto-height="true"
      :loop="true"
      :autoplay="{
        delay: 5000,
        disableOnInteraction: true
      }"
    >
      <swiper-slide
        v-for="(item, index) in items"
        :key="index"
        :lazy="true"
      >
        <slot :item="item"></slot>
      </swiper-slide>
    </swiper-container>
  </section>
</template>

<script setup lang="ts" generic="T">
// register()

defineProps<{
  items: T[]
}>()
</script>

<style>
.swiper-wrapper {
  display: flex;
  margin: auto;
}

.testimonial-slider {
  width: 100%;
}
</style>
