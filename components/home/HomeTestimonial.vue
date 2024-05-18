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
        <div class="p-6 border border-color rounded-md h-full foreground">
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
              <h3 class="text-xl font-semibold">
                {{ item.name }}
              </h3>
              <p class="text-sm">
                {{ item.company }}
              </p>
            </div>
          </div>
          <div class="pt-8">
            <p class="h-auto text-sm italic bg-primary-950 p-3 rounded-sm m-2 relative">
              <Icon
                name="mdi:format-quote-open"
                class="w-8 h-8 text-white absolute -top-4 left-4"
              />
              {{ item.quote }}
              <Icon
                name="mdi:format-quote-close"
                class="w-8 h-8 text-white absolute -bottom-4 right-4"
              />
            </p>
          </div>
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
