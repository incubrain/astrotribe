<!-- components/events/UpcomingEventsLink.vue -->
<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAstronomyEventsStore } from '@/stores/useAstronomyEventsStore'

const eventsStore = useAstronomyEventsStore()

// Initialize store when component is mounted
onMounted(async () => {
  if (eventsStore.events.length === 0) {
    await eventsStore.init()
  }
})

// Get the next 3 upcoming events
const upcomingEvents = computed(() => {
  const now = new Date()
  return eventsStore.events
    .filter((event) => event.date > now)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 3)
})

// Check if we have upcoming events
const hasUpcomingEvents = computed(() => upcomingEvents.value.length > 0)

// Helper functions for category styling
function getCategoryColor(categoryName: string) {
  const category = props.categories.find((c) => c.name === categoryName)
  if (!category) return 'bg-gray-800 text-gray-400'

  return `bg-${category.color}-${category.colorIntensity}/20 text-${category.color}-${category.colorIntensity}`
}

function getCategoryIcon(categoryName: string) {
  const category = props.categories.find((c) => c.name === categoryName)
  return category?.icon || 'mdi:star'
}

// Format date in a readable way
function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
</script>

<template>
  <div
    v-if="hasUpcomingEvents"
    class="bg-primary-900/40 backdrop-blur-sm border border-primary-800/30 rounded-xl p-4 mb-6"
  >
    <div class="flex items-center justify-between mb-4">
      <div class="flex gap-2 items-center">
        <Icon
          name="mdi:calendar-star"
          class="w-5 h-5 text-primary-500"
        />
        <h3 class="text-lg font-semibold">Upcoming Events</h3>
      </div>
      <NuxtLink
        to="/astronomy-events"
        class="text-primary-400 text-sm flex items-center gap-1 hover:text-primary-300"
      >
        <span>View All</span>
        <Icon
          name="mdi:arrow-right"
          class="w-4 h-4"
        />
      </NuxtLink>
    </div>

    <div class="space-y-3">
      <div
        v-for="event in upcomingEvents"
        :key="event.id"
        class="flex items-start gap-3 p-3 bg-primary-950/70 rounded-lg border border-primary-800/30 hover:bg-primary-900/50 transition-all"
      >
        <div
          class="p-2 rounded-full"
          :class="getCategoryColor(event.category)"
        >
          <Icon
            :name="getCategoryIcon(event.category)"
            class="w-5 h-5"
          />
        </div>
        <div class="flex-grow">
          <h4 class="font-medium">{{ event.title }}</h4>
          <div class="flex items-center gap-2 text-sm text-gray-400">
            <Icon
              name="mdi:calendar"
              class="w-4 h-4"
            />
            <span>{{ formatDate(event.date) }}</span>
            <span
              v-if="event.time"
              class="flex items-center gap-1"
            >
              <Icon
                name="mdi:clock-outline"
                class="w-4 h-4"
              />
              {{ event.time }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
