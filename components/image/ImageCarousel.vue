<template>
  <div
    class="relative overflow-hidden w-full aspect-auto h-[80vh]"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <NuxtImg
      v-for="(image, index) in images"
      :key="image"
      :src="image"
      :class="[
        'w-full h-full object-cover transform transition-transform duration-300 ease-in-out',
        index === currentSlide
          ? 'translate-x-0'
          : index > currentSlide
          ? 'translate-x-full'
          : '-translate-x-full'
      ]"
    />
    <div
      v-if="currentSlide > 0"
      class="absolute left-0 p-2 text-white transform -translate-y-1/2 bg-opacity-50 cursor-pointer top-1/2"
      @click="previousSlide"
    >
      <UIcon name="i-mdi-chevron-left" />
    </div>
    <div
      v-if="currentSlide < images.length - 1"
      class="absolute right-0 p-2 text-white transform -translate-y-1/2 bg-opacity-50 cursor-pointer top-1/2"
      @click="nextSlide"
    >
      <UIcon name="i-mdi-chevron-right" />
    </div>
    <div class="absolute bottom-0 right-0 p-2 text-white bg-opacity-50">
      {{ currentSlide + 1 }}/{{ images.length }}
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  images: string[]
}>()

const currentSlide = ref(0)
const touchStartX = ref(0)

const nextSlide = () => {
  if (currentSlide.value < props.images.length - 1) {
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

<style scoped></style>
