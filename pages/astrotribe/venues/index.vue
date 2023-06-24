<template>
  <div
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-4 xl:gap-8"
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
