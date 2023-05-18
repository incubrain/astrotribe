<template>
  <div class="min-h-full card-grid">
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
