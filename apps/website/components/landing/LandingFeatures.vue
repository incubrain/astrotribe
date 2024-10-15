<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import EmblaCarousel, { type EmblaCarouselType } from 'embla-carousel'
import AutoScroll from 'embla-carousel-auto-scroll'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useId } from '#app'

gsap.registerPlugin(ScrollTrigger)

const emblaRef = ref<HTMLElement | null>(null)
let emblaApi: EmblaCarouselType | undefined

const logos = [
  { name: 'NASA', id: useId() },
  { name: 'ESA', id: useId() },
  { name: 'SpaceX', id: useId() },
  { name: 'Blue Origin', id: useId() },
  { name: 'Roscosmos', id: useId() },
  { name: 'JAXA', id: useId() },
  { name: 'ISRO', id: useId() },
  { name: 'CSA', id: useId() },
]

const features = [
  {
    id: useId(),
    title: 'Real-time Updates',
    subtitle: 'Stay informed with instant space news',
  },
  {
    id: useId(),
    title: 'Interactive Maps',
    subtitle: 'Explore space missions with 3D visualizations',
  },
  {
    id: useId(),
    title: 'Community Insights',
    subtitle: 'Engage with space enthusiasts worldwide',
  },
]

onMounted(() => {
  if (emblaRef.value) {
    emblaApi = EmblaCarousel(
      emblaRef.value,
      {
        loop: true,
        dragFree: true,
      },
      [AutoScroll({ playOnInit: true, speed: 1 })],
    )
  }

  gsap.from('.feature-card', {
    scrollTrigger: {
      trigger: '.feature-grid',
      start: 'top bottom-=100px',
      toggleActions: 'play none none reverse',
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
  })
})

onUnmounted(() => {
  emblaApi?.destroy()
})
</script>

<template>
  <section class="features-section py-16">
    <div class="container mx-auto px-4">
      <div class="flex flex-col gap-24">
        <!-- Logo Carousel -->
        <div>
          <h2 class="text-3xl font-bold text-center mb-8">100+ News Sources</h2>
          <div
            class="embla overflow-hidden"
            ref="emblaRef"
          >
            <div class="embla__container flex">
              <div
                v-for="logo in logos"
                :key="logo.id"
                class="embla__slide flex-shrink-0 mx-4 flex flex-col items-center justify-center gap-2"
              >
                <NuxtImg
                  :src="`https://picsum.photos/200/100?random=${logo.id}`"
                  :alt="logo.name"
                  class="h-12 w-auto object-contain"
                  width="200"
                  height="100"
                />
                <p
                  class="text-xs border border-color rounded-full uppercase text-center font-bold px-2 pt-1"
                  >{{ logo.name }}</p
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Feature Grid -->
        <div class="feature-grid grid grid-cols-1 md:grid-cols-3 gap-8">
          <PrimeCard
            v-for="feature in features"
            :key="feature.id"
            class="feature-card overflow-hidden"
          >
            <template #header>
              <NuxtImg
                :src="`https://picsum.photos/400/200?random=${feature.id}`"
                :alt="feature.title"
                class="w-full h-48 object-cover"
                width="400"
                height="200"
              />
            </template>
            <template #title>
              {{ feature.title }}
            </template>
            <template #subtitle>
              {{ feature.subtitle }}
            </template>
          </PrimeCard>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.embla {
  overflow: hidden;
}
.embla__container {
  display: flex;
}
.embla__slide {
  flex: 0 0 auto;
  min-width: 0;
  max-width: 200px; /* Adjust based on your needs */
}
</style>
