<template>
  <div>
    <HomeHeading
      heading="Hear From The Community"
      subheading="Discover How We're Making a Difference"
      class="pb-16 md:pb-24"
    />
    <SwiperComponent
      :items="testimonials"
      type="testimonial"
    >
      <template #default="{ item }: { item: Testimonial }">
        <div class="p-6 border border-color rounded-md h-full">
          <div class="flex items-center h-auto">
            <BaseImage
              :img="{
                src: item.image,
                alt: item.name,
                width: '60px',
                height: '60px',
                loading: 'lazy',
                quality: '80',
                format: 'webp'
              }"
              class="rounded-full w-14 h-14"
            />
            <div class="flex flex-col items-start pl-4">
              <h3 class="text-2xl font-semibold">
                {{ item.name }}
              </h3>
              <p class="text-sm">
                {{ item.company }}
              </p>
            </div>
          </div>
          <p class="h-auto mt-8 text-sm italic">
            {{ item.quote }}
          </p>
        </div>
      </template>
    </SwiperComponent>
  </div>
</template>

<script setup lang="ts">
import testimonials from '@/data/home/testimonials.json'

interface Testimonial {
  image: string
  name: string
  company: string
  quote: string
}

// !TODO: - allow users to add testimonials, fetch from supabase
</script>

<style></style>
