<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue'
import { usePersona } from '~/composables/usePersona'
import { useAnimation } from '~/composables/useAnimation'
import { useAnalytics } from '#imports'

const { conf: motionConstants } = useAnimation()
const { trackUserEngagement, UserEngagementMetric } = useAnalytics()

// Get persona state from our composable
const { activePersona, personaStyles, isResearcher, isCommunicator, isEnthusiast } = usePersona()

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
    bestFor: 'communicator',
  },
  {
    id: 2,
    name: 'Partial Solar Eclipse',
    date: new Date('2025-03-29T09:00:00'),
    description: 'Visible from North America and parts of Europe',
    type: 'eclipse',
    color: 'amber',
    icon: 'mdi:weather-night',
    bestFor: 'enthusiast',
  },
  {
    id: 3,
    name: 'SpaceX Starship Launch',
    date: new Date('2025-03-15T14:30:00'),
    description: 'Next orbital test flight from Boca Chica, Texas',
    type: 'launch',
    color: 'blue',
    icon: 'mdi:rocket-launch',
    bestFor: 'enthusiast',
  },
  {
    id: 4,
    name: 'International Astronomy Conference',
    date: new Date('2025-05-10T09:00:00'),
    description: 'Annual gathering of astronomy researcher from around the world',
    type: 'conference',
    color: 'indigo',
    icon: 'mdi:account-group',
    bestFor: 'researcher',
  },
  {
    id: 5,
    name: 'NASA Data Workshop',
    date: new Date('2025-04-05T10:00:00'),
    description: 'Learn how to use NASA open data for research and analysis',
    type: 'workshop',
    color: 'primary',
    icon: 'mdi:database',
    bestFor: 'researcher',
  },
]

// Filter events and sort by date
const events = computed(() => {
  return [...allEvents].sort((a, b) => a.date.getTime() - b.date.getTime())
})

// Select active event based on persona
const getInitialEvent = () => {
  const personaName = activePersona.value.name
  const personaEvent = events.value.find((event) => event.bestFor === personaName)
  if (personaEvent) return personaEvent

  const now = new Date().getTime()
  const futureEvents = events.value.filter((event) => event.date.getTime() > now)

  if (futureEvents.length > 0) {
    return futureEvents[0]
  }

  return events.value[0]
}

// Active event state
const activeEvent = ref(getInitialEvent())

// Update active event when persona changes
watch(
  () => activePersona.value,
  () => {
    activeEvent.value = getInitialEvent()
    initializeCountdown(activeEvent.value.date)
  },
  { deep: true },
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
    persona: activePersona.value.name,
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
    persona: activePersona.value.name,
  })
}

// Get events relevant to current persona
const relevantEvents = computed(() => {
  const personaName = activePersona.value.name.toLowerCase()
  return events.value.filter((e) => e.bestFor === personaName).slice(0, 3)
})

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
    <!-- Background with persona-specific gradient -->
    <div
      class="absolute inset-0 bg-gradient-to-b from-slate-950 to-primary-950/70 z-0 transition-colors duration-700"
    ></div>

    <!-- Glow effects -->
    <div
      class="absolute left-0 top-1/3 w-64 h-64 rounded-full blur-3xl transition-colors duration-700"
      :class="`bg-${activePersona.color}-600/5`"
    ></div>
    <div
      class="absolute right-0 bottom-1/3 w-64 h-64 rounded-full blur-3xl transition-colors duration-700"
      :class="`bg-${activePersona.color}-600/5`"
    ></div>

    <div class="wrapper relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section header -->
      <div
        v-motion="motionConstants.sectionTitle"
        class="text-center max-w-3xl mx-auto mb-8"
      >
        <h2 class="text-3xl md:text-5xl font-bold mb-4 text-white leading-tight">
          Next
          <span
            :class="personaStyles.sectionHeading"
            class="transition-colors duration-500"
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
          :class="personaStyles.primaryButton"
          class="transition-colors duration-500 shadow-lg"
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
          class="rounded-xl bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 overflow-hidden transition-all duration-500"
          :class="`border-${activeEvent.color}-800/30 shadow-xl shadow-${activeEvent.color}-900/10`"
        >
          <!-- Event header -->
          <div
            class="px-6 py-4 border-b border-slate-800/30 flex items-center justify-between transition-colors duration-500"
            :class="`bg-${activeEvent.color}-900/20`"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500"
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
                class="px-3 py-1 rounded-full text-sm transition-colors duration-500"
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
                  class="absolute inset-0 opacity-20 transition-colors duration-500"
                  :class="`bg-${activeEvent.color}-900/20`"
                ></div>

                <div
                  class="text-5xl font-bold mb-1 relative z-10 transition-colors duration-500"
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
                    class="px-3 py-1.5 rounded text-xs transition-colors duration-500 flex items-center gap-1"
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
                class="transition-colors duration-500"
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
          <span>Recommended for {{ activePersona.name }}</span>
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div
            v-for="event in relevantEvents"
            :key="`rec-${event.id}`"
            class="bg-slate-900/40 backdrop-blur-sm rounded-lg border border-slate-800/50 p-4 hover:border-primary-800/30 transition-all duration-300 cursor-pointer"
            @click="selectEvent(event.id)"
          >
            <div class="flex items-center gap-3 mb-2">
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-500"
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
