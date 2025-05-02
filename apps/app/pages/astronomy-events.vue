<script setup lang="ts">
import { onMounted } from 'vue'
import { useAstronomyEventsStore } from '@/stores/useAstronomyEventsStore'

definePageMeta({ name: 'Astronomy Events' })

const eventsStore = useAstronomyEventsStore()

// Initialize store when component is mounted
onMounted(async () => {
  // Check if we need to load data
  if (eventsStore.events.length === 0) {
    await eventsStore.init()
  }
})

// For now, we'll use the mock data from the store
// Later this can be replaced with real API data
</script>

<template>
  <div class="min-h-screen text-white ">
    <!-- Main Content -->
    <FeedTitle title="Astronomy Events" />

    <div class="wrapper mx-auto py-8">
      <!-- Page Title -->

      <!-- Calendar Component -->
      <EventCalendar
        :events="eventsStore.filteredEvents"
        :categories="eventsStore.categories"
      />
    </div>
  </div>
</template>
