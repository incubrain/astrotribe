<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { createApp, computed } from 'vue'

const { store, loadMore } = useSelectData('astronomy_events', {
  orderBy: { column: 'id', ascending: true },
  initialFetch: true,
})

const { items: events } = storeToRefs(store)

const categories = [
  { name: 'Lunar Event', icon: 'mdi:moon-waning-crescent', color: 'gray', colorIntensity: '500' },
  { name: 'Meteor Shower', icon: 'mdi:meteor', color: 'red', colorIntensity: '400' },
  { name: 'Solar Event', icon: 'mdi:white-balance-sunny', color: 'yellow', colorIntensity: '500' },
  { name: 'Planetary Event', icon: 'mdi:planet', color: 'purple', colorIntensity: '500' },
  { name: 'Eclipse', icon: 'mdi:moon-new', color: 'indigo', colorIntensity: '500' },
  { name: 'Event by Astronera', icon: 'mdi:event-heart', color: 'blue', colorIntensity: '400' },
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

  const dayRanges = days.replace(/\s+/g, '').split(',')
  dayRanges.forEach((dayRange) => {
    if (dayRange.includes('-')) {
      const [start, end] = dayRange.split('-').map(Number)
      for (let i = start; i <= end; i++) {
        parsedDates.push(new Date(`${month} ${i}, ${year}`))
      }
    } else {
      parsedDates.push(new Date(`${month} ${Number(dayRange)}, ${year}`))
    }
  })

  return parsedDates
}

const calendarOptions = computed(() => ({
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
        icon: category?.icon,
        description: event.description,
        time: event.time,
      },
      category: event.category,
    }
  }),
  eventContent: (arg) => {
    const EventContent = resolveComponent('EventContent')
    const container = document.createElement('div')

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
}))
</script>

<template>
  <div class="flex flex-col md:flex-row md:px-10 py-24">
    <EventSidebar
      :categories="categories"
      class="w-full md:w-1/4 mb-6 md:mb-0"
    />
    <div class="w-full md:w-3/4 overflow-x-auto">
      <FullCalendar
        :options="calendarOptions"
        class="custom-calendar"
      />
    </div>
  </div>
</template>

<style scoped>
:deep(.fc) {
  background-color: #000000;
  padding: 8px;
}

:deep(.fc-toolbar) {
  flex-direction: column;
}

:deep(.fc-theme-standard td) {
  border: none;
}

:deep(.fc-scrollgrid-section-sticky > *) {
  background: transparent;
}

:deep(.fc-scrollgrid-sync-table) {
  margin: 8px;
}

:deep(.fc-daygrid-day) {
  position: relative;
  background-color: white;
  border-radius: 10px;
}

:deep(.fc-daygrid-day-frame) {
  display: flex;
  width: 100%;
  aspect-ratio: 1 / 1;
  flex-direction: column;
  justify-content: flex-start;
}

:deep(.fc-daygrid-day-events) {
  position: relative;
  overflow: hidden;
}

:deep(.fc-daygrid-event) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

:deep(.fc-daygrid-day.fc-day-today) {
  border: 3px solid gold !important;
  background-color: white;
}

:deep(.fc-daygrid-day-number) {
  color: black;
  border: 1px solid white;
  font-weight: 500;
  padding: 8px;
  position: absolute;
  top: 0;
}

:deep(.fc-col-header) {
  background: transparent;
}

:deep(.fc-col-header-cell) {
  background: black;
}

:deep(.fc-col-header-cell-cushion) {
  color: white;
  font-weight: 600;
  padding: 8px 4px;
}

:deep(.fc-scrollgrid) {
  border: none !important;
}

:deep(table) {
  border-collapse: separate;
  border-spacing: 8px;
}

:deep(.fc-daygrid-event) {
  border-radius: 4px;
  margin-top: 10%;
}

:deep(.fc-daygrid-dot-event) {
  display: block;
}

@media (max-width: 768px) {
  :deep(.fc) {
    overflow-x: auto;
    white-space: nowrap;
  }

  :deep(.fc-daygrid-day-frame) {
    padding: 4px;
  }

  :deep(.fc-daygrid-day-number) {
    font-size: 12px;
    padding: 4px;
  }

  :deep(.fc-daygrid-event) {
    font-size: 10px;
    padding: 2px 4px;
  }

  :deep(.fc-toolbar) {
    flex-direction: column;
    align-items: center;
  }

  :deep(.fc-daygrid-event) {
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 90%;
  }
}

@media (max-width: 480px) {
  .custom-calendar {
    flex-direction: column;
  }

  :deep(.fc-daygrid-event) {
    font-size: 9px;
    padding: 1px 3px;
  }
}
</style>
