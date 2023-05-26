<template>
  <div
    class="min-h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-4 xl:gap-8"
  >
    <EventCard
      v-for="event in s.events"
      :key="event.id"
      :event="event"
      :venue="event.venue"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ name: 'Upcoming' })

const e = useEventsStore()
e.getEvents()

const s = appState()
</script>
