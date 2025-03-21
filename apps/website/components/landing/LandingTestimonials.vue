<script setup lang="ts">
import testimonials from '@/data/home/testimonials.json'

interface Testimonial {
  image: string
  name: string
  company: string
  quote: string
}
</script>

<template>
  <section>
    <LandingTitle
      title="Hear From The Community"
      subtitle="Discover How We're Making a Difference"
      class="!pb-12"
    />
    <!-- Testimonials Carousel -->
    <AppSwiper
      :items="testimonials"
      type="testimonial"
      class="testimonials-carousel"
    >
      <template #default="{ item }: { item: Testimonial }">
        <div class="testimonial-item group">
          <!-- Card with glass effect -->
          <!-- Hover gradient -->
          <div
            class="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"
          ></div>

          <LandingGlass
            hover-effect="glow"
            glow-color="purple"
            gradient="mixed"
            intensity="low"
            interactive
            isolate-content
          >
            <!-- Content -->
            <div class="relative z-10">
              <!-- Profile section -->
              <div class="flex items-center mb-8">
                <div class="relative">
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
                    class="min-h-16 min-w-16 rounded-full ring-2 ring-sky-500/20"
                  />
                  <!-- Glow behind image -->
                  <div class="absolute inset-0 bg-sky-500/20 blur-xl -z-10"></div>
                </div>

                <div class="flex flex-col pl-4">
                  <h3 class="text-xl font-semibold text-white">{{ item.name }}</h3>
                  <p class="text-sky-400">{{ item.company }}</p>
                </div>
              </div>

              <!-- Quote section -->
              <div class="relative">
                <div class="relative rounded-xl foreground p-6">
                  <Icon
                    name="mdi:format-quote-open"
                    class="absolute -top-4 left-4 text-sky-400/40"
                    size="32px"
                  />
                  <p class="text-gray-300 italic relative z-10">{{ item.quote }}</p>
                  <Icon
                    name="mdi:format-quote-close"
                    class="absolute -bottom-4 right-4 text-sky-400/40"
                    size="32px"
                  />
                </div>
              </div>
            </div>
          </LandingGlass>
        </div>
      </template>
    </AppSwiper>
  </section>
</template>

<style scoped>
.testimonials-carousel :deep(.swiper-pagination-bullet) {
  background: theme('colors.sky.400');
  opacity: 0.5;
}

.testimonials-carousel :deep(.swiper-pagination-bullet-active) {
  opacity: 1;
}

/* Optional: Enhanced navigation buttons */
.testimonials-carousel :deep(.swiper-button-next),
.testimonials-carousel :deep(.swiper-button-prev) {
  color: blue;
  background: blue;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  backdrop-filter: blur(8px);
}

.testimonials-carousel :deep(.swiper-button-next:after),
.testimonials-carousel :deep(.swiper-button-prev:after) {
  font-size: 20px;
}
</style>
