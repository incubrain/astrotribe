<script setup lang="ts">
import type { TitleT, ImageT } from '~/types/content'

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
    type: Object as () => TitleT,
    required: true
  },
  img: {
    type: Object as () => ImageT,
    required: true
  }
})
</script>

<template>
  <div class="relative flex items-center justify-center">
    <NuxtImg
      :class="`w-full object-${fit} ${objectPosition} h-[540px]`"
      :src="img.src"
      :alt="img.alt"
      :width="img.width"
      :height="img.height"
    />
    <div
      class="absolute z-10 flex flex-col lg:flex-row text-white gap-8 lg:gap-16 px-4 xl:px-8 justify-center items-center"
    >
      <slot />
      <div class="space-y-4 block">
        <h2 class="text-3xl font-bold lg:text-5xl bg-black/30 py-1 px-2 rounded-sm">
          {{ title.main }}
        </h2>
        <h4
          v-if="title.subtitle"
          class="text-xl w-auto inline-block font-semibold lg:text-3xl bg-black/30 py-1 px-2 rounded-sm"
        >
          {{ title.subtitle }}
        </h4>
      </div>
    </div>
    <div class="absolute top-0 left-0 w-full h-full bg-black/25" />
  </div>
</template>

<style scoped></style>
