<template>
  <div class="min-h-full card-grid">
    <CardEvent
      v-for="event in s.events"
      :key="event.id"
      :event="event"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ name: 'Upcoming' })

const e = useEventsStore()
e.getEvents()

const s = appState()
</script>
