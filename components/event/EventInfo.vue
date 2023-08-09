<template>
  <article>
    <div class="relative">
      <NuxtImg
        :src="event.featured_image"
        loading="lazy"
        width="400"
        height="400"
        quality="80"
        :alt="`${event.title} featured image on AstroTribe`"
        class="w-full"
      />
      <div
        class="absolute flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-md shadow-md foreground left-4 bottom-4"
      >
        <span class="block uppercase">{{ time.month }}</span>
        <span class="block">{{ time.day }}</span>
        <span class="block text-success-600 dark:text-success-700">{{ time.time }} {{ time.ampm }}</span>
      </div>
    </div>
    <section class="relative p-4 space-y-4">
      <h2 class="text-lg font-bold">
        {{ event.title }}
      </h2>
      <span class="text-sm font-thin"> {{ event.body }}</span>
      <UButton variant="outline" block color="slate">
        Create Free Event
      </UButton>
    </section>
  </article>
</template>

<script setup lang="ts">
import type { Event } from '@/types/events'

defineProps({
  event: {
    type: Object as PropType<Event>,
    required: true
  },
  time: {
    type: Object as PropType<any>,
    required: true
  }
})
</script>

<style scoped></style>
