<script setup lang="ts">
defineProps({
  events: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['open-event'])
const handleEventClick = (event, nativeEvent) => {
  console.log('Event clicked:', event, nativeEvent)
  emit('open-event', event, nativeEvent)
}
</script>

<template>
  <div class="mb-6">
    <div class="flex items-center gap-2 mb-3">
      <h3 class="text-xl font-bold">Upcoming Highlights</h3>
      <div class="flex-1 h-px bg-primary-800/50"></div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <EventCard
        v-for="event in events"
        :key="'upcoming-' + event.id"
        :event="event"
        @click="handleEventClick(event, $event)"
      />
    </div>
  </div>
</template>
