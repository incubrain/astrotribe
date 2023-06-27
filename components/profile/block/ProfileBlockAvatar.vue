<template>
  <div
    class="absolute left-0 overflow-hidden w-auto h-auto border-8 rounded-full foreground ml-4 md:ml-0 top-[-40px] md:top-[-90px]"
  >
    <NuxtImg
      class="hidden md:flex"
      :src="avatar"
      width="180"
      height="180"
    />
    <NuxtImg
      class="md:hidden"
      :src="avatar"
      width="80"
      height="80"
    />
  </div>
</template>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'

const { width, height } = useWindowSize()

const getWidth = () => {
  if (width.value < 640) {
    return '60px'
  } else if (width.value < 768) {
    return '120px'
  } else {
    return '240px'
  }
}

const getHeight = () => {
  if (height.value < 640) {
    return '60px'
  } else if (height.value < 768) {
    return '120px'
  } else {
    return '240px'
  }
}

defineProps<{
  avatar: string
}>()
</script>

<style scoped></style>
