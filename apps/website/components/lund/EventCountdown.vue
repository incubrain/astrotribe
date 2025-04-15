<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue'

const { conf: motionConstants } = useAnimation()
const { trackUserEngagement } = useAnalytics()

// Define props
const props = defineProps({
  activePersona: {
    type: String,
    default: 'researchers',
  },
})

// Define events based on persona preferences
const allEvents = [
  {
    id: 1,
    name: 'Lyrid Meteor Shower',
    date: new Date('2025-04-22T22:00:00'),
    description: 'Annual meteor shower active from April 16–25',
    type: 'meteor',
    color: 'red',
    icon: 'mdi:meteor',
    bestFor: 'communicators',
  },
  {
    id: 2,
    name: 'Partial Solar Eclipse',
    date: new Date('2025-03-29T09:00:00'),
    description: 'Visible from North America and parts of Europe',
    type: 'eclipse',
    color: 'amber',
    icon: 'mdi:weather-night',
    bestFor: 'enthusiasts',
  },
  {
    id: 3,
    name: 'SpaceX Starship Launch',
    date: new Date('2025-03-15T14:30:00'),
    description: 'Next orbital test flight from Boca Chica, Texas',
    type: 'launch',
    color: 'blue',
    icon: 'mdi:rocket-launch',
    bestFor: 'enthusiasts',
  },
  {
    id: 4,
    name: 'International Astronomy Conference',
    date: new Date('2025-05-10T09:00:00'),
    description: 'Annual gathering of astronomy researchers from around the world',
    type: 'conference',
    color: 'indigo',
    icon: 'mdi:account-group',
    bestFor: 'researchers',
  },
  {
    id: 5,
    name: 'NASA Data Workshop',
    date: new Date('2025-04-05T10:00:00'),
    description: 'Learn how to use NASA open data for research and analysis',
    type: 'workshop',
    color: 'primary',
    icon: 'mdi:database',
    bestFor: 'researchers',
  },
]

// Filter events and sort by date
const events = computed(() => {
  return [...allEvents].sort((a, b) => a.date.getTime() - b.date.getTime())
})

// Select active event based on persona
const getInitialEvent = () => {
  // First try to find an event specifically recommended for this persona
  const personaEvent = events.value.find((event) => event.bestFor === props.activePersona)
  if (personaEvent) return personaEvent

  // If none found, return the closest upcoming event
  const now = new Date().getTime()
  const futureEvents = events.value.filter((event) => event.date.getTime() > now)

  if (futureEvents.length > 0) {
    return futureEvents[0] // Closest upcoming event
  }

  return events.value[0] // Fallback to first event
}

// Active event state
const activeEvent = ref(getInitialEvent())

// Update active event when persona changes
watch(
  () => props.activePersona,
  () => {
    activeEvent.value = getInitialEvent()
    initializeCountdown(activeEvent.value.date)
  },
)

// Countdown timer state
const countdown = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
})

// Timer interval
let countdownInterval = null

// Initialize countdown for selected event
const initializeCountdown = (eventDate) => {
  // Clear any existing interval
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }

  // Set up interval to update countdown every second
  countdownInterval = setInterval(() => {
    updateCountdown(eventDate)
  }, 1000)

  // Initial update
  updateCountdown(eventDate)
}

// Update countdown values
const updateCountdown = (targetDate) => {
  const now = new Date().getTime()
  const targetTime = targetDate.getTime()
  const difference = targetTime - now

  // Handle expired countdown
  if (difference <= 0) {
    handleExpired()
    return
  }

  // Calculate time units
  const days = Math.floor(difference / (1000 * 60 * 60 * 24))
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((difference % (1000 * 60)) / 1000)

  // Update state
  countdown.value = { days, hours, minutes, seconds }
}

// Handle expired countdown
const handleExpired = () => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }

  countdown.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }

  // Find the next event
  const now = new Date().getTime()
  const futureEvents = events.value.filter((event) => event.date.getTime() > now)

  if (futureEvents.length > 0) {
    activeEvent.value = futureEvents[0]
    initializeCountdown(activeEvent.value.date)
  }
}

// Select a specific event
const selectEvent = (eventId) => {
  const event = events.value.find((e) => e.id === eventId)
  if (!event) return

  activeEvent.value = event
  initializeCountdown(event.date)

  // Track the interaction
  trackUserEngagement(UserEngagementMetric.FeatureAdoption, {
    feature: 'event_countdown',
    event_id: eventId,
    event_name: event.name,
  })
}

// Format date for display
const formatEventDate = (date) => {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Track when users click "View Full Calendar"
const trackViewFullCalendar = () => {
  trackUserEngagement(UserEngagementMetric.ActionsPerSession, {
    action: 'view_full_calendar',
    persona: props.activePersona,
  })
}

// Set up countdown on mount
onMounted(() => {
  initializeCountdown(activeEvent.value.date)
})

// Clean up on unmount
onBeforeUnmount(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})
</script>

<template>
  <section class="py-16 md:py-20 relative overflow-hidden">
    <!-- Background gradient -->
    <div class="absolute inset-0 bg-gradient-to-b from-slate-950 to-primary-950/70 z-0"></div>

    <!-- Glow effects -->
    <div class="absolute left-0 top-1/3 w-64 h-64 bg-primary-600/5 rounded-full blur-3xl"></div>
    <div class="absolute right-0 bottom-1/3 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl"></div>

    <div class="wrapper relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <div
        v-motion="motionConstants.sectionTitle"
        class="text-center max-w-3xl mx-auto mb-8"
      >
        <h2 class="text-3xl md:text-5xl font-bold mb-4 text-white leading-tight">
          Next
          <span class="bg-gradient-to-r from-blue-500 to-primary-600 bg-clip-text text-transparent"
            >Astronomical</span
          >
          Events
        </h2>
        <p class="text-xl text-gray-300 mb-6">
          Stay updated with important space events and never miss a launch
        </p>

        <!-- View Full Calendar button at the top -->
        <PrimeButton
          size="large"
          class="bg-blue-600 hover:bg-blue-500 border-none shadow-lg shadow-blue-900/20"
          @click="trackViewFullCalendar"
        >
          <Icon
            name="mdi:calendar-month"
            class="mr-2"
            size="20"
          />
          View Full Calendar
        </PrimeButton>
      </div>

      <!-- Event selection tabs -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 0.2 } }"
        class="flex flex-wrap justify-center gap-3 mb-10"
      >
        <button
          v-for="event in events"
          :key="event.id"
          class="px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2"
          :class="
            activeEvent.id === event.id
              ? `bg-${event.color}-600 text-white shadow-lg shadow-${event.color}-900/20`
              : 'bg-slate-800/70 text-gray-300 hover:bg-slate-700/70 border border-slate-700/50'
          "
          @click="selectEvent(event.id)"
        >
          <Icon
            :name="event.icon"
            size="18"
          />
          <span>{{ event.name }}</span>
        </button>
      </div>

      <!-- Countdown display -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 0.3 } }"
        class="max-w-4xl mx-auto"
      >
        <div
          class="rounded-xl bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 overflow-hidden"
          :class="`border-${activeEvent.color}-800/30 shadow-xl shadow-${activeEvent.color}-900/10`"
        >
          <!-- Event header -->
          <div
            class="px-6 py-4 border-b border-slate-800/30 flex items-center justify-between"
            :class="`bg-${activeEvent.color}-900/20`"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center"
                :class="`bg-${activeEvent.color}-600/30 text-${activeEvent.color}-400`"
              >
                <Icon
                  :name="activeEvent.icon"
                  size="24"
                />
              </div>
              <div>
                <h3 class="text-xl font-bold text-white">{{ activeEvent.name }}</h3>
                <p class="text-sm text-gray-400">{{ formatEventDate(activeEvent.date) }}</p>
              </div>
            </div>
            <div>
              <span
                class="px-3 py-1 rounded-full text-sm"
                :class="`bg-${activeEvent.color}-900/30 text-${activeEvent.color}-400 border border-${activeEvent.color}-800/30`"
              >
                {{ activeEvent.type }}
              </span>
            </div>
          </div>

          <!-- Countdown display -->
          <div class="p-8">
            <p class="text-gray-300 mb-6">{{ activeEvent.description }}</p>

            <div class="grid grid-cols-4 gap-4 text-center mb-8">
              <div
                v-for="(value, unit) in countdown"
                :key="unit"
                class="countdown-unit p-6 rounded-lg border border-slate-800/30 bg-slate-800/50 relative overflow-hidden"
              >
                <!-- Subtle background glow matching event color -->
                <div
                  class="absolute inset-0 opacity-20"
                  :class="`bg-${activeEvent.color}-900/20`"
                ></div>

                <div
                  class="text-5xl font-bold mb-1 relative z-10"
                  :class="`text-${activeEvent.color}-400`"
                >
                  {{ value }}
                </div>
                <div class="text-xs text-gray-400 uppercase relative z-10">{{ unit }}</div>
              </div>
            </div>

            <!-- Add to calendar options -->
            <div class="flex items-center justify-between">
              <div>
                <span class="text-sm text-gray-400">Add to your calendar:</span>
                <div class="flex gap-3 mt-2">
                  <button
                    v-for="(cal, idx) in ['Google', 'Apple', 'Outlook']"
                    :key="idx"
                    class="px-3 py-1.5 rounded text-xs transition-colors duration-300 flex items-center gap-1"
                    :class="`bg-${activeEvent.color}-900/20 text-${activeEvent.color}-400 hover:bg-${activeEvent.color}-900/40 border border-${activeEvent.color}-800/30`"
                    @click="
                      trackUserEngagement(UserEngagementMetric.ActionsPerSession, {
                        action: 'add_to_calendar',
                        calendar_type: cal,
                        event_id: activeEvent.id,
                      })
                    "
                  >
                    <Icon
                      name="mdi:calendar-plus"
                      size="14"
                    />
                    <span>{{ cal }}</span>
                  </button>
                </div>
              </div>

              <!-- Reminder button -->
              <PrimeButton
                outlined
                :class="`border-${activeEvent.color}-600 text-${activeEvent.color}-500 hover:bg-${activeEvent.color}-900/20`"
                @click="
                  trackUserEngagement(UserEngagementMetric.FeatureAdoption, {
                    feature: 'set_event_reminder',
                    event_id: activeEvent.id,
                    event_name: activeEvent.name,
                  })
                "
              >
                <Icon
                  name="mdi:bell-ring-outline"
                  class="mr-2"
                  size="16"
                />
                Set Reminder
              </PrimeButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Recommended for you section -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 0.5 } }"
        class="mt-12 text-center"
      >
        <h3 class="text-lg font-medium text-white mb-4 flex items-center justify-center gap-2">
          <Icon
            name="mdi:star"
            class="text-yellow-500"
            size="20"
          />
          <span
            >Recommended for
            {{ props.activePersona.charAt(0).toUpperCase() + props.activePersona.slice(1) }}</span
          >
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div
            v-for="event in events.filter((e) => e.bestFor === props.activePersona).slice(0, 3)"
            :key="`rec-${event.id}`"
            class="bg-slate-900/40 backdrop-blur-sm rounded-lg border border-slate-800/50 p-4 hover:border-primary-800/30 transition-all duration-300 cursor-pointer"
            @click="selectEvent(event.id)"
          >
            <div class="flex items-center gap-3 mb-2">
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center"
                :class="`bg-${event.color}-900/50 text-${event.color}-500`"
              >
                <Icon
                  :name="event.icon"
                  size="16"
                />
              </div>
              <div class="text-left">
                <h4 class="font-medium text-white text-sm">{{ event.name }}</h4>
                <p class="text-xs text-gray-400">{{ new Date(event.date).toLocaleDateString() }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.countdown-unit {
  position: relative;
  overflow: hidden;
  transform: translateZ(0);
}

.countdown-unit::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to right, transparent, rgba(99, 102, 241, 0.1), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.countdown-unit:hover::after {
  transform: translateX(100%);
}
</style>
