<template>
  <div class="mb-10 text-dark text-center">
    <h2 class="head-2 mb-4">Testimonials</h2>
    <p class="text-lg"> Don't take our word for it, listen to what our users have to say</p>
  </div>
  <SwiperComponent :items="testimonials">
    <template #default="{ item }: { item: Testimonial } ">
      <div class="testimonial-card bg-white min-h-full text-black shadow-md">
        <img :src="item.image" :alt="item.name" class="w-24 h-24 rounded-full" />
        <h3 class="font-semibold text-2xl mt-4">{{ item.name }}</h3>
        <p class="text-sm font-semibold">{{ item.company }}</p>
        <p class="italic text-sm mt-4">{{ item.quote }}</p>
      </div>
    </template>
  </SwiperComponent>
</template>

<script setup lang="ts">

interface Testimonial {
  image: string
  name: string
  company: string
  quote: string
}

const testimonials = [
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
  // !todo - allow users to add testimonials, fetch from supabase
] as Testimonial[]
</script>

<style scoped>
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
