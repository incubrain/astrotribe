<script setup lang="ts">
import EmblaCarousel, { type EmblaCarouselType, type EmblaOptionsType } from 'embla-carousel'
import AutoScroll from 'embla-carousel-auto-scroll'

interface Partner {
  name: string
  id: string
  type: string
}

const props = defineProps<{
  partners: Partner[]
  direction?: 'left' | 'right'
}>()

const emblaRef = ref<HTMLElement | null>(null)
let emblaApi: EmblaCarouselType | undefined

onMounted(() => {
  const OPTIONS: EmblaOptionsType = { loop: true }

  if (emblaRef.value) {
    emblaApi = EmblaCarousel(emblaRef.value, OPTIONS, [
      AutoScroll({
        playOnInit: true,
        speed: props.direction === 'left' ? -1 : 1,
      }),
    ])
  }
})

onUnmounted(() => {
  emblaApi?.destroy()
})
</script>

<template>
  <div
    ref="emblaRef"
    class="embla overflow-hidden"
  >
    <div class="embla__container flex">
      <div
        v-for="partner in partners"
        :key="`${partner.name}-${partner.id}`"
        class="embla__slide mx-2"
      >
        <div
          class="bg-primary-900/50 w-20 max-w-20 rounded-xl p-2 flex flex-col items-center justify-center group hover:bg-primary-800/50 transition-colors"
        >
          <NuxtImg
            :src="`/images/logos/${partner.name.toLowerCase().replace(' ', '-')}-logo.jpg`"
            :alt="partner.name"
            class="w-full h-full object-contain opacity-70 group-hover:opacity-100 rounded-lg overflow-hidden"
          />
        </div>
      </div>
    </div>
  </div>
</template>
