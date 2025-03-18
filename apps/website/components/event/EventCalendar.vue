<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Popover from 'primevue/popover'

// PROPS
const props = defineProps({
  events: {
    type: Array,
    default: () => [],
  },
  categories: {
    type: Array,
    default: () => [
      {
        name: 'Lunar Event',
        icon: 'mdi:moon-waning-crescent',
        color: 'gray',
        colorIntensity: '500',
      },
      { name: 'Meteor Shower', icon: 'mdi:meteor', color: 'red', colorIntensity: '400' },
      {
        name: 'Solar Event',
        icon: 'mdi:white-balance-sunny',
        color: 'yellow',
        colorIntensity: '500',
      },
      { name: 'Planetary Event', icon: 'mdi:planet', color: 'purple', colorIntensity: '500' },
      { name: 'Eclipse', icon: 'mdi:moon-new', color: 'indigo', colorIntensity: '500' },
      { name: 'Event by Astronera', icon: 'mdi:event-heart', color: 'blue', colorIntensity: '400' },
    ],
  },
})

// STATE
const currentDate = ref(new Date())
const searchQuery = ref('')
const activeFilters = ref(props.categories.map((c) => c.name))
const viewMode = ref('month')
const selectedEvent = ref(null)
const dayEventsDate = ref(null)
const dayEvents = ref([])

// Popover refs for single event & day events
const eventPopover = ref(null)
const dayEventsPopover = ref(null)

// COMPUTED
const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const currentMonthDisplay = computed(() =>
  currentDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
)

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

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
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

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const openEventDetails = (eventData, domEvent) => {
  selectedEvent.value = eventData
  eventPopover.value.toggle(domEvent)
}

const showAllEventsForDay = (date, domEvent) => {
  dayEventsDate.value = date
  dayEvents.value = getEventsForDate(date)
  dayEventsPopover.value.toggle(domEvent)
}

const getCategoryIcon = (categoryName) => {
  const category = props.categories.find((c) => c.name === categoryName)
  return category ? category.icon : 'mdi:star'
}

const getCategoryColor = (categoryName) => {
  const category = props.categories.find((c) => c.name === categoryName)
  return category ? category.color : 'gray'
}

const getCategoryIntensity = (categoryName) => {
  const category = props.categories.find((c) => c.name === categoryName)
  return category ? category.colorIntensity : '500'
}

const getCategoryClass = (categoryName) => {
  const color = getCategoryColor(categoryName)
  const intensity = getCategoryIntensity(categoryName)
  return `bg-${color}-${intensity}`
}

const getCategoryTextColor = (categoryName) => {
  const color = getCategoryColor(categoryName)
  return `text-${color}-400`
}

const getMoonPhase = (date) => {
  const synodicMonth = 29.53059
  const refDate = new Date('2023-01-01')
  const daysSinceRef = (date - refDate) / (24 * 60 * 60 * 1000)
  const phase = (daysSinceRef % synodicMonth) / synodicMonth
  if (phase < 0.025 || phase > 0.975) return '🌑'
  if (phase < 0.225) return '🌒'
  if (phase < 0.275) return '🌓'
  if (phase < 0.475) return '🌔'
  if (phase < 0.525) return '🌕'
  if (phase < 0.725) return '🌖'
  if (phase < 0.775) return '🌗'
  return '🌘'
}

const stars = ref([])

onMounted(() => {
  stars.value = Array.from({ length: 100 }, () => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    opacity: Math.random() * 0.8 + 0.2,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${2 + Math.random() * 3}s`,
  }))
  document.querySelectorAll('.astronomy-calendar-wrapper').forEach((el) => {
    el.classList.add('fade-in')
  })
})
</script>

<template>
  <div class="min-h-screen text-white">
    <!-- Main Content -->
    <main>
      <!-- Page Title -->
      <div class="relative mb-6 rounded-xl overflow-hidden">
        <div class="relative z-10 py-24 px-6 text-center">
          <h1
            class="text-4xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-primary-300 to-purple-300"
          >
            March 2025
          </h1>
          <p class="text-xl text-blue-100">Monthly Calendar Astronomical Events</p>
        </div>
      </div>

      <!-- Toolbar -->
      <div
        class="mb-6 bg-primary-900/40 backdrop-blur-md border border-primary-800/20 rounded-lg p-4"
      >
        <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
          <!-- Search -->
          <div class="relative w-full md:w-64">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search events..."
              class="w-full bg-primary-950/70 text-white border border-primary-800 rounded-md pl-8 py-2 focus:ring-1 focus:ring-primary-600 focus:outline-none"
            />
            <Icon
              name="i-lucide-search"
              class="absolute left-2 top-2.5 text-gray-400"
              size="16px"
            />
          </div>

          <!-- Category Filters -->
          <div class="flex flex-wrap gap-2 justify-center">
            <div
              v-for="category in props.categories"
              :key="category.name"
              :class="[
                'flex items-center gap-1 px-3 py-1.5 rounded-full cursor-pointer transition-all duration-300',
                activeFilters.includes(category.name)
                  ? `bg-${category.color}-${category.colorIntensity}/30 text-${category.color}-${parseInt(category.colorIntensity) - 100}`
                  : 'bg-primary-900/30 text-gray-400',
              ]"
              @click="toggleFilter(category.name)"
            >
              <Icon
                :name="category.icon"
                size="16px"
                :class="
                  activeFilters.includes(category.name)
                    ? `text-${category.color}-${category.colorIntensity}`
                    : ''
                "
              />
              <span class="text-sm">{{ category.name }}</span>
            </div>
          </div>

          <!-- View Switcher -->
          <div class="flex items-center gap-2 border-l border-primary-800/30 pl-4">
            <PrimeButton
              icon="i-lucide-calendar"
              rounded
              text
              :severity="viewMode === 'month' ? 'primary' : 'secondary'"
              aria-label="Month view"
              @click="viewMode = 'month'"
            />
            <PrimeButton
              icon="i-lucide-list"
              rounded
              text
              :severity="viewMode === 'list' ? 'primary' : 'secondary'"
              aria-label="List view"
              @click="viewMode = 'list'"
            />
          </div>
        </div>
      </div>

      <!-- Upcoming Highlights -->
      <div class="mb-6">
        <div class="flex items-center gap-2 mb-3">
          <h3 class="text-xl font-bold">Upcoming Highlights</h3>
          <div class="flex-1 h-px bg-primary-800/50"></div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="event in upcomingEvents"
            :key="'upcoming-' + event.id"
            class="bg-primary-900/40 backdrop-blur-md border border-primary-800/30 rounded-lg p-3 cursor-pointer hover:bg-primary-800/50 transition-all duration-300 transform hover:-translate-y-0.5"
            @click="openEventDetails(event, $event)"
          >
            <div class="flex justify-between items-start">
              <div class="flex items-center gap-2">
                <div
                  :class="`bg-${getCategoryColor(event.category)}-${getCategoryIntensity(event.category)}/20 text-${getCategoryColor(event.category)}-${getCategoryIntensity(event.category)} p-1.5 rounded-full`"
                >
                  <Icon
                    :name="getCategoryIcon(event.category)"
                    size="18px"
                  />
                </div>
                <div>
                  <h4 class="font-medium">{{ event.title }}</h4>
                  <p class="text-xs text-gray-400">{{ formatDate(event.date) }}</p>
                </div>
              </div>
              <div
                v-if="event.time"
                class="bg-primary-950/50 px-2 py-0.5 rounded text-xs"
              >
                {{ event.time }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Calendar Section -->
      <div class="astronomy-calendar-wrapper">
        <!-- Navigation -->
        <div class="flex justify-between items-center mb-4 px-2">
          <div class="flex items-center gap-2">
            <PrimeButton
              icon="i-lucide-chevron-left"
              rounded
              text
              severity="secondary"
              aria-label="Previous month"
              @click="navigateMonth(-1)"
            />
            <PrimeButton
              label="Today"
              rounded
              text
              severity="secondary"
              @click="goToToday()"
            />
            <PrimeButton
              icon="i-lucide-chevron-right"
              rounded
              text
              severity="secondary"
              aria-label="Next month"
              @click="navigateMonth(1)"
            />
          </div>
          <h2 class="text-2xl font-bold">{{ currentMonthDisplay }}</h2>
          <div class="flex items-center gap-2 text-sm bg-primary-900/30 px-3 py-1 rounded-full">
            <Icon
              name="i-lucide-map-pin"
              size="14px"
              class="text-primary-400"
            />
            <span>Pune, India</span>
          </div>
        </div>

        <!-- Month View -->
        <div
          v-if="viewMode === 'month'"
          class="space-y-1"
        >
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
            <div
              v-for="(day, index) in calendarDays"
              :key="index"
              :class="[
                'relative min-h-24 p-1 rounded-md overflow-hidden transition-all',
                day.isCurrentMonth ? 'bg-primary-900/30' : 'bg-primary-950/50 opacity-60',
                day.isToday ? 'ring-2 ring-primary-500/70' : '',
                day.isPast ? 'opacity-80' : '',
              ]"
            >
              <!-- Star Animation -->
              <div class="absolute inset-0 opacity-20 pointer-events-none">
                <div
                  v-for="n in 5"
                  :key="n"
                  class="absolute w-0.5 h-0.5 bg-white rounded-full animate-pulse"
                  :style="{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 3}s`,
                  }"
                ></div>
              </div>
              <!-- Date & Moon Phase -->
              <div class="flex justify-between items-start">
                <span class="text-sm font-semibold">{{ day.date.getDate() }}</span>
                <span
                  v-if="day.isCurrentMonth"
                  class="text-xs"
                  >{{ getMoonPhase(day.date) }}</span
                >
              </div>
              <!-- Events for Day -->
              <div class="mt-1 space-y-1">
                <template v-if="day.events.length">
                  <div
                    v-for="(event, eventIndex) in day.events.slice(0, 2)"
                    :key="`event-${day.date}-${eventIndex}`"
                    v-tooltip.top="event.title"
                    :class="[
                      'text-xs px-1 py-0.5 rounded flex items-center gap-1 cursor-pointer hover:opacity-90 transition-opacity',
                      getCategoryClass(event.category),
                    ]"
                    @click="openEventDetails(event, $event)"
                  >
                    <Icon
                      :name="getCategoryIcon(event.category)"
                      size="12px"
                    />
                    <span class="truncate">{{ event.title }}</span>
                  </div>
                  <!-- More Events Indicator -->
                  <div
                    v-if="day.events.length > 2"
                    class="text-xs text-primary-300 flex items-center gap-1 cursor-pointer"
                    @click="showAllEventsForDay(day.date, $event)"
                  >
                    <Icon
                      name="i-lucide-plus"
                      size="12px"
                    />
                    <span>{{ day.events.length - 2 }} more</span>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- List View remains unchanged -->
        <div
          v-else-if="viewMode === 'list'"
          class="bg-primary-900/20 rounded-lg p-4"
        >
          <div
            v-if="filteredEvents.length === 0"
            class="text-center py-8 text-gray-400"
          >
            No events found for the selected filters.
          </div>
          <div
            v-else
            class="space-y-2"
          >
            <div
              v-for="event in filteredEvents"
              :key="`list-${event.id}`"
              class="bg-primary-900/40 rounded-lg p-3 hover:bg-primary-800/40 transition-colors cursor-pointer"
              @click="openEventDetails(event, $event)"
            >
              <div class="flex justify-between items-start">
                <div class="flex gap-3 items-start">
                  <div
                    :class="[
                      'p-2 rounded-full',
                      `bg-${getCategoryColor(event.category)}-${getCategoryIntensity(event.category)}/30`,
                    ]"
                  >
                    <Icon
                      :name="getCategoryIcon(event.category)"
                      size="20px"
                      :class="getCategoryTextColor(event.category)"
                    />
                  </div>
                  <div>
                    <h4 class="font-semibold">{{ event.title }}</h4>
                    <p class="text-sm text-gray-400 mt-1">{{ event.description }}</p>
                  </div>
                </div>
                <div class="text-sm text-right">
                  <div class="font-medium">{{ formatDate(event.date) }}</div>
                  <div
                    v-if="event.time"
                    class="text-gray-400"
                    >{{ event.time }}</div
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Event Details Popover -->
    <Popover
      ref="eventPopover"
      class="astronomy-event-popover border border-color"
      dismissable
    >
      <div
        v-if="selectedEvent"
        class="space-y-4 p-4"
      >
        <div class="flex items-center gap-2">
          <div
            :class="[
              'p-2 rounded-full',
              `bg-${getCategoryColor(selectedEvent.category)}-${getCategoryIntensity(selectedEvent.category)}/30`,
            ]"
          >
            <Icon
              :name="getCategoryIcon(selectedEvent.category)"
              size="24px"
              :class="getCategoryTextColor(selectedEvent.category)"
            />
          </div>
          <span
            :class="[
              'px-3 py-1 rounded-full text-sm',
              `bg-${getCategoryColor(selectedEvent.category)}-${getCategoryIntensity(selectedEvent.category)}/20`,
              getCategoryTextColor(selectedEvent.category),
            ]"
          >
            {{ selectedEvent.category }}
          </span>
        </div>
        <div class="space-y-3 text-gray-300">
          <div class="flex items-start gap-3">
            <Icon
              name="i-lucide-calendar"
              size="18px"
              class="mt-0.5 text-primary-400"
            />
            <span>{{ formatDate(selectedEvent.date) }}</span>
          </div>
          <div
            v-if="selectedEvent.time"
            class="flex items-start gap-3"
          >
            <Icon
              name="i-lucide-clock"
              size="18px"
              class="mt-0.5 text-primary-400"
            />
            <span>{{ selectedEvent.time }}</span>
          </div>
          <div
            v-if="selectedEvent.location"
            class="flex items-start gap-3"
          >
            <Icon
              name="i-lucide-map-pin"
              size="18px"
              class="mt-0.5 text-primary-400"
            />
            <span>{{ selectedEvent.location }}</span>
          </div>
          <div
            v-if="selectedEvent.visibility"
            class="flex items-start gap-3"
          >
            <Icon
              name="i-lucide-eye"
              size="18px"
              class="mt-0.5 text-primary-400"
            />
            <span>Visibility: {{ selectedEvent.visibility }}</span>
          </div>
          <div class="flex items-start gap-3">
            <Icon
              name="i-lucide-info"
              size="18px"
              class="mt-0.5 text-primary-400"
            />
            <p>{{ selectedEvent.description }}</p>
          </div>
        </div>
        <div
          v-if="selectedEvent.category === 'Event by Astronera'"
          class="pt-2"
        >
          <PrimeButton
            label="Register for this event"
            severity="primary"
            class="w-full"
          />
        </div>
      </div>
    </Popover>

    <!-- Day Events Popover -->
    <Popover
      ref="dayEventsPopover"
      class="astronomy-day-events-popover border border-color"
      dismissable
    >
      <div
        v-if="dayEvents.length"
        class="space-y-2 p-4"
      >
        <div
          v-for="event in dayEvents"
          :key="`day-event-${event.id}`"
          class="bg-primary-900/40 rounded-lg p-3 hover:bg-primary-800/40 transition-colors cursor-pointer"
          @click="(openEventDetails(event, $event), dayEventsPopover.value.hide())"
        >
          <div class="flex items-start gap-3">
            <div
              :class="[
                'p-2 rounded-full',
                `bg-${getCategoryColor(event.category)}-${getCategoryIntensity(event.category)}/30`,
              ]"
            >
              <Icon
                :name="getCategoryIcon(event.category)"
                size="20px"
                :class="getCategoryTextColor(event.category)"
              />
            </div>
            <div class="flex-1">
              <h4 class="font-semibold">{{ event.title }}</h4>
              <div class="flex items-center gap-2 text-sm text-gray-400 mt-1">
                <Icon
                  v-if="event.time"
                  name="i-lucide-clock"
                  size="14px"
                />
                <span v-if="event.time">{{ event.time }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="text-center py-4 text-gray-400 p-4"
      >
        No events for this day.
      </div>
    </Popover>
  </div>
</template>

<style scoped>
/* Star twinkling animation */
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

/* Pulse effect */
@keyframes pulse {
  0%,
  100% {
    opacity: 0.2;
  }
  50% {
    opacity: 0.7;
  }
}
.animate-pulse {
  animation: pulse 3s infinite ease-in-out;
  animation-fill-mode: both;
}

/* (Optional) Custom styling for calendar events */
:deep(.fc-daygrid-event) {
  background-color: rgba(15, 23, 42, 0.7) !important;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(30, 41, 59, 0.3) !important;
  transition: all 0.3s ease;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);
}
:deep(.fc-daygrid-event:hover) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

:deep(.astronomy-event-popover),
:deep(.astronomy-day-events-popover) {
  width: 320px !important; /* or any fixed width you prefer */
  max-width: 320px !important; /* ensure it doesn’t auto-resize */
  background-color: rgba(15, 23, 42, 0.95); /* dark background */
  backdrop-filter: blur(10px);
  border-radius: 0.5rem;
  border: 1px solid rgba(51, 65, 85, 0.5);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  color: #fff; /* ensure text is visible on dark bg */
  padding: 1rem; /* add padding so content isn’t flush */
}
</style>
