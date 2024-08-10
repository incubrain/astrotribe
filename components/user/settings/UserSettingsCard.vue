<script setup lang="ts">
import type { TitleType } from '~/types/content'

defineProps({
  title: {
    type: Object as PropType<TitleType>,
    required: true
  }
})
</script>

<template>
  <PrimeCard>
    <template #title>
      <div>
        <h2 class="text-2xl font-semibold">{{ title.main }}</h2>
        <span class="text-base">{{ title.subtitle }}</span>
      </div>
    </template>
    <template #content>
      <div class="flex flex-col">
        <slot />
      </div>
    </template>
    <template #footer>
      <!-- feedback section? -->
    </template>
  </PrimeCard>
</template>

<style scoped></style>
