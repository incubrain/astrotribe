<script setup lang="ts">
import type { TitleType } from '~/types/content'

defineProps({
  title: {
    type: Object as PropType<TitleType>,
    required: true,
  },
})
</script>

<template>
  <PrimeCard class="bg-black/50 border-none">
    <template #title>
      <div class="space-y-1">
        <h2 class="text-2xl font-semibold">
          {{ title.main }}
        </h2>
        <span class="text-base text-gray-400">{{ title.subtitle }}</span>
      </div>
    </template>
    <template #content>
      <div class="flex flex-col space-y-6">
        <slot />
      </div>
    </template>
  </PrimeCard>
</template>
