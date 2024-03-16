<template>
  <div>
    <div
      v-if="events !== null"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 md:gap-4 2xl:gap-8"
    >
      <LazyEventCard
        v-for="event in events"
        :key="`event-card-${event.id}`"
        :event="event"
      />
    </div>
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 md:gap-4 2xl:gap-8"
    >
      <div class="p-8 space-y-1 rounded-md shadow-md foreground">
        <h3 class="pb-4 text-xl font-semibold"> No events to show, check back soon. </h3>
        <p>
          We have regularly scheduled events and are in the process of getting this page working.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const eventStore = useEventsStore()
eventStore.checkWeHaveEvents()
const { events } = storeToRefs(eventStore)

definePageMeta({ name: 'UpcomingEvents', layout: 'app' })
</script>
