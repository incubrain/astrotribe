<template>
  <div class="pb-10">
    <div class="mb-8 pl-8">
      <h2 class="text-base font-bold text-primary-700 dark:text-primary-600 tracking-tight mb-4"
        >Hear From Our Users
      </h2>
      <h2 class="text-3xl font-semibold mt-5 max-w-[50%] leading-normal">
        Keep your Life Simple, Safe and Wealthy
      </h2>
    </div>
    <SwiperComponent :items="testimonials">
      <template #default="{ item }: { item: Testimonial }">
        <div class="foreground min-h-full p-8 rounded-md shadow-lg">
          <div class="flex items-center">
            <NuxtImg
              :src="item.image"
              :alt="item.name"
              class="w-14 h-14 rounded-full"
            />
            <div class="flex flex-col pl-4 items-start">
              <h3 class="font-semibold text-2xl">
                {{ item.name }}
              </h3>
              <p class="text-sm">
                {{ item.company }}
              </p>
            </div>
          </div>
          <p class="italic text-sm mt-8">
            {{ item.quote }}
          </p>
        </div>
      </template>
    </SwiperComponent>
  </div>
</template>

<script setup lang="ts">
import testimonials from '~/public/data/testimonials.json'

interface Testimonial {
  image: string
  name: string
  company: string
  quote: string
}

// !todo - allow users to add testimonials, fetch from supabase
</script>

<style></style>
