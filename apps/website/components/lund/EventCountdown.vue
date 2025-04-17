<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { usePersona } from '~/composables/usePersona'
import { useAnimation } from '~/composables/useAnimation'
import { useEvents } from '~/composables/useEvents'
import { useAnalytics } from '#imports'
import AddToCalendarButton from '~/components/AddToCalendarButton.vue'
import SetReminderButton from '~/components/SetReminderButton.vue'
import CountdownTimer from '~/components/CountdownTimer.vue'

const { conf: motionConstants } = useAnimation()
const { trackUserEngagement, UserEngagementMetric } = useAnalytics()

// Get persona state from our composable
const { activePersona, personaStyles, isResearcher, isCommunicator, isEnthusiast } = usePersona()

// Get events from our composable
const {
  allEvents,
  events,
  relevantEvents,
  getEventById,
  formatEventDate,
  formatShortDate,
  getInitialEvent,
} = useEvents()

// Active event state
const activeEvent = ref(getInitialEvent()!)

// Update active event when persona changes
watch(
  () => activePersona.value,
  () => {
    activeEvent.value = getInitialEvent()!
  },
  { deep: true },
)

// Handle expired countdown
const handleExpired = () => {
  // Find the next event
  const now = new Date().getTime()
  const futureEvents = relevantEvents.value.filter((event) => event.date.getTime() > now)

  if (futureEvents.length > 0) {
    activeEvent.value = futureEvents[0]!
  }
}

// Select a specific event
const selectEvent = (eventId: number) => {
  const event = getEventById(eventId)
  if (!event) return

  activeEvent.value = event

  // Track the interaction
  trackUserEngagement(UserEngagementMetric.FeatureAdoption, {
    feature: 'event_countdown',
    event_id: eventId,
    event_name: event.name,
    persona: activePersona.value.name,
  })
}

// Track when users click "View Full Calendar"
const trackViewFullCalendar = () => {
  trackUserEngagement(UserEngagementMetric.ActionsPerSession, {
    action: 'view_full_calendar',
    persona: activePersona.value.name,
  })
}
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
      </div>

      <!-- Recommended persona-specific events -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 0.2 } }"
        class="mb-12"
      >
        <h3 class="text-xl font-semibold text-white mb-6 flex items-center gap-2 justify-center">
          <Icon
            :name="activePersona.iconName || 'mdi:star'"
            :class="`text-${activePersona.color}-500`"
            size="22"
          />
          <span>Recommended for {{ activePersona.name }}</span>
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto">
          <div
            v-for="event in relevantEvents"
            :key="`rec-${event.id}`"
            class="bg-slate-900/40 backdrop-blur-sm rounded-lg border border-slate-800/50 p-5 transition-all duration-300 cursor-pointer hover:transform hover:scale-[1.02]"
            :class="[
              activeEvent.id === event.id
                ? `border-${activePersona.color}-700/50 shadow-lg shadow-${activePersona.color}-900/20`
                : `hover:border-${activePersona.color}-800/30`,
            ]"
            @click="selectEvent(event.id)"
          >
            <div class="flex items-center gap-3 mb-3">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500"
                :class="`bg-${activePersona.color}-900/50 text-${activePersona.color}-500`"
              >
                <Icon
                  :name="event.icon"
                  size="20"
                />
              </div>
              <div class="text-left">
                <h4 class="font-medium text-white">{{ event.name }}</h4>
                <div class="flex items-center text-xs text-gray-400 mt-1">
                  <Icon
                    name="mdi:calendar"
                    size="14"
                    class="mr-1"
                  />
                  <span>{{ formatShortDate(event.date) }}</span>
                </div>
              </div>
            </div>
            <div
              class="text-sm text-gray-400 mt-2 line-clamp-2"
              :class="activeEvent.id === event.id ? 'text-gray-300' : ''"
            >
              {{ event.description.substring(0, 75) }}...
            </div>
            <div class="mt-3">
              <span
                class="px-2 py-1 rounded-full text-xs inline-flex items-center gap-1 transition-colors duration-500"
                :class="`bg-${activePersona.color}-900/30 text-${activePersona.color}-400 border border-${activePersona.color}-800/30`"
              >
                <Icon
                  :name="event.icon"
                  size="12"
                />
                {{ event.type }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Countdown display -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visibleOnce="{ opacity: 1, y: 0, transition: { delay: 0.3 } }"
        class="mx-auto"
      >
        <div
          class="rounded-xl bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 overflow-hidden transition-all duration-500"
          :class="`border-${activePersona.color}-800/30 shadow-xl shadow-${activePersona.color}-900/10`"
        >
          <!-- Event header -->
          <div
            class="px-6 py-4 border-b border-slate-800/30 flex items-center justify-between transition-colors duration-500"
            :class="`bg-${activePersona.color}-900/20`"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500"
                :class="`bg-${activePersona.color}-600/30 text-${activePersona.color}-400`"
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
                :class="`bg-${activePersona.color}-900/30 text-${activePersona.color}-400 border border-${activePersona.color}-800/30`"
              >
                {{ activeEvent.type }}
              </span>
            </div>
          </div>

          <!-- Countdown display -->
          <div class="p-8">
            <p class="text-gray-300 mb-6">{{ activeEvent.description }}</p>

            <div class="mb-8">
              <CountdownTimer
                :target-date="activeEvent.date"
                :color="activePersona.color"
                @expired="handleExpired"
              />
            </div>

            <!-- Add to calendar options -->
            <div
              class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div>
                <span class="text-sm text-gray-400">Add to your calendar:</span>
                <div class="mt-2">
                  <AddToCalendarButton
                    :event-name="activeEvent.name"
                    :event-date="activeEvent.date"
                    :event-description="activeEvent.description"
                    :event-id="activeEvent.id"
                    variant="mini"
                    inline
                  />
                </div>
              </div>

              <!-- Reminder button -->
              <SetReminderButton
                :event-name="activeEvent.name"
                :event-date="activeEvent.date"
                :event-id="activeEvent.id"
                variant="outlined"
                @reminder-set="
                  (data) => {
                    // Handle reminder set event if needed
                    console.log('Reminder set:', data)
                  }
                "
              />
            </div>
          </div>
        </div>
      </div>

      <!-- View Full Calendar button at the bottom -->
      <div class="text-center mt-12">
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
    </div>
  </section>
</template>
