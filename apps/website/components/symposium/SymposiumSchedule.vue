<script setup lang="ts">
function convertISTtoLocal(day: number, time: { start: string; end: string }) {
  const start = `2025-03-01T${time.start}:00+05:30` // '+05:30' is the offset for IST
  const end = `2025-03-01T${time.end}:00+05:30` // '+05:30' is the offset for IST

  // Creating a Date object
  const startIST = new Date(start)
  const endIST = new Date(end)

  // Converting to local time string
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

const timezone = computed(() => Intl.DateTimeFormat().resolvedOptions().timeZone)

const schedule = [
  {
    slot: 'saturday',
    value: '0',
    label: 'Saturday',
    day: 1,
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
        topic: 'Dark Sky Policies Global Impact',
        speaker: 'Yana Yakushina',
        time: { start: '11:30', end: '11:50' },
      },
      {
        online: true,
        icon: 'mdi:microphone',
        topic: 'Dark Sky Policies and the learnings from the adaptation in New Zealand',
        speaker: 'Nalayini  Brito-Davies ',
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
</script>

<template>
  <div class="w-full">
    <CommonTitle
      :title="{
        main: 'Conference Schedule',
      }"
    />
    <PrimeTabs
      value="0"
      select-on-focus
    >
      <PrimeTabList pt:tablist:class="flex gap-4 pl-4 pb-4 text-lg">
        <PrimeTab
          v-for="(day, i) in schedule"
          :key="`tab-${i}`"
          :value="`${day.value}`"
        >
          <span>
            {{ `${day.label} ${day.day}th March 2025` }}
          </span>
        </PrimeTab>
      </PrimeTabList>
      <PrimeTabPanels>
        <PrimeTabPanel
          v-for="(day, i) in schedule"
          :key="`tab-${i}`"
          :value="`${i}`"
        >
          <div class="border-color rounded-md border">
            <PrimeDataTable
              :value="day.items"
              :pt="{
                header: ({ props }) => ({
                  cell: 'bg-red-500',
                }),
                thead: ({ context }) => ({
                  class: 'bg-primary-800',
                }),
                bodyrow: ({ props }) => ({
                  class: 'odd:bg-gray-950 even:bg-gray-900',
                }),
              }"
              :pt-options="{ mergeSections: true, mergeProps: true }"
            >
              <PrimeColumn
                style="width: 20%"
                field="time"
                :header="`Time ${timezone}`"
              >
                <template #body="{ data }">
                  <span class="flex items-center gap-2 text-sm">
                    <Icon
                      :name="data.icon"
                      size="24px"
                    />

                    {{ convertISTtoLocal(day.day, data.time) }}
                  </span>
                </template>
              </PrimeColumn>
              <PrimeColumn
                style="width: 35%"
                field="speaker"
                header="Speaker"
              >
                <template #body="slotProps">
                  <span class="flex items-center text-sm leading-none">
                    <div
                      v-if="slotProps.data.online"
                      class="mr-1 h-3 w-3 rounded-full bg-emerald-500"
                    />
                    {{ slotProps.data.speaker ?? 'TBA' }}
                  </span>
                </template>
              </PrimeColumn>
              <PrimeColumn
                style="width: 40%"
                field="topic"
                header="Topic"
              >
                <template #body="slotProps">
                  <div class="text-sm">
                    {{ slotProps.data.topic }}
                  </div>
                </template>
              </PrimeColumn>
            </PrimeDataTable>
          </div>
        </PrimeTabPanel>
      </PrimeTabPanels>
    </PrimeTabs>
  </div>
</template>
