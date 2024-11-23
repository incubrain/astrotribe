<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  images: {
    type: Array as () => string[],
    required: true,
  },
  interval: {
    type: Number,
    default: 7000,
  },
})

const currentImageIndex = ref(0)
let intervalId: number | null = null

const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % props.images.length
}

onMounted(() => {
  intervalId = setInterval(nextImage, props.interval)
})

onUnmounted(() => {
  if (intervalId !== null) {
    clearInterval(intervalId)
  }
})
</script>

<template>
  <div class="absolute inset-0 w-full h-full">
    <TransitionGroup
      name="fade"
      tag="div"
    >
      <div
        v-for="(image, index) in images"
        v-show="index === currentImageIndex"
        :key="image"
        class="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000"
        :style="{ backgroundImage: `url(${image})` }"
      ></div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
