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

defineProps<{
  items: T[]
  type: string
}>()
</script>

<template>
  <div
    v-if="items.length > 0"
    ref="emblaRef"
    class="embla max-w-full overflow-hidden rounded-xl"
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
</style>
