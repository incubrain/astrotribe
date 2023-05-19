<template>
  <div>
    <div class="mb-10 text-dark text-center">
      <h2 class="head-2 mb-4">
        Testimonials
      </h2>
      <p class="text-lg">
        Don't take our word for it, listen to what our users have to say
      </p>
    </div>
    <SwiperComponent :items="testimonials">
      <template #default="{ item }: { item: Testimonial }">
        <div class="max-w-[100%] bg-white min-h-full text-black p-4 rounded-md shadow-lg">
          <img
            :src="item.image"
            :alt="item.name"
            class="w-24 h-24 rounded-full"
          />
          <h3 class="font-semibold text-2xl mt-4">
            {{ item.name }}
          </h3>
          <p class="text-sm font-semibold">
            {{ item.company }}
          </p>
          <p class="italic text-sm mt-4">
            {{ item.quote }}
          </p>
        </div>
      </template>
    </SwiperComponent>
  </div>
</template>

<script setup lang="ts">
interface Testimonial {
  image: string
  name: string
  company: string
  quote: string
}

// !todo - allow users to add testimonials, fetch from supabase

const testimonials = [
  {
    image: '/avatar.png',
    name: 'Person 1',
    company: 'Company 1',
    quote: 'This is an amazing project, This is an amazing project This is an amazing project'
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
  }
] as Testimonial[]
</script>

<style></style>
