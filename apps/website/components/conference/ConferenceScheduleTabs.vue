<script setup lang="ts">
// 1. Imports
import { ref, computed, onMounted } from 'vue'

// 2. Component Options
defineOptions({
  name: 'ConferenceScheduleTabs',
})

// 3. Methods
function convertISTtoLocal(day: number, time: { start: string; end: string }) {
  const start = `2023-11-${day}T${time.start}:00+05:30` // '+05:30' is the offset for IST
  const end = `2023-11-${day}T${time.end}:00+05:30` // '+05:30' is the offset for IST

  // Creating Date objects
  const startIST = new Date(start)
  const endIST = new Date(end)

  // Force lowercase for consistent rendering between server and client
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }

  const startLocal = startIST.toLocaleTimeString([], options).toLowerCase()
  const endLocal = endIST.toLocaleTimeString([], options).toLowerCase()

  return `${startLocal} - ${endLocal}`
}

// 4. Reactive Variables
const activeDay = ref(0)

// 5. Computed Properties
const timezone = computed(() => Intl.DateTimeFormat().resolvedOptions().timeZone)

// 6. Data
const schedule = [
  {
    slot: 'friday',
    value: 0,
    label: 'Friday',
    day: 24,
    items: [
      {
        icon: 'mdi:calendar-clock',
        topic: 'Registration at Manu Allaya',
        speaker: '',
        time: { start: '09:00', end: '11:00' },
        class: 'bg-primary-900/60',
        type: 'break',
      },
      {
        icon: 'material-symbols:breakfast-dining',
        topic: 'Complimentary Breakfast',
        speaker: '',
        time: { start: '09:00', end: '10:00' },
        class: 'bg-primary-900/60',
        type: 'meal',
      },
      {
        icon: 'material-symbols:line-end-arrow-rounded',
        topic: 'Opening Ceremony / Inauguration',
        speaker: 'Ruchira Huchgol',
        time: { start: '11:00', end: '11:20' },
        type: 'ceremony',
      },
      {
        online: true,
        icon: 'mdi:microphone',
        topic:
          'Climate Change & Clean Energy (C3E) Division, Department of Science and Technolohgy, Government of India',
        speaker: 'Dr. Anita Gupta',
        time: { start: '11:30', end: '12:00' },
        type: 'talk',
      },
      {
        online: true,
        icon: 'mdi:microphone',
        topic:
          'Astronomy and Satellite Constellations: Pathways Forward for Light Pollution from Space',
        speaker: 'Dr. Constance (Connie) Walker',
        time: { start: '12:00', end: '12:30' },
        type: 'talk',
      },
      {
        icon: 'mdi:silverware-fork-knife',
        topic: 'Complimentary Lunch + Check In',
        speaker: '',
        time: { start: '12:30', end: '13:30' },
        class: 'bg-primary-900/60',
        type: 'meal',
      },
      {
        icon: 'mdi:microphone',
        online: true,
        topic: 'Harnessing Dark Skies for Socioeconomic Development in Rural Areas',
        speaker: 'Samyukta Manikumar',
        time: { start: '13:30', end: '14:00' },
        type: 'talk',
      },
      {
        icon: 'material-symbols:group-work',
        topic: 'Round Table Activity',
        speaker: 'Ruchira Huchgol',
        time: { start: '14:00', end: '14:30' },
        type: 'activity',
      },
      {
        online: false,
        icon: 'mdi:microphone',
        topic: 'Intruders in the Dark Sky: The Megaconstellation Crisis',
        speaker: 'Upasana Dasgupta',
        time: { start: '14:30', end: '15:00' },
        type: 'talk',
      },
      {
        icon: 'material-symbols:group-work',
        topic: 'Round Table Activity',
        speaker: 'Ruchira Huchgol',
        time: { start: '15:00', end: '15:30' },
        type: 'activity',
      },
      {
        online: true,
        icon: 'mdi:microphone',
        topic: "Astronomy's Impact on Sustainability",
        speaker: 'María Alejandra Díaz Teodori',
        time: { start: '15:30', end: '16:00' },
        type: 'talk',
      },
      {
        icon: 'mdi:coffee',
        topic: 'Complimentary Tea',
        speaker: '',
        time: { start: '16:00', end: '16:30' },
        class: 'bg-primary-900/60',
        type: 'break',
      },
      {
        icon: 'mdi:microphone',
        online: false,
        topic: 'Mental Health, Arts and Astronomy',
        speaker: 'Aishwarya Khade',
        time: { start: '16:30', end: '17:00' },
        type: 'talk',
      },
      {
        online: false,
        icon: 'material-symbols:group-work',
        topic: 'Workshop',
        speaker: 'Aishwarya Khade',
        time: { start: '17:00', end: '18:00' },
        type: 'activity',
      },
      {
        online: false,
        icon: 'material-symbols:line-end-circle',
        topic: 'Closing remarks',
        speaker: 'Ruchira Huchgol',
        time: { start: '18:00', end: '18:10' },
        type: 'ceremony',
      },
      {
        icon: 'material-symbols:alarm-add',
        topic: 'Free Time',
        speaker: '',
        time: { start: '18:10', end: '19:00' },
        class: 'bg-primary-900/60',
        type: 'break',
      },
      {
        icon: 'material-symbols:dark-mode',
        topic: 'Stargazing (Optional)',
        speaker: '',
        time: { start: '19:00', end: '21:30' },
        class: 'bg-primary-900/60',
        type: 'activity',
      },
      {
        icon: 'material-symbols:celebration',
        topic: 'AstronEra 5 Year Celebration',
        speaker: '',
        time: { start: '19:00', end: '21:30' },
        class: 'bg-primary-900/60',
        type: 'celebration',
      },
      {
        icon: 'mdi:silverware-fork-knife',
        topic: 'Complimentary Dinner',
        speaker: '',
        time: { start: '20:30', end: '22:00' },
        class: 'bg-primary-900/60',
        type: 'meal',
      },
    ],
  },
  {
    slot: 'saturday',
    label: 'Saturday',
    value: 1,
    day: 25,
    items: [
      {
        icon: 'material-symbols:breakfast-dining',
        topic: 'Complimentary Breakfast',
        speaker: '',
        time: { start: '09:00', end: '10:00' },
        class: 'bg-primary-900/60',
        type: 'meal',
      },
      {
        icon: 'material-symbols:line-end-arrow-rounded',
        topic: 'Opening Remarks',
        speaker: 'Ruchira Huchgol',
        online: false,
        time: { start: '10:00', end: '10:20' },
        type: 'ceremony',
      },
      {
        online: false,
        icon: 'mdi:microphone',
        topic: 'Sustainable Development through Astronomy: A Tribal Perspective',
        speaker: 'Dr. Kiran Kulkarni',
        time: { start: '10:20', end: '11:00' },
        type: 'talk',
      },
      {
        online: false,
        icon: 'mdi:microphone',
        topic: 'The planetarium as a creative space',
        speaker: 'David Ault',
        time: { start: '11:00', end: '11:30' },
        type: 'talk',
      },
      {
        online: false,
        icon: 'mdi:microphone',
        topic: 'Indian successors to the Indian Gamma-Ray Observatory(IGRO) Mission',
        speaker: 'Bhakti Shashikant Mithagri',
        time: { start: '11:30', end: '12:00' },
        type: 'talk',
      },
      {
        online: false,
        icon: 'mdi:microphone',
        topic: 'The ancient science of space and agriculture for sustainability and harmony',
        speaker: 'Amshu CR',
        time: { start: '12:00', end: '12:30' },
        type: 'talk',
      },
      {
        online: true,
        icon: 'mdi:microphone',
        topic: 'ASTROx Dark Sky: How to Integrate Astronomy Education into Interactive Classroom',
        speaker: 'Exodus Chun-Long Sit',
        time: { start: '12:30', end: '13:00' },
        type: 'talk',
      },
      {
        icon: 'mdi:silverware-fork-knife',
        topic: 'Complimentary Lunch',
        speaker: '',
        time: { start: '13:00', end: '14:00' },
        class: 'bg-primary-900/60',
        type: 'meal',
      },
    ],
  },
  {
    slot: 'sunday',
    label: 'Sunday',
    value: 2,
    day: 26,
    items: [
      {
        icon: 'material-symbols:breakfast-dining',
        topic: 'Complimentary Breakfast',
        speaker: '',
        time: { start: '08:30', end: '09:30' },
        class: 'bg-primary-900/60',
        type: 'meal',
      },
      {
        online: false,
        icon: 'material-symbols:line-end-arrow-rounded',
        topic: 'Opening Remarks',
        speaker: 'Ruchira Huchgol',
        time: { start: '09:30', end: '09:40' },
        type: 'ceremony',
      },
      {
        online: false,
        icon: 'mdi:microphone',
        topic: 'Skill Training in Astronomy for Income Generation',
        speaker: 'Shweta Kulkarni',
        time: { start: '09:40', end: '10:00' },
        type: 'talk',
      },
      {
        online: false,
        icon: 'mdi:microphone',
        topic: 'Sustainable Development for Tribal Ladakhies through Astronomy',
        speaker: 'Sonam Wangchuk',
        time: { start: '10:00', end: '10:30' },
        type: 'talk',
      },
      {
        online: true,
        icon: 'mdi:microphone',
        topic: 'Dark Skies and Bright Satellites',
        speaker: 'Dr. Priya Hasan',
        time: { start: '10:30', end: '11:00' },
        type: 'talk',
      },
    ],
  },
]

// Helper function to get icon by event type
function getIconByType(item) {
  // Use provided icon if available
  if (item.icon) return item.icon

  // Otherwise fallback based on type
  switch (item.type) {
    case 'talk':
      return 'mdi:microphone'
    case 'meal':
      return 'mdi:silverware-fork-knife'
    case 'break':
      return 'mdi:coffee'
    case 'activity':
      return 'material-symbols:group-work'
    case 'ceremony':
      return 'material-symbols:line-end-arrow-rounded'
    case 'celebration':
      return 'material-symbols:celebration'
    default:
      return 'mdi:calendar-clock'
  }
}

// Helper function to get color class by event type
function getColorClassByType(item) {
  // If class is already specified, use it
  if (item.class) return item.class

  // Otherwise determine by type
  switch (item.type) {
    case 'talk':
      return 'bg-primary-800/40'
    case 'meal':
      return 'bg-primary-900/60'
    case 'break':
      return 'bg-primary-900/60'
    case 'activity':
      return 'bg-primary-700/40'
    case 'ceremony':
      return 'bg-primary-600/40'
    case 'celebration':
      return 'bg-primary-500/40'
    default:
      return 'bg-primary-800/40'
  }
}

// Function to handle printing the schedule
function printSchedule() {
  // Create a new window with all schedule days
  const printWindow = window.open('', '_blank')

  if (!printWindow) {
    alert('Please allow popups to print the schedule')
    return
  }

  // Start building HTML content
  let content = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Conference Schedule - Dark Sky Conservation India Conference</title>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .day-header { margin-top: 30px; padding-bottom: 10px; border-bottom: 2px solid #333; }
        .event { margin: 20px 0; padding: 10px; border-left: 4px solid #3f51b5; }
        .event-time { font-weight: bold; }
        .event-title { font-size: 18px; margin: 5px 0; }
        .event-speaker { color: #666; font-style: italic; }
        .online-badge { display: inline-block; padding: 2px 8px; background: #4caf50; color: white; border-radius: 10px; font-size: 12px; margin-left: 10px; }
        @media print {
          .day-header { break-before: page; }
          .no-break { break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <h1>Dark Sky Conservation India Conference</h1>
      <p>November 24-26, 2023</p>
  `

  // Add each day's schedule
  schedule.forEach((day) => {
    content += `
      <div class="day-header">
        <h2>${day.label}, November ${day.day}, 2023</h2>
      </div>
    `

    // Add each event for the day
    day.items.forEach((item) => {
      const startTime = new Date(`2023-11-${day.day}T${item.time.start}:00+05:30`)
      const endTime = new Date(`2023-11-${day.day}T${item.time.end}:00+05:30`)

      const timeStr = `${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                        ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`

      content += `
        <div class="event no-break">
          <div class="event-time">${timeStr}</div>
          <div class="event-title">${item.topic}</div>
          ${item.speaker ? `<div class="event-speaker">Speaker: ${item.speaker} ${item.online ? '<span class="online-badge">Online</span>' : ''}</div>` : ''}
        </div>
      `
    })
  })

  content += `
    </body>
    </html>
  `

  // Write to the new window and print
  printWindow.document.open()
  printWindow.document.write(content)
  printWindow.document.close()

  // Wait for content to load before printing
  setTimeout(() => {
    printWindow.print()
  }, 500)
}

// Initialize the component with proper tab selection
onMounted(() => {
  // Ensure the first tab is selected by default
  activeDay.value = 0
})
</script>

<template>
  <div class="schedule-container">
    <CommonTitle
      :title="{
        main: 'Conference Schedule',
      }"
    />

    <!-- Day selection tabs styled to match the website design -->
    <div class="mb-6 border-b border-primary-700/30">
      <div class="flex overflow-x-auto no-scrollbar">
        <button
          v-for="day in schedule"
          :key="day.value"
          class="tab-button px-6 py-3 font-medium text-sm sm:text-base transition-all duration-200"
          :class="[
            activeDay === day.value
              ? 'text-primary-400 border-b-2 border-primary-400'
              : 'text-gray-400 hover:text-primary-300 hover:border-b-2 hover:border-primary-300/50',
          ]"
          @click="activeDay = day.value"
        >
          {{ day.label }} {{ day.day }}th Nov
        </button>
      </div>
    </div>

    <!-- Day content with timezone info -->
    <template v-for="day in schedule">
      <div
        v-if="activeDay === day.value"
        :key="`day-${day.value}`"
        class="schedule-day-content animate-fadeIn"
      >
        <div
          class="bg-primary-900/30 backdrop-blur-sm p-4 rounded-lg mb-6 flex flex-wrap justify-between items-center"
        >
          <div>
            <h3 class="text-xl font-bold text-primary-300"
              >{{ day.label }}, November {{ day.day }}, 2023</h3
            >
            <p class="text-sm text-gray-400"
              >All times shown in your local timezone: {{ timezone }}</p
            >
          </div>

          <div class="mt-2 sm:mt-0">
            <PrimeButton
              severity="secondary"
              outlined
              size="small"
              class="text-xs"
              @click="printSchedule"
            >
              <Icon
                name="mdi:printer"
                class="mr-1"
              />
              Print Schedule
            </PrimeButton>
          </div>
        </div>

        <!-- Timeline events list -->
        <div class="schedule-timeline relative">
          <!-- Timeline events list -->
          <div
            v-for="(item, index) in day.items"
            :key="`item-${index}`"
            class="schedule-item"
            :class="getColorClassByType(item)"
          >
            <!-- Timeline connector (proper vertical line) -->
            <div
              v-if="index < day.items.length - 1"
              class="timeline-connector"
            ></div>

            <!-- Left column with time and dot -->
            <div class="time-column">
              <div class="time-dot"></div>
              <div class="time-text">{{ convertISTtoLocal(day.day, item.time) }}</div>
            </div>

            <!-- Right column with event details -->
            <div class="event-column">
              <div class="event-card">
                <!-- Icon and header section -->
                <div class="flex items-start gap-3">
                  <div class="icon-container">
                    <Icon
                      :name="getIconByType(item)"
                      size="24px"
                      class="text-primary-400"
                    />
                  </div>

                  <div class="flex-1">
                    <!-- Title -->
                    <h4 class="text-lg font-semibold text-white mb-1">
                      {{ item.topic }}
                    </h4>

                    <!-- Speaker info with online indicator -->
                    <div
                      v-if="item.speaker"
                      class="flex items-center gap-2 mt-2"
                    >
                      <div
                        v-if="item.online"
                        class="inline-flex items-center gap-1"
                      >
                        <span class="h-2 w-2 rounded-full bg-green-500"></span>
                        <span class="text-xs text-green-400">Online</span>
                      </div>
                      <span class="text-sm text-primary-300">
                        <Icon
                          name="mdi:account"
                          class="inline-block mr-1"
                        />
                        {{ item.speaker }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.schedule-timeline {
  @apply mt-6 pl-0;
  position: relative;
}

.schedule-item {
  @apply relative flex items-start transition-all duration-300 p-2 rounded-lg mb-6;
  z-index: 1;
}

/* Time column (left side) - Fixed width to prevent wrapping */
.time-column {
  @apply flex flex-col items-center relative;
  width: 120px;
  flex-shrink: 0;
}

.time-dot {
  @apply w-4 h-4 rounded-full bg-primary-600 border-2 border-primary-300;
  z-index: 5;
}

.time-text {
  @apply mt-3 text-gray-300 font-medium text-center;
  font-size: 0.75rem;
  line-height: 1.1;
  width: 80px; /* Fixed width to prevent wrapping */
}

/* Event column (right side) */
.event-column {
  @apply flex-1;
}

.event-card {
  @apply p-4 backdrop-blur-sm rounded-lg border border-primary-700/30 transition-all duration-200 hover:border-primary-500/50;
}

.icon-container {
  @apply p-2 rounded-lg bg-primary-900/70 flex items-center justify-center flex-shrink-0;
}

/* Timeline connector - vertical line */
.timeline-connector {
  @apply absolute bg-primary-700/50 top-0 left-12 bottom-0;
  width: 2px;
  height: calc(100% + 24px); /* Match mb-6 value */
  z-index: 0;
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
