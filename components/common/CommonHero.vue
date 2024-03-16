<script setup lang="ts">
import type { TitleT, ImageT } from '@/types/content'

defineProps<{
  title: TitleT
  img: ImageT
  position: string
}>()
</script>

<template>
  <div>
    <ImageHero
      :img="img"
      :title="title"
      :object-position="`object-${position}`"
      fit="cover"
    >
      <div class="flex flex-col gap-4 bg-white rounded-md pb-6">
        <slot />
      </div>
    </ImageHero>
  </div>
</template>
