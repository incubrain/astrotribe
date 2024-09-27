<script setup lang="ts">
import type { TitleType, ImageType } from '../../../base/types/content'

defineProps<{
  title: TitleType
  img: ImageType
  position: string
}>()
</script>

<template>
  <div>
    <IBImageHero
      :img="img"
      :title="title"
      :object-position="`object-${position}`"
      fit="cover"
    >
      <div class="flex flex-col gap-4 bg-white rounded-md pb-6">
        <slot />
      </div>
    </IBImageHero>
  </div>
</template>
