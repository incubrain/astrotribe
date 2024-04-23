<template>
  <article>
    <div class="relative">
      <BaseImage
        :img="{
          src: event.featured_image,
          alt: `${event.title} featured image on AstroTribe`,
          loading: 'lazy',
          width: '400',
          height: '400',
          quality: '80'
        }"
        class="w-full"
      />
      <div
        class="absolute flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-md shadow-md foreground left-4 bottom-4"
      >
        <span class="block uppercase">{{ time.month }}</span>
        <span class="block">{{ time.day }}</span>
        <span class="block text-success-600 dark:text-success-700"
          >{{ time.time }} {{ time.ampm }}</span
        >
      </div>
    </div>
    <section class="relative p-4">
      <h2 class="text-lg font-bold">
        {{ event.title }}
      </h2>
      <p class="text-sm py-4"> {{ event.body }}</p>
      <PrimeButton
        variant="outline"
        block
        color="white"
      >
        Create Free Event
      </PrimeButton>
    </section>
  </article>
</template>

<script setup lang="ts">
import type { EventType } from '@/types/events'

defineProps({
  event: {
    type: Object as PropType<EventType>,
    required: true
  },
  time: {
    type: Object as PropType<any>,
    required: true
  }
})
</script>

<style scoped></style>
