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
  <div class="relative flex items-center justify-center">
    <IBImage
      :img="{
        src: img.src,
        alt: img.alt,
        width: img.width,
        height: img.height,
      }"
      :class="`w-full object-${fit} ${objectPosition} h-screen`"
    />
    <div
      class="absolute z-10 flex flex-col items-center justify-center gap-8 px-4 text-white lg:flex-row lg:gap-16 xl:px-8"
    >
      <slot />
      <div class="flex flex-col gap-4">
        <h2
          :class="`rounded-md bg-black/10 px-4 py-1 text-3xl font-bold shadow-xl lg:text-5xl xl:px-8 text-${title.centered ? 'center' : 'left'}`"
        >
          {{ title.main }}
        </h2>
        <p
          v-if="title.subtitle"
          :class="`inline-block w-auto max-w-2xl rounded-sm px-4 pb-4 text-xl font-semibold lg:text-3xl xl:px-8 text-${title.centered ? 'center' : 'left'}`"
        >
          {{ title.subtitle }}
        </p>
      </div>
    </div>
    <div class="absolute left-0 top-0 h-full w-full bg-black/50" />
  </div>
</template>

<style scoped></style>
