<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  currentDate: {
    type: Date,
    required: true,
  },
  filteredEvents: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['open-event', 'show-day-events'])

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const calendarDays = computed(() => {
  const year = props.currentDate.getFullYear()
  const month = props.currentDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  let firstDayOfWeek = firstDay.getDay() - 1
  if (firstDayOfWeek < 0) firstDayOfWeek = 6
  const daysFromPrevMonth = firstDayOfWeek
  const totalDaysToShow = 42
  const result = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const prevMonth = new Date(year, month, 0)
  const prevMonthDays = prevMonth.getDate()

  for (let i = prevMonthDays - daysFromPrevMonth + 1; i <= prevMonthDays; i++) {
    const date = new Date(year, month - 1, i)
    result.push({
      date,
      isCurrentMonth: false,
      isToday: date.getTime() === today.getTime(),
      isPast: date < today,
      events: getEventsForDate(date),
    })
  }
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i)
    result.push({
      date,
      isCurrentMonth: true,
      isToday: date.getTime() === today.getTime(),
      isPast: date < today,
      events: getEventsForDate(date),
    })
  }
  const remainingDays = totalDaysToShow - result.length
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i)
    result.push({
      date,
      isCurrentMonth: false,
      isToday: date.getTime() === today.getTime(),
      isPast: date < today,
      events: getEventsForDate(date),
    })
  }
  return result
})

const getEventsForDate = (date) =>
  props.filteredEvents.filter((event) => {
    const eventDate = new Date(event.date)
    return (
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear()
    )
  })

const handleOpenEvent = (event) => {
  emit('open-event', event)
}

const handleShowDayEvents = (date) => {
  emit('show-day-events', date)
}
</script>

<template>
  <div class="space-y-1">
    <div class="grid grid-cols-7 gap-1 mb-1">
      <div
        v-for="day in daysOfWeek"
        :key="day"
        class="p-2 text-center font-semibold bg-primary-800/60 rounded-md"
      >
        {{ day }}
      </div>
    </div>
    <div class="grid grid-cols-7 gap-1">
      <EventCalendarDayCell
        v-for="(day, index) in calendarDays"
        :key="index"
        :day="day"
        @click="(e) => $emit('open-event', event, e)"
        @show-day-events="handleShowDayEvents"
      />
    </div>
  </div>
</template>
