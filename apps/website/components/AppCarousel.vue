<script setup lang="ts" generic="T">
import { ref, onMounted, watch, computed } from 'vue'
import useEmblaCarousel from 'embla-carousel-vue'
import AutoPlay from 'embla-carousel-autoplay'

const props = defineProps<{
  items: T[]
  type: string
  interval?: number
}>()

const [emblaRef] = useEmblaCarousel(
  {
    loop: true,
    align: 'start',
  },
  [AutoPlay({ delay: props.interval || 8000, stopOnInteraction: false })],
)

const carouselLoaded = ref(false)
onMounted(async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  carouselLoaded.value = true
})
</script>

<template>
  <div
    v-if="items.length > 0"
    ref="emblaRef"
    class="embla overflow-hidden"
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
</template>

<style scoped>
.embla {
  --slide-size: 100%;
}
.embla__container {
  display: flex;
  touch-action: pan-y pinch-zoom;
}
.embla__slide {
  flex: 0 0 var(--slide-size);
}
</style>
