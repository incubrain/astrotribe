<template>
  <div
    class="relative flex flex-col text-left origin-left border md:rounded-lg md:overflow-hidden animate-swipe-in foreground border-color"
  >
    <EventHosts :hosts="event.hosts" />
    <EventVenueInfo
      v-if="event.venue"
      :venue="event.venue"
    />
    <EventInfo
      :event="event"
      :venue="event.venue"
      :time="h.time.format(event.date)"
    />
  </div>
</template>

<script setup lang="ts">
import type { Event } from '@/types/events'

defineProps({
  event: {
    type: Object as PropType<Event>,
    required: true
  }
})

const h = useUtils()
</script>
