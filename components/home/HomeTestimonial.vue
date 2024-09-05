<template>
  <div>
    <HomeHeading
      heading="Hear From The Community"
      subheading="Discover How We're Making a Difference"
      class="pb-16 md:pb-24"
    />
    <AppSwiper
      :items="testimonials"
      type="testimonial"
    >
      <template #default="{ item }: { item: Testimonial }">
        <div class="border-color foreground h-full rounded-md border p-6">
          <div class="flex h-auto items-center">
            <IBImage
              :img="{
                src: item.image,
                alt: item.name,
                width: '60px',
                height: '60px',
                loading: 'lazy',
                quality: '80',
                format: 'webp'
              }"
              class="h-14 w-14 rounded-full"
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
            <p class="relative m-2 h-auto rounded-sm bg-primary-950 p-3 text-sm italic">
              <Icon
                name="mdi:format-quote-open"
                class="absolute -top-4 left-4 h-8 w-8 text-white"
              />
              {{ item.quote }}
              <Icon
                name="mdi:format-quote-close"
                class="absolute -bottom-4 right-4 h-8 w-8 text-white"
              />
            </p>
          </div>
        </div>
      </template>
    </AppSwiper>
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
