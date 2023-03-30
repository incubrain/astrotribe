<template>
  <div
    class="min-h-full grid grid-cols-[minmax(160px,1fr)] md:grid-cols-[minmax(160px,1fr)_minmax(160px,1fr)] 2xl:grid-cols-[minmax(160px,1fr)_minmax(160px,1fr)_minmax(160px,1fr)] rounded-md shadow-sm gap-8"
  >
    <p>{{ s.event }}</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ name: 'Single Event' })

const e = useEventsStore()
e.getSingleEvent()

const s = appState()
</script>
