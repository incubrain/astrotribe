<script setup lang="ts">
import type { TitleType, ImageType } from '../../types/content'

defineProps({
  fit: {
    type: String,
    default: 'cover',
  },
  objectPosition: {
    type: String,
    default: 'center',
  },
  title: {
    type: Object as () => TitleType,
    required: true,
  },
  img: {
    type: Object as () => ImageType,
    required: true,
  },
})

// consider turning the images into short videos using AI
// consider using mix-blend-mode for cool text effect with video
</script>

<template>
  <div :class="`relative flex items-center ${objectPosition == 'center' ? 'justify-center' : ''}`">
    <IBImage
      :img="{
        src: img.src,
        alt: img.alt,
        width: img.width,
        height: img.height,
      }"
      :class="`w-full object-${fit} ${objectPosition} h-screen`"
    />
    <div class="absolute z-10 flex flex-col gap-8 px-4 text-white lg:flex-row lg:gap-16 xl:px-8">
      <div class="flex flex-col gap-4">
        <h2
          :class="`rounded-md bg-black/30 px-4 py-1 text-xl font-bold shadow-xl xl:px-8 text-${title.centered ? 'center' : 'left'}`"
        >
          {{ title.main }}
        </h2>
      </div>
    </div>
    <div class="absolute left-0 top-0 h-full w-full bg-black/50" />
  </div>
</template>

<style scoped></style>
