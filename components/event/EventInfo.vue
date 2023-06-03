<template>
  <article>
    <div class="relative">
      <img
        :src="`https://idsifamzvzlpgnmlnldw.supabase.co/storage/v1/object/public/venues-public/${venue.id}/featured/${venue.featured_image}`"
        :alt="`${venue.name} featured image on AstroTribe`"
      />
      <div
        class="flex justify-center foreground gap-2 items-center rounded-md shadow-md px-4 py-2 text-sm font-semibold absolute left-4 bottom-4"
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
import type { EventBasic, VenueEvent, VenueBasic } from '@/types'

defineProps({
  event: {
    type: Object as PropType<EventBasic | VenueEvent>,
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
