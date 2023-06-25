<template>
  <div
    class="relative flex flex-col text-left origin-left border md:rounded-lg md:overflow-hidden animate-swipe-in foreground border-color"
  >
    <EventHosts :hosts="props.event.hosts" />
    <EventVenueInfo
      v-if="props.venue"
      :venue="props.venue"
    />
    <EventInfo
      :event="props.event"
      :venue="props.venue"
      :time="time"
    />
  </div>
</template>

<script setup lang="ts">
import type { EventBasic, VenueEvents, VenueBasic } from '@/types'

const props = defineProps({
  event: {
    type: Object as PropType<EventBasic | VenueEvents>,
    required: true
  },
  venue: {
    type: Object as PropType<VenueBasic>,
    required: false,
    default: null
  }
})

const h = useUtils()
const time = h.time.format(props.event.date)
</script>
