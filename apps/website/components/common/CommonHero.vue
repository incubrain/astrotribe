<script setup lang="ts">
import type { TitleType, ImageType } from '../../../../layers/base/types/content'

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
      <div class="flex flex-col gap-4 pb-6">
        <slot />

        <!-- Add the actions slot below the default slot -->
      </div>
    </IBImageHero>
    <div
      v-if="$slots.actions"
      class="mt-4 flex justify-center"
    >
      <slot name="actions" />
    </div>
  </div>
</template>
