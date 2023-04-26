<template>
  <div
    class="w-full relative overflow-hidden h-[50vh]"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <img
      v-for="(image, index) in p.images"
      :key="image"
      :src="image"
      :alt="`Slide ${index + 1}`"
      :class="[
        'w-full h-full object-cover transform transition-transform duration-300 ease-in-out',
        index === currentSlide ? 'translate-x-0' : index > currentSlide ? 'translate-x-full' : '-translate-x-full'
      ]"
    />
    <div
      v-if="currentSlide > 0"
      class="absolute top-1/2 left-0 p-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white cursor-pointer"
      @click="previousSlide"
    >
      <i class="fas fa-chevron-left"></i>
    </div>
    <div
      v-if="currentSlide < images.length - 1"
      class="absolute top-1/2 right-0 p-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white cursor-pointer"
      @click="nextSlide"
    >
      <i class="fas fa-chevron-right"></i>
    </div>
    <div class="absolute bottom-0 right-0 p-2 bg-black bg-opacity-50 text-white">
      {{ currentSlide + 1 }}/{{ images.length }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const p = defineProps({
  images: {
    type: Array as PropType<string[]>,
    required: true
  }
})

const currentSlide = ref(0)
const touchStartX = ref(0)

const nextSlide = () => {
  if (currentSlide.value < p.images.length - 1) {
    currentSlide.value++
  }
}

const previousSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--
  }
}

const handleTouchStart = (event: TouchEvent) => {
  touchStartX.value = event.touches[0].clientX
}

const handleTouchEnd = (event: TouchEvent) => {
  const touchEndX = event.changedTouches[0].clientX
  const distance = touchStartX.value - touchEndX

  if (distance > 100) {
    nextSlide()
  } else if (distance < -100) {
    previousSlide()
  }
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');
</style>
