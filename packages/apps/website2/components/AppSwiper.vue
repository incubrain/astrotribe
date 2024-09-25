<script setup lang="ts" generic="T">
import { register, type SwiperContainer } from 'swiper/element/bundle'

register()

const swiperRef = ref(null as SwiperContainer | null)

const swiperConfig = computed(() => ({
  autoplay: {
    delay: 7000,
  },
  breakpoints: {
    640: {
      slidesPerView: 1,
      grid: {
        rows: 1,
        fill: 'row',
      },
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 24,
      grid: {
        rows: 1,
        fill: 'row',
      },
    },
    1280: {
      slidesPerView: 3,
      spaceBetween: 24,
      grid: {
        rows: 2,
        fill: 'row',
      },
    },
  },
}))

const swiperLoaded = ref(false)
onMounted(async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  swiperLoaded.value = true
})

watch(
  [swiperLoaded],
  () => {
    if (swiperRef.value) {
      Object.assign(swiperRef.value, swiperConfig.value)
      swiperRef.value.initialize()
    }
  },
  { deep: true, immediate: true },
)

defineProps<{
  items: T[]
  type: string
}>()
</script>

<template>
  <swiper-container
    v-if="items.length > 0"
    ref="swiperRef"
    init="false"
  >
    <swiper-slide
      v-for="(item, index) in items"
      :key="`${type}-${index}`"
      class="slide"
    >
      <slot :item="item" />
    </swiper-slide>
  </swiper-container>
</template>

<style scoped>
.slide {
  height: auto !important;
}
</style>
