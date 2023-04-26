<!-- components/TestimonialSlider.vue -->
<template>
  <section class="container mx-auto px-4 py-10 w-full">
    <h2 class="text-center text-3xl font-semibold mb-10">Testimonials</h2>
    <Swiper
      :modules="[SwiperAutoplay]"
      :slides-per-view="3"
      :space-between="40"
      :auto-height="true"
      :loop="true"
      :autoplay="{
        delay: 7000,
        disableOnInteraction: true
      }"
      class="w-full h-full"
    >
      <SwiperSlide
        v-for="(testimonial, index) in testimonials"
        :key="index"
        :ref="`slide-${index}`"
        class="testimonial-card bg-white min-h-full text-black shadow-md p-8 rounded-lg flex flex-col items-start justify-start"
      >
        <img
          :src="testimonial.image"
          :alt="testimonial.name"
          class="w-24 h-24 rounded-full"
        />
        <h3 class="font-semibold text-2xl mt-4">{{ testimonial.name }}</h3>
        <p class="text-sm font-semibold">{{ testimonial.company }}</p>
        <p class="italic text-sm mt-4">{{ testimonial.quote }}</p>
      </SwiperSlide>
    </Swiper>
  </section>
</template>

<script setup lang="ts">
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-creative'

const testimonials = ref([
  {
    image: '/avatar.png',
    name: 'Person 1',
    company: 'Company 1',
    quote:
      'This is an amazing project, This is an amazing project This is an amazing project This is an amazing project This is an amazing projectThis is an amazing project'
  },
  {
    image: '/avatar.png',
    name: 'Person 2',
    company: 'Company 2',
    quote: 'Great work and dedication! an amazing project, This is an amazing project Thi'
  },
  {
    image: '/avatar.png',
    name: 'Person 3',
    company: 'Company 3',
    quote: 'Great work and dedication! an amazing project, This is an amazing project Thi'
  },
  {
    image: '/avatar.png',
    name: 'Person 4',
    company: 'Company 4',
    quote: 'Great work and dedication! an amazing project, This is an amazing project Thi'
  },
  {
    image: '/avatar.png',
    name: 'Person 5',
    company: 'Company 5',
    quote: 'Great work and dedication!'
  },
  {
    image: '/avatar.png',
    name: 'Person 6',
    company: 'Company 6',
    quote: 'Great work and dedication!'
  }
  // Add the rest of the testimonials (total of 6)
])
</script>

<style>
.swiper-wrapper {
  display: flex;
  margin: auto;
}

.testimonial-slider {
  width: 100%;
}

.class-semibold {
  font-weight: 'semibold';
}

.testimonial-card {
  max-width: 100%;
}
</style>
