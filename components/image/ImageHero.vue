<script setup lang="ts">
import type { TitleType, ImageType } from '~/types/content'

defineProps({
  fit: {
    type: String,
    default: 'cover'
  },
  objectPosition: {
    type: String,
    default: 'center'
  },
  title: {
    type: Object as () => TitleType,
    required: true
  },
  img: {
    type: Object as () => ImageType,
    required: true
  }
})

// consider turning the images into short videos using AI
// consider using mix-blend-mode for cool text effect with video
</script>

<template>
  <div class="relative flex items-center justify-center">
    <BaseImage
      :img="{
        src: img.src,
        alt: img.alt,
        width: img.width,
        height: img.height
      }"
      :class="`w-full object-${fit} ${objectPosition} h-screen`"
    />
    <div
      class="absolute z-10 flex flex-col lg:flex-row text-white gap-8 lg:gap-16 px-4 xl:px-8 justify-center items-center"
    >
      <slot />
      <div class="block">
        <h2
          class="text-3xl font-bold lg:text-5xl bg-black/30 py-1 px-4 xl:px-8 rounded-md shadow-xl"
        >
          {{ title.main }}
        </h2>
        <h4
          v-if="title.subtitle"
          class="text-xl w-auto inline-block font-semibold lg:text-3xl bg-black/30 pb-4 px-4 xl:px-8 rounded-sm"
        >
          {{ title.subtitle }}
        </h4>
      </div>
    </div>
    <div class="absolute top-0 left-0 w-full h-full bg-black/25" />
  </div>
</template>

<style scoped></style>
