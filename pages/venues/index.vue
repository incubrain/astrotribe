<template>
  <div
    class="min-h-full grid grid-cols-[minmax(160px,1fr)] lg:grid-cols-[minmax(160px,1fr)_minmax(160px,1fr)] 2xl:grid-cols-[minmax(160px,1fr)_minmax(160px,1fr)_minmax(160px,1fr)] rounded-md shadow-sm gap-6"
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
