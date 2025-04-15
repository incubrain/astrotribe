<script setup lang="ts" generic="T">
import { ref, onMounted } from 'vue'
import useEmblaCarousel from 'embla-carousel-vue'
import AutoPlay from 'embla-carousel-autoplay'

const props = defineProps<{
  items: T[]
  type: string
  interval?: number
  hasNavigation?: boolean
}>()

const [emblaRefGeneric, emblaApi] = useEmblaCarousel(
  {
    loop: true,
    align: 'start',
  },
  [AutoPlay({ delay: props.interval || 8000, stopOnInteraction: false })],
)

const scrollPrev = () => {
  emblaApi.value?.scrollPrev()
}

const scrollNext = () => {
  emblaApi.value?.scrollNext()
}

const carouselLoaded = ref(false)
onMounted(async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  carouselLoaded.value = true
})
</script>

<template>
  <div class="embla-wrapper">
    <div
      v-if="hasNavigation"
      class="pointer-events-none absolute inset-y-0 left-0 right-0 z-10 flex items-center justify-between px-4"
    >
      <button
        class="pointer-events-auto w-10 h-10 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors duration-300"
        @click="scrollPrev"
      >
        <Icon
          name="mdi:chevron-left"
          size="24"
        />
      </button>

      <button
        class="pointer-events-auto w-10 h-10 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors duration-300"
        @click="scrollNext"
      >
        <Icon
          name="mdi:chevron-right"
          size="24"
        />
      </button>
    </div>

    <div
      v-if="items.length > 0"
      ref="emblaRefGeneric"
      class="embla overflow-hidden relative"
    >
      <div class="embla__container">
        <div
          v-for="(item, index) in items"
          :key="`${type}-${index}`"
          class="embla__slide"
        >
          <slot :item="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.embla-wrapper .embla {
  --slide-size: 100%;
}
.embla-wrapper .embla__container {
  display: flex;
  touch-action: pan-y pinch-zoom;
}
.embla-wrapper .embla__slide {
  flex: 0 0 var(--slide-size);
}
</style>
