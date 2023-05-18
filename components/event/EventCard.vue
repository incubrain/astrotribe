<template>
  <div class="md:rounded-lg text-left flex relative flex-col md:overflow-hidden animate-swipe-in origin-left border-b border-gray-200 bg-white">
    <EventHosts :hosts="props.event.hosts" />
    <EventVenueInfo v-if="props.venue" :venue="props.venue" />
    <EventInfo :event="props.event" :time="time" />
  </div>
</template>

<script setup lang="ts">
import type { EventBasic, VenueBasic } from '@/types'

const props = defineProps({
  event: {
    type: Object as PropType<EventBasic>,
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
