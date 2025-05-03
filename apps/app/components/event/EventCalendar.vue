<script setup lang="ts">
import { ref, computed, onMounted, provide } from 'vue'
import type { AstronomyEvent } from '@/stores/useAstronomyEventsStore'

// PROPS
const props = defineProps({
  events: {
    type: Array as () => AstronomyEvent[],
    default: () => [],
  },
})

const viewModeStore = useViewModeStore()
const { viewMode } = storeToRefs(viewModeStore)

const { categories } = useEventCategories()

// STATE
const currentDate = ref(new Date())
const searchQuery = ref('')
const activeFilters = ref(categories.map((c) => c.name))

// Event Dialogs
const selectedEvent = ref<AstronomyEvent | null>(null)
const showDayEventsDialog = ref(false)
const openEventDetails = (eventData) => {
  selectedEvent.value = eventData
}

const showAllEventsForDay = (date) => {
  dayEventsDate.value = date
  dayEvents.value = getEventsForDate(date)
  showDayEventsDialog.value = true
}

const dayEventsDate = ref(null)

const dayEvents = ref([])

// COMPUTED
const filteredEvents = computed(() =>
  props.events.filter((event) => {
    const matchesFilter = activeFilters.value.includes(event.category)
    const matchesSearch =
      !searchQuery.value ||
      event.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesFilter && matchesSearch
  }),
)

const upcomingEvents = computed(() => {
  const today = new Date()
  return filteredEvents.value
    .filter((event) => new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3)
})

const pastDaysLimit = ref(10)
const orderedEvents = computed(() => {
  const today = new Date()
  const pastLimit = new Date(today)
  pastLimit.setDate(pastLimit.getDate() - pastDaysLimit.value)

  return filteredEvents.value
    .filter((event) => {
      const eventDate = new Date(event.date)
      return eventDate >= pastLimit
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
})

// METHODS
const getEventsForDate = (date) =>
  filteredEvents.value.filter((event) => {
    const eventDate = new Date(event.date)
    return (
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear()
    )
  })

const toggleFilter = (categoryName) => {
  const index = activeFilters.value.indexOf(categoryName)
  if (index > -1) activeFilters.value.splice(index, 1)
  else activeFilters.value.push(categoryName)
}

const navigateMonth = (direction) => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() + direction)
  currentDate.value = newDate
}

const goToToday = () => {
  currentDate.value = new Date()
}

onMounted(() => {
  document.querySelectorAll('.astronomy-calendar-wrapper').forEach((el) => {
    el.classList.add('fade-in')
  })
})
</script>

<template>
  <div class="min-h-screen text-white">
    <main>
      <EventToolbar v-model:search-query="searchQuery" />

      <EventCategories
        :categories="categories"
        :active-filters="activeFilters"
        @toggle-filter="toggleFilter"
      />

      <EventUpcoming
        :events="upcomingEvents"
        @open-event="openEventDetails"
      />

      <div class="astronomy-calendar-wrapper">
        <EventCalendarNav
          :current-date="currentDate"
          @navigate-month="navigateMonth"
          @go-to-today="goToToday"
        />

        <EventCalendarGrid
          v-if="viewMode === 'grid'"
          :current-date="currentDate"
          :filtered-events="filteredEvents"
          @open-event="openEventDetails"
          @show-day-events="showAllEventsForDay"
        />
        <EventList
          v-else
          :events="orderedEvents"
          @open-event="openEventDetails"
        />
      </div>
    </main>

    <PrimeDialog
      v-model:visible="selectedEvent"
      modal
      header="Event Details"
      :style="{ width: '30rem' }"
      @hide="selectedEvent = null"
    >
      <template v-if="selectedEvent">
        <h3 class="text-xl font-bold mb-2">{{ selectedEvent.title }}</h3>
        <p class="mb-4 text-gray-300">{{ selectedEvent.description }}</p>
        <p><strong>Date:</strong> {{ selectedEvent.date }}</p>
        <p v-if="selectedEvent.time"><strong>Time:</strong> {{ selectedEvent.time }}</p>
        <p v-if="selectedEvent.location"><strong>Location:</strong> {{ selectedEvent.location }}</p>
      </template>
    </PrimeDialog>

    <PrimeDialog
      v-model:visible="showDayEventsDialog"
      modal
      header="Events on {{ dayEventsDate?.toLocaleDateString() }}"
      :style="{ width: '30rem' }"
      @hide="showDayEventsDialog = false"
    >
      <ul>
        <li
          v-for="event in dayEvents"
          :key="event.id"
          >{{ event.title }}</li
        >
      </ul>
    </PrimeDialog>
  </div>
</template>

<style scoped>
/* Fade in animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.2);
  }
}

/* Pulse animation */
@keyframes pulse {
  0%,
  100% {
    opacity: 0.4;
  }
  50% {
    opacity: 1;
  }
}
.animate-pulse {
  animation: pulse 3s infinite ease-in-out;
  animation-fill-mode: both;
}

/* Popover styling */
.astronomy-event-popover,
.astronomy-day-events-popover {
  width: 320px !important;
  max-width: 320px !important;
  background-color: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 0.5rem;
  border: 1px solid rgba(51, 65, 85, 0.5);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  color: #fff;
  padding: 1rem;
}
</style>
