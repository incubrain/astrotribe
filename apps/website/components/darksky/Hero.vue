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
    <!-- Background Image -->
    <IBImage
      :img="{
        src: img.src,
        alt: img.alt,
        width: img.width,
        height: img.height,
      }"
      :class="`w-full object-${fit} ${objectPosition} h-screen`"
    />

    <!-- Dark Overlay with reduced opacity -->
    <div class="absolute left-0 top-0 h-full w-full" />

    <!-- Content Container - Improved positioning and styling -->
    <div class="absolute z-20 flex flex-col gap-4 max-w-4xl px-6 lg:px-12">
      <!-- Main title with improved visibility -->
      <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 drop-shadow-lg text-wrap max-w-xl">
        {{ title.main }}
      </h2>

      <!-- Subtitle with better styling -->
      <div
        v-if="title.subtitle"
        class="text-lg md:text-xl font-medium text-white bg-black/50 backdrop-blur-sm p-4 rounded-lg border border-white/10 shadow-xl max-w-2xl"
      >
        {{ title.subtitle }}
      </div>

      <!-- Slot for additional content -->
      <div class="mt-4">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Subtle animation for text elements */
h2 {
  animation: fadeIn 1s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
