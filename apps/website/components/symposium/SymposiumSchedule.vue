<script setup lang="ts">
// 1. Imports

// 2. Component Options
defineOptions({
  name: 'SymposiumSchedule',
})

// 3. Computed Properties
const timezone = computed(() => Intl.DateTimeFormat().resolvedOptions().timeZone)

// 4. Component state
const schedule = [
  {
    slot: 'saturday',
    value: '0',
    label: 'Saturday',
    day: 1,
    month: 'March',
    year: 2025,
    items: [
      {
        online: true,
        icon: 'mdi:microphone',
        topic: 'Welcome Address',
        speaker: 'Ruchira Huchgol',
        time: { start: '11:00', end: '11:05' },
        class: 'bg-primary-950',
      },
      {
        online: true,
        icon: 'mdi:microphone',
        topic: 'Introduction',
        speaker: 'Shweta Kulkarni',
        time: { start: '11:05', end: '11:10' },
        class: 'bg-primary-950',
      },
      {
        online: true,
        icon: 'mdi:microphone',
        topic: 'Impacts of light pollution and efforts towards Dark Sky Policy',
        speaker: 'Dan Oakley',
        time: { start: '11:10', end: '11:30' },
      },
      {
        online: true,
        icon: 'mdi:microphone',
        topic: 'Growing Trend on Regulating Light Pollution',
        speaker: 'Yana Yakushina',
        time: { start: '11:30', end: '11:50' },
      },
      {
        online: true,
        icon: 'mdi:microphone',
        topic: 'Dark Sky Policies and the learnings from the adaptation in New Zealand',
        speaker: 'Nalayini Brito-Davies',
        time: { start: '11:50', end: '12:10' },
      },
      {
        online: true,
        icon: 'mdi:microphone',
        topic: 'Q&A',
        speaker: 'All Speakers',
        time: { start: '12:10', end: '12:30' },
        class: 'bg-primary-950',
      },
      {
        online: true,
        icon: 'mdi:microphone',
        topic: 'Closing Session',
        speaker: 'AstronEra Team',
        time: { start: '12:30', end: '12:35' },
      },
    ],
  },
]

// 5. Methods
function convertISTtoLocal(day: number, time: { start: string; end: string }) {
  const start = `2025-03-${day}T${time.start}:00+05:30` // '+05:30' is the offset for IST
  const end = `2025-03-${day}T${time.end}:00+05:30` // '+05:30' is the offset for IST

  // Creating Date objects
  const startIST = new Date(start)
  const endIST = new Date(end)

  // Converting to local time strings
  const startLocal = startIST.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  const endLocal = endIST.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  return `${startLocal} - ${endLocal}`
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-primary-400 mb-6">Symposium Schedule</h2>

    <div class="bg-primary-800/30 rounded-lg p-6 backdrop-blur-sm border border-primary-700/30">
      <div class="mb-4 flex items-center gap-4">
        <div class="bg-primary-900/60 p-3 rounded-full">
          <Icon
            name="mdi:calendar-clock"
            class="text-primary-400"
            size="24px"
          />
        </div>
        <div>
          <h3 class="text-lg font-semibold">Saturday, 1st March 2025</h3>
          <p class="text-sm text-gray-400">11:00 - 12:35 IST ({{ timezone }})</p>
        </div>
      </div>

      <!-- Schedule Timeline -->
      <div class="relative overflow-x-auto">
        <table class="w-full text-left">
          <thead class="text-xs uppercase bg-primary-900/60">
            <tr>
              <th class="px-4 py-3 font-medium text-primary-300 w-1/5">Time</th>
              <th class="px-4 py-3 font-medium text-primary-300 w-1/4">Speaker</th>
              <th class="px-4 py-3 font-medium text-primary-300 w-3/5">Topic</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in schedule[0].items"
              :key="index"
              class="border-b border-primary-800/30 hover:bg-primary-800/20 transition-colors"
            >
              <td class="px-4 py-3 text-sm">
                <div class="flex items-center gap-2">
                  <Icon
                    :name="item.icon"
                    class="text-primary-400"
                    size="18px"
                  />
                  {{ convertISTtoLocal(schedule[0].day, item.time) }}
                </div>
              </td>
              <td class="px-4 py-3 text-sm">
                <div class="flex items-center gap-2">
                  <div
                    v-if="item.online"
                    class="h-2 w-2 rounded-full bg-emerald-500"
                    title="Online Speaker"
                  ></div>
                  <span class="font-medium">{{ item.speaker }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-sm">{{ item.topic }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Legend -->
      <div class="mt-6 bg-primary-900/30 rounded p-3 text-sm">
        <div class="flex items-center gap-2">
          <div class="h-2 w-2 rounded-full bg-emerald-500"></div>
          <span>Online speakers</span>
        </div>
      </div>
    </div>

    <!-- Additional Information -->
    <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-primary-800/30 rounded-lg p-6 backdrop-blur-sm border border-primary-700/30">
        <h3 class="text-lg font-semibold text-primary-300 mb-4 flex items-center gap-2">
          <Icon
            name="mdi:information-outline"
            size="20px"
          />
          Timezone Information
        </h3>
        <p class="text-sm text-gray-300">
          The symposium schedule is displayed in your local timezone ({{ timezone }}). All speakers
          will connect at the scheduled time, which is 11:00-12:35 IST (Indian Standard Time).
        </p>
      </div>

      <div class="bg-primary-800/30 rounded-lg p-6 backdrop-blur-sm border border-primary-700/30">
        <h3 class="text-lg font-semibold text-primary-300 mb-4 flex items-center gap-2">
          <Icon
            name="mdi:calendar-check"
            size="20px"
          />
          Add to Calendar
        </h3>
        <p class="text-sm text-gray-300 mb-4">
          Don't miss this important event! Add the symposium to your calendar using one of the
          options below.
        </p>
        <div class="flex gap-3">
          <PrimeButton
            outlined
            size="small"
            label="Google Calendar"
            icon="mdi:google"
            class="text-xs"
          />
          <PrimeButton
            outlined
            size="small"
            label="iCal"
            icon="mdi:calendar"
            class="text-xs"
          />
        </div>
      </div>
    </div>
  </div>
</template>
