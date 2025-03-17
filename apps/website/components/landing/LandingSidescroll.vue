<script setup lang="ts">
import EmblaCarousel, { type EmblaCarouselType, type EmblaOptionsType } from 'embla-carousel'
import AutoScroll from 'embla-carousel-auto-scroll'
// News sources/partners
const partners = [
  { name: 'Aadyah Aerospace', id: useId(), type: 'Private Space' },
  { name: 'Aeroin Space', id: useId(), type: 'Private Space' },
  { name: 'Agnikul', id: useId(), type: 'Private Space' },
  { name: 'Astrogate Labs', id: useId(), type: 'Private Space' },
  { name: 'Bellatrix Aerospace', id: useId(), type: 'Private Space' },
  { name: 'CNSA', id: useId(), type: 'Space Agency' },
  { name: 'CSA', id: useId(), type: 'Space Agency' },
  { name: 'Dhruva Space', id: useId(), type: 'Private Space' },
  { name: 'ESA', id: useId(), type: 'Space Agency' },
  { name: 'ISRO', id: useId(), type: 'Space Agency' },
  { name: 'JAXA', id: useId(), type: 'Space Agency' },
  { name: 'NASA', id: useId(), type: 'Space Agency' },
  { name: 'Pixxel', id: useId(), type: 'Private Space' },
  { name: 'Roscosmos', id: useId(), type: 'Space Agency' },
  { name: 'Skyroot Aerospace', id: useId(), type: 'Private Space' },
]

const emblaRef = ref<HTMLElement | null>(null)
let emblaApi: EmblaCarouselType | undefined

onMounted(() => {
  // Initialize partner carousel
  if (emblaRef.value) {
    const OPTIONS: EmblaOptionsType = { loop: true }

    emblaApi = EmblaCarousel(emblaRef.value, OPTIONS, [
      AutoScroll({
        playOnInit: true,
        speed: 0.7,
        direction: 'forward',
      }),
    ])
  }
})

onUnmounted(() => {
  if (emblaApi?.destroy) {
    emblaApi.destroy()
  }
})
</script>

<template>
  <div>
    <LandingTitle
      title="Global Space News"
      subtitle="The only newsfeed you need to stay updated on the latest space news."
    />
    <LandingStats class="wrapper pb-10" />

    <div class="relative border-x border-primary-900/30 rounded-lg py-8">
      <div
        ref="emblaRef"
        class="embla overflow-hidden"
      >
        <div class="embla__container flex">
          <div
            v-for="partner in partners"
            :key="partner.id"
            class="embla__slide flex-shrink-0 mx-6"
          >
            <div class="flex flex-col items-center space-y-3 group/partner">
              <div
                class="w-36 h-36 bg-primary-900/50 rounded-xl p-4 flex items-center justify-center transition-transform duration-300 group-hover/partner:scale-110"
              >
                <NuxtImg
                  :src="`/images/logos/${partner.name.toLowerCase().replace(' ', '-')}-logo.jpg`"
                  :alt="partner.name"
                  class="w-full h-full object-contain opacity-70 group-hover/partner:opacity-100"
                  width="160"
                  height="160"
                />
              </div>
              <span class="text-base font-medium text-gray-400">{{ partner.name }}</span>
              <span class="text-sm text-gray-500">{{ partner.type }}</span>
            </div>
          </div>
        </div>
      </div>
      <div
        class="absolute top-0 left-0 h-full w-32 bg-gradient-to-r from-primary-950 to-transparent"
      ></div>
      <div
        class="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-primary-950 to-transparent"
      ></div>
    </div>
    <LandingTrusted class="wrapper" />
  </div>
</template>

<style scoped></style>
