<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { createApp, defineComponent } from 'vue'

const { store, loadMore } = useSelectData('astronomy_events', {
  orderBy: { column: 'id', ascending: true },
  pagination: {
    page: 1,
    limit: 21,
  },
  initialFetch: true,
})

const { items: events } = storeToRefs(store)

const categories = [
  {
    name: 'Lunar Event',
    icon: 'mdi:moon-waning-crescent',
    color: 'gray',
    colorIntensity: '500',
  },
  {
    name: 'Meteor Shower',
    icon: 'mdi:meteor',
    color: 'red',
    colorIntensity: '400',
  },
  {
    name: 'Solar Event',
    icon: 'mdi:white-balance-sunny',
    color: 'yellow',
    colorIntensity: '500',
  },
  {
    name: 'Planetary Event',
    icon: 'mdi:planet',
    color: 'purple',
    colorIntensity: '500',
  },
  {
    name: 'Eclipse',
    icon: 'mdi:moon-new',
    color: 'indigo',
    colorIntensity: '500',
  },
  {
    name: 'Event by Astronera',
    icon: 'mdi:event-heart',
    color: 'blue',
    colorIntensity: '400',
  },
]

function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

const today = new Date()

function parseMultipleDates(dateStr: string): Date[] {
  const datePattern = /([A-Za-z]+) ([\d,\- ]+) (\d{4})/
  const match = dateStr.match(datePattern)

  if (!match) return []

  const [, month, days, year] = match
  const parsedDates: Date[] = []

  // Normalize the days string (remove extra spaces and split by commas or dashes)
  const dayRanges = days.replace(/\s+/g, '').split(',')

  dayRanges.forEach((dayRange) => {
    if (dayRange.includes('-')) {
      // Handle range like "1-5"
      const [start, end] = dayRange.split('-').map(Number)
      for (let i = start; i <= end; i++) {
        parsedDates.push(new Date(`${month} ${i}, ${year}`))
      }
    } else {
      // Handle single days
      parsedDates.push(new Date(`${month} ${Number(dayRange)}, ${year}`))
    }
  })

  return parsedDates
}

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const calendarOptions = computed(() => {
  const start = new Date(today.getFullYear(), today.getMonth() - 1, 1) // Start of previous month
  const end = new Date(today.getFullYear() + 1, today.getMonth(), 0)

  return {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    initialDate: today,
    events: events.value.map((event) => {
      const dates = parseMultipleDates(event.date)
      const start = dates[0]
      const end = dates.length > 1 && dates[dates.length - 1]
      const category = categories.find((el) => el.name === event.category)
      const classNames = category && `bg-${category.color}-${category.colorIntensity}`

      return {
        id: event.id.toString(),
        title: event.title,
        classNames,
        start,
        end,
        extendedProps: {
          icon: category.icon,
          description: event.description,
          time: event.time,
        },
        category: event.category,
      }
    }),
    eventContent: (arg) => {
      // Create a wrapper div
      const EventContent = resolveComponent('EventContent') // Dynamically resolve the component
      const container = document.createElement('div')

      // Mount the Vue component inside the div
      createApp(EventContent, {
        title: arg.event.title,
        categoryClass: arg.event.classNames,
        icon: arg.event.extendedProps.icon,
        description: arg.event.extendedProps.description,
        time: arg.event.extendedProps.time,
      }).mount(container)

      return { domNodes: [container] }
    },
    timeZone: 'local',
    height: 'auto',
    showNonCurrentDates: true,
    fixedWeekCount: false,
    dayMaxEvents: true,
    firstDay: 1,
  }
})
</script>

<template>
  <div class="flex flex-row px-10 md:py-24">
    <EventSidebar
      :categories="categories"
      class="flex-1"
    />
    <FullCalendar
      :options="calendarOptions"
      class="custom-calendar flex-3"
    />
  </div>
</template>

<style scoped>
/* Calendar container */
:deep(.fc) {
  background-color: #000000;
  padding: 8px;
}

:deep(.fc-theme-standard td) {
  border: none;
}

:deep(.fc-scrollgrid-section-sticky > *) {
  background: transparent;
}

/* Control table layout */
:deep(.fc-scrollgrid-sync-table) {
  margin: 8px;
}

/* Make cells square with fixed dimensions */
:deep(.fc-daygrid-day) {
  position: relative;
  background-color: white;
  border: none !important;
  border-radius: 10px;
}

/* Ensure all day cells have the same fixed height */
:deep(.fc-daygrid-day-frame) {
  min-height: 80px; /* Adjust as needed */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

/* Prevent cell expansion when events are added */
:deep(.fc-daygrid-day-events) {
  position: relative;
  overflow: hidden;
}

/* Ensure events do not affect row height */
:deep(.fc-daygrid-event) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

/* Ensure today’s date remains styled correctly */
:deep(.fc-daygrid-day.fc-day-today) {
  border: 3px solid gold !important;
  background-color: white;
}

/* Style day numbers */
:deep(.fc-daygrid-day-number) {
  color: black;
  border: 1px solid white;
  font-weight: 500;
  padding: 8px;
  position: absolute;
  top: 0;
  left: 0;
}

:deep(.fc-col-header) {
  background: transparent;
}

/* Header styling */
:deep(.fc-col-header-cell) {
  background: black;
}

:deep(.fc-col-header-cell-cushion) {
  color: white;
  font-weight: 600;
  padding: 8px 4px;
}

/* Remove default borders */
:deep(.fc-scrollgrid) {
  border: none !important;
}

:deep(table) {
  border-collapse: separate;
  border-spacing: 8px; /* This won't affect height now */
}

/* Events styling */
:deep(.fc-daygrid-event) {
  margin: 1px 4px;
  border-radius: 4px;
}

:deep(.fc-daygrid-dot-event) {
  display: block;
}

:deep(.fc .fc-daygrid-day.fc-day-today) {
  border: 5px solid gold !important;
  border-radius: 10px;
  background-color: white;
}

.Moon {
}
</style>
