<script setup lang="ts">
import { ref } from 'vue'
import { useCalendarLink } from '~/composables/useCalendarLink'
import { useAnalytics } from '#imports'

// Import analytics tracking from analytics composable
const { trackUserEngagement, UserEngagementMetric } = useAnalytics()

// Import calendar link utilities
const { generateAstronomyEventLinks, openCalendarLink } = useCalendarLink()

// Props for the component
const props = defineProps<{
  eventName: string
  eventDate: Date
  eventDescription?: string
  eventId: number
  variant?: 'standard' | 'mini' | 'icon' // Different display variants
  inline?: boolean // Display buttons in a row instead of dropdown
  duration?: number // Event duration in minutes (default: 120 min / 2 hours)
}>()

// Generate calendar links
const calendarLinks = generateAstronomyEventLinks(
  props.eventName,
  props.eventDate,
  props.eventDescription,
  props.duration || 120,
)

// Track calendar link clicks
const trackCalendarAdd = (calendarType: string) => {
  trackUserEngagement(UserEngagementMetric.FeatureAdoption, {
    feature: 'calendar_add',
    event_id: props.eventId,
    event_name: props.eventName,
    calendar_type: calendarType,
  })
}

// Add to specific calendar
const addToCalendar = (calendarType: string) => {
  openCalendarLink(calendarType, calendarLinks)
  trackCalendarAdd(calendarType)
  isDropdownOpen.value = false
}

// Dropdown state for standard variant
const isDropdownOpen = ref(false)
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

// Close dropdown when clicking outside
const dropdownRef = ref<HTMLElement | null>(null)
onClickOutside(dropdownRef, () => {
  isDropdownOpen.value = false
})
</script>

<template>
  <!-- Inline buttons (for mini and icon variants) -->
  <div
    v-if="inline || variant === 'mini' || variant === 'icon'"
    class="flex space-x-2"
  >
    <!-- Google Calendar -->
    <button
      class="inline-flex items-center justify-center transition-colors duration-300 rounded-md"
      :class="[
        variant === 'icon'
          ? 'w-8 h-8 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300'
          : 'px-2 py-1 text-xs bg-slate-800/50 hover:bg-slate-700/50 text-slate-300',
      ]"
      aria-label="Add to Google Calendar"
      @click="addToCalendar('google')"
    >
      <Icon
        v-if="variant === 'icon'"
        name="mdi:google"
        size="16"
      />
      <template v-else>
        <Icon
          name="mdi:google"
          size="14"
          class="mr-1"
        />
        <span>Google</span>
      </template>
    </button>

    <!-- Apple Calendar -->
    <button
      class="inline-flex items-center justify-center transition-colors duration-300 rounded-md"
      :class="[
        variant === 'icon'
          ? 'w-8 h-8 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300'
          : 'px-2 py-1 text-xs bg-slate-800/50 hover:bg-slate-700/50 text-slate-300',
      ]"
      aria-label="Add to Apple Calendar"
      @click="addToCalendar('apple')"
    >
      <Icon
        v-if="variant === 'icon'"
        name="mdi:apple"
        size="16"
      />
      <template v-else>
        <Icon
          name="mdi:apple"
          size="14"
          class="mr-1"
        />
        <span>Apple</span>
      </template>
    </button>

    <!-- Outlook Calendar -->
    <button
      class="inline-flex items-center justify-center transition-colors duration-300 rounded-md"
      :class="[
        variant === 'icon'
          ? 'w-8 h-8 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300'
          : 'px-2 py-1 text-xs bg-slate-800/50 hover:bg-slate-700/50 text-slate-300',
      ]"
      aria-label="Add to Outlook Calendar"
      @click="addToCalendar('outlook')"
    >
      <Icon
        v-if="variant === 'icon'"
        name="mdi:microsoft-outlook"
        size="16"
      />
      <template v-else>
        <Icon
          name="mdi:microsoft-outlook"
          size="14"
          class="mr-1"
        />
        <span>Outlook</span>
      </template>
    </button>
  </div>

  <!-- Dropdown (for standard variant) -->
  <div
    v-else
    ref="dropdownRef"
    class="relative inline-block text-left"
  >
    <!-- Dropdown button -->
    <button
      type="button"
      class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors duration-300"
      @click="toggleDropdown"
    >
      <Icon
        name="mdi:calendar-plus"
        size="18"
        class="mr-2"
      />
      Add to Calendar
      <Icon
        name="mdi:chevron-down"
        size="18"
        class="ml-2 transition-transform duration-200"
        :class="isDropdownOpen ? 'rotate-180' : ''"
      />
    </button>

    <!-- Dropdown menu -->
    <div
      v-if="isDropdownOpen"
      class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-slate-800 shadow-lg ring-1 ring-slate-700 focus:outline-none"
    >
      <div class="py-1">
        <!-- Google Calendar -->
        <a
          href="#"
          class="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white"
          @click.prevent="addToCalendar('google')"
        >
          <Icon
            name="mdi:google"
            size="18"
            class="mr-3 text-gray-400"
          />
          Google Calendar
        </a>

        <!-- Apple Calendar -->
        <a
          href="#"
          class="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white"
          @click.prevent="addToCalendar('apple')"
        >
          <Icon
            name="mdi:apple"
            size="18"
            class="mr-3 text-gray-400"
          />
          Apple Calendar
        </a>

        <!-- Outlook Calendar -->
        <a
          href="#"
          class="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white"
          @click.prevent="addToCalendar('outlook')"
        >
          <Icon
            name="mdi:microsoft-outlook"
            size="18"
            class="mr-3 text-gray-400"
          />
          Outlook Calendar
        </a>
      </div>
    </div>
  </div>
</template>
