<template>
  <div
    class="min-h-full main-grid"
  >
    <CardVenue
      v-for="venue in s.venues"
      :key="venue.id"
      :venue="venue"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ name: 'Venues' })

const v = useVenuesStore()
await v.getVenues()

const s = appState()

console.log('venues', s.venues)
</script>
