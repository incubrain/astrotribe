<script setup lang="ts" generic="T">
import { ref, onMounted, watch, computed } from 'vue'
import useEmblaCarousel from 'embla-carousel-vue'
import AutoPlay from 'embla-carousel-autoplay'

const [emblaRef, emblaApi] = useEmblaCarousel(
  {
    loop: false,
    align: 'start',
  },
  [AutoPlay({ delay: 7000 })],
)

const breakpoints = computed(() => ({
  '(min-width: 1280px)': { slidesPerView: 3, rows: 2 },
  '(min-width: 768px)': { slidesPerView: 2, rows: 1 },
  '(min-width: 640px)': { slidesPerView: 1, rows: 1 },
}))

const carouselLoaded = ref(false)
onMounted(async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  carouselLoaded.value = true
})

// watch(
//   [carouselLoaded],
//   () => {
//     console.log('reInit', breakpoints.value, emblaApi.value)
//     if (emblaApi.value) {
//       emblaApi.value.reInit(breakpoints.value)
//     }
//   },
//   { deep: true, immediate: true },
// )

defineProps<{
  items: T[]
  type: string
}>()
</script>

<template>
  <div
    v-if="items.length > 0"
    ref="emblaRef"
    class="embla max-w-full border-8 border-primary-900 overflow-hidden p-8 rounded-xl"
  >
    <div class="embla__container grid gap-8 grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="(item, index) in items"
        :key="`${type}-${index}`"
        class="embla__slide"
      >
        <slot :item="item" />
      </div>
    </div>
  </div>
</template>

<style scoped>

.embla__container {
  display: flex;
}
.embla__slide {
  min-width: 340px;
}

/* @media (min-width: 768px) {
  .embla__slide {
    flex: 0 0 50%;
  }
}

@media (min-width: 1280px) {
  .embla__slide {
    flex: 0 0 33.333%;
  }
} */
</style>
