<script setup lang="ts">
import { onMounted } from 'vue'
import { useAnimation } from '~/composables/useAnimation'
import testimonials from '@/data/home/testimonials.json'

const { carouselFadeIn } = useAnimation()

interface Testimonial {
  image: string
  name: string
  company: string
  quote: string
}

onMounted(() => {
  carouselFadeIn('.testimonial-item')
})
</script>

<template>
  <div class="relative overflow-hidden py-16 md:py-24">
    <div class="mx-auto px-4 relative z-10">
      <LandingTitle
        title="Hear From The Community"
        subtitle="Discover How We're Making a Difference"
      />
      <AppSwiper
        :items="testimonials"
        type="testimonial"
      >
        <template #default="{ item }: { item: Testimonial }">
          <div
            class="bg-opacity-20 backdrop-blur-sm h-full rounded-md border border-color background p-6 testimonial-item"
          >
            <div class="flex h-auto items-center">
              <IBImage
                :img="{
                  src: item.image,
                  alt: item.name,
                  width: '60px',
                  height: '60px',
                  loading: 'lazy',
                  quality: '80',
                  format: 'webp',
                }"
                class="h-14 w-14 rounded-full"
              />
              <div class="flex flex-col items-start pl-4">
                <h3 class="text-xl font-semibold text-white">
                  {{ item.name }}
                </h3>
                <p class="text-sm text-primary-300">
                  {{ item.company }}
                </p>
              </div>
            </div>
            <div class="pt-8">
              <p
                class="relative m-2 h-auto rounded-sm bg-opacity-30 bg-primary-600 p-3 text-sm italic text-white"
              >
                <Icon
                  name="mdi:format-quote-open"
                  class="absolute -top-4 left-4 text-primary-400"
                  size="28px"
                />
                {{ item.quote }}
                <Icon
                  name="mdi:format-quote-close"
                  class="absolute -bottom-4 right-4 text-primary-400"
                  size="28px"
                />
              </p>
            </div>
          </div>
        </template>
      </AppSwiper>
    </div>
    <div class="space-stars absolute inset-0"></div>
  </div>
</template>

<style scoped>
.space-background {
  background: linear-gradient(
    to bottom right,
    #0a001f,
    #1a0033,
    #230042,
    #2b0052,
    #320061,
    #3b0072,
    #43007f,
    #4b008f,
    #53009e,
    #5a00ae,
    #6200bd,
    #6900cc
  );
}

.space-stars {
  background-image: radial-gradient(2px 2px at 20px 30px, #eef, rgba(0, 0, 0, 0)),
    radial-gradient(2px 2px at 40px 70px, #fff, rgba(0, 0, 0, 0)),
    radial-gradient(2px 2px at 50px 160px, #ddf, rgba(0, 0, 0, 0)),
    radial-gradient(2px 2px at 90px 40px, #fff, rgba(0, 0, 0, 0)),
    radial-gradient(2px 2px at 130px 80px, #fff, rgba(0, 0, 0, 0)),
    radial-gradient(2px 2px at 160px 120px, #ddf, rgba(0, 0, 0, 0));
  background-repeat: repeat;
  background-size: 200px 200px;
  opacity: 0.3;
  animation: twinkle 5s infinite;
}

@keyframes twinkle {
  0% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 0.3;
  }
}
</style>
