<template>
  <article>
    <div class="relative">
      <NuxtImg
        :src="
          s.image.optimized({
            bucket: 'venues',
            folderPath: `${venue.id}/events`,
            file: event.featured_image,
            fileType: 'event-featured-image',
            isPrivate: false,
            transform: { width: 400, height: 400, fit: 'cover', quality: 75 }
          })
        "
        loading="lazy"
        width="400"
        height="400"
        :alt="`${venue.name} featured image on AstroTribe`"
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
      <h2 class="m-0 text-lg font-bold">
        {{ event.title }}
      </h2>
      <span class="text-sm font-thin"> {{ event.body }}</span>
    </section>
  </article>
</template>

<script setup lang="ts">
import type { EventBasic, VenueEvents, VenueBasic } from '@/types'

const s = useStorage()

defineProps({
  event: {
    type: Object as PropType<EventBasic | VenueEvents>,
    required: true
  },
  venue: {
    type: Object as PropType<VenueBasic>,
    required: true
  },
  time: {
    type: Object as PropType<any>,
    required: true
  }
})
</script>

<style scoped></style>
