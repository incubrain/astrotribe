<template>
  <div class="py-12">
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
            {{ `${day.label} ${day.day}th Nov` }}
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
                    {{ slotProps.data.speaker }}
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

<script setup lang="ts">
function convertISTtoLocal(day: number, time: { start: string, end: string }) {
  const start = `2023-11-${day}T${time.start}:00+05:30` // '+05:30' is the offset for IST
  const end = `2023-11-${day}T${time.end}:00+05:30` // '+05:30' is the offset for IST

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
    slot: 'friday',
    value: '0',
    label: 'Friday',
    day: 24,
    items: [
      {
        icon: 'mdi:calendar-clock',
        topic: 'Registration at Manu Allaya',
        speaker: '',
        time: { start: '09:00', end: '11:00' },
        class: 'bg-primary-950',
      },
      {
        icon: 'material-symbols:breakfast-dining',
        topic: 'Complimentary Breakfast',
        speaker: '',
        time: { start: '09:00', end: '10:00' },
        class: 'bg-primary-950',
      },
      {
        icon: 'material-symbols:line-end-arrow-rounded',
        topic: 'Opening Ceremony / Inauguration',
        speaker: 'Ruchira Huchgol',
        time: { start: '11:00', end: '11:20' },
      },
      {
        online: true,
        icon: 'mdi:microphone',
        topic:
          'Climate Change & Clean Energy (C3E) Division, Department of Science and Technolohgy, Government of India',
        speaker: 'Dr. Anita Gupta',
        time: { start: '11:30', end: '12:00' },
      },
      {
        online: true,
        icon: 'mdi:microphone',
        topic:
          'Astronomy and Satellite Constellations: Pathways Forward for Light Pollution from Space',
        speaker: 'Dr. Constance (Connie) Walker',
        time: { start: '12:00', end: '12:30' },
      },
      {
        icon: 'mdi:silverware-fork-knife',
        topic: 'Complimentary Lunch + Check In',
        speaker: '',
        time: { start: '12:30', end: '13:30' },
        class: 'bg-primary-950',
      },
      {
        icon: 'mdi:microphone',
        online: true,
        topic: 'Harnessing Dark Skies for Socioeconomic Development in Rural Areas',
        speaker: 'Samyukta Manikumar',
        time: { start: '13:30', end: '14:00' },
      },
      {
        icon: 'material-symbols:group-work',
        topic: 'Round Table Activity',
        speaker: 'Ruchira Huchgol',
        time: { start: '14:00', end: '14:30' },
      },
      {
        online: false,
        icon: 'mdi:microphone',
        topic: 'Intruders in the Dark Sky: The Megaconstellation Crisiss',
        speaker: 'Upasana Dasgupta',
        time: { start: '14:30', end: '15:00' },
      },
      {
        icon: 'material-symbols:group-work',
        topic: 'Round Table Activity',
        speaker: 'Ruchira Huchgol',
        time: { start: '15:00', end: '15:30' },
      },
      {
        online: true,
        icon: 'mdi:microphone',
        topic: 'Astronomy\'s Impact on Sustainability',
        speaker: 'María Alejandra Díaz Teodori',
        time: { start: '15:30', end: '16:00' },
      },
      {
        icon: 'mdi:coffee',
        topic: 'Complimentary Tea',
        speaker: '',
        time: { start: '16:00', end: '16:30' },
        class: 'bg-primary-950',
      },
      {
        icon: 'mdi:microphone',
        online: false,
        topic: 'Mental Health, Arts and Astronomy',
        speaker: 'Aishwarya Khade',
        time: { start: '16:30', end: '17:00' },
      },
      {
        online: false,
        icon: 'material-symbols:group-work',
        topic: 'Workshop',
        speaker: 'Aishwarya Khade',
        time: { start: '17:00', end: '18:00' },
      },
      {
        online: false,
        icon: 'material-symbols:line-end-circle',
        topic: 'Closing remarks',
        speaker: 'Ruchira Huchgol',
        time: { start: '18:00', end: '18:10' },
      },
      {
        icon: 'material-symbols:alarm-add',
        topic: 'Free Time',
        speaker: '',
        time: { start: '18:10', end: '19:00' },
        class: 'bg-primary-950',
      },
      {
        icon: 'material-symbols:dark-mode',
        topic: 'Stargazing (Optional)',
        speaker: '',
        time: { start: '19:00', end: '21:30' },
        class: 'bg-primary-950',
      },
      {
        icon: 'material-symbols:celebration',
        topic: 'AstronEra 5 Year Celebration',
        speaker: '',
        time: { start: '19:00', end: '21:30' },
        class: 'bg-primary-950',
      },
      {
        icon: 'mdi:silverware-fork-knife',
        topic: 'Complimentary Dinner',
        speaker: '',
        time: { start: '20:30', end: '22:00' },
        class: 'bg-primary-950',
      },
    ],
  },
  {
    slot: 'saturday',
    label: 'Saturday',
    value: '1',
    day: 25,
    items: [
      {
        icon: 'material-symbols:breakfast-dining',
        topic: 'Complimentary Breakfast',
        speaker: '',
        time: { start: '09:00', end: '10:00' },
        class: 'bg-primary-950',
      },
      {
        icon: 'material-symbols:line-end-arrow-rounded',
        topic: 'Opening Remarks',
        speaker: 'Ruchira Huchgol',
        online: false,
        time: { start: '10:00', end: '10:20' },
      },
      {
        online: false,
        icon: 'mdi:microphone',
        topic: 'Sustainable Development through Astronomy: A Tribal Perspective',
        speaker: 'Dr. Kiran Kulkarni',
        time: { start: '10:20', end: '11:00' },
      },
      {
        online: false,
        icon: 'mdi:microphone',
        topic: 'The planetarium as a creative space',
        speaker: 'David Ault',
        time: { start: '11:00', end: '11:30' },
      },
      {
        online: false,
        icon: 'mdi:microphone',
        topic: 'Indian successors to the Indian Gamma-Ray Observatory(IGRO) Mission',
        speaker: 'Bhakti Shashikant Mithagri',
        time: { start: '11:30', end: '12:00' },
      },
      {
        online: false,
        icon: 'mdi:microphone',
        topic: 'The ancient science of space and agriculture for sustainability and harmony',
        speaker: 'Amshu CR',
        time: { start: '12:00', end: '12:30' },
      },
      {
        online: true,
        icon: 'mdi:microphone',
        topic: 'ASTROx Dark Sky: How to Integrate Astronomy Education into Interactive Classroom',
        speaker: 'Exodus Chun-Long Sit',
        time: { start: '12:30', end: '13:00' },
      },
      {
        icon: 'mdi:silverware-fork-knife',
        topic: 'Complimentary Lunch',
        speaker: '',
        time: { start: '13:00', end: '14:00' },
        class: 'bg-primary-950',
      },
      {
        online: false,
        icon: 'mdi:microphone',
        topic: 'Working group discussion',
        speaker: 'Ruchira, Shweta, Aishwarya',
        time: { start: '14:00', end: '15:00' },
      },
      {
        online: false,
        icon: 'mdi:microphone',
        topic: 'Stellar Education: Unveiling ISAAC',
        speaker: 'Dinesh Nisang',
        time: { start: '15:00', end: '15:30' },
      },
      {
        online: false,
        icon: 'mdi:microphone',
        topic: 'Round Table Activity',
        speaker: 'Ruchira Huchgol',
        time: { start: '15:30', end: '16:00' },
      },
      {
        icon: 'mdi:coffee',
        topic: 'Complimentary Tea',
        speaker: '',
        time: { start: '16:00', end: '16:30' },
        class: 'bg-primary-950',
      },
      {
        online: false,
        icon: 'material-symbols:line-end-circle',
        topic: 'Closing remarks',
        speaker: 'Ruchira Huchgol',
        time: { start: '16:30', end: '17:00' },
      },
      {
        icon: 'material-symbols:alarm-add',
        topic: 'Free Time',
        speaker: '',
        time: { start: '17:00', end: '19:00' },
        class: 'bg-primary-950',
      },
      {
        icon: 'material-symbols:dark-mode',
        topic: 'Stargazing (Optional)',
        speaker: '',
        time: { start: '19:00', end: '20:30' },
        class: 'bg-primary-950',
      },
      {
        icon: 'mdi:silverware-fork-knife',
        topic: 'Complimentary Dinner',
        speaker: '',
        time: { start: '20:30', end: '22:00' },
        class: 'bg-primary-950',
      },
    ],
  },
  {
    slot: 'sunday',
    label: 'Sunday',
    value: '2',
    day: 26,
    items: [
      {
        icon: 'material-symbols:breakfast-dining',
        topic: 'Complimentary Breakfast',
        speaker: '',
        time: { start: '08:30', end: '09:30' },
        class: 'bg-primary-950',
      },
      {
        online: false,
        icon: 'material-symbols:line-end-arrow-rounded',
        topic: 'Opening Remarks',
        speaker: 'Ruchira Huchgol',
        time: { start: '09:30', end: '09:40' },
      },
      {
        online: false,
        icon: 'mdi:microphone',
        topic: 'Skill Training in Astronomy for Income Generation',
        speaker: 'Shweta Kulkarni',
        time: { start: '09:40', end: '10:00' },
      },
      {
        online: false,
        icon: 'mdi:microphone',
        topic: 'Sustainable Development for Tribal Ladakhies through Astronomy',
        speaker: 'Sonam Wangchuk',
        time: { start: '10:00', end: '10:30' },
      },
      {
        online: true,
        icon: 'mdi:microphone',
        topic: 'Dark Skies and Bright Satellites',
        speaker: 'Dr. Priya Hasan',
        time: { start: '10:30', end: '11:00' },
      },
      {
        online: true,
        icon: 'mdi:microphone',
        topic:
          'Empowering Ghana\'s STEM Education: Bridging the Gap through Capacity Building in Astronomy Instrumentation',
        speaker: 'Albert Kuntu Forson ',
        time: { start: '11:00', end: '11:30' },
      },
      {
        online: true,
        icon: 'mdi:microphone',
        topic: 'Road to Sky',
        speaker: 'Hosien Khezri',
        time: { start: '11:30', end: '12:00' },
      },
      {
        online: false,
        icon: 'material-symbols:trophy-rounded',
        topic: 'Poster Winners Announcement',
        speaker: 'Ruchira Huchgol',
        time: { start: '12:00', end: '12:15' },
      },
      {
        online: false,
        icon: 'mdi:microphone',
        topic: 'Working group presentation',
        speaker: 'Ruchira, Shweta, Aishwarya',
        time: { start: '12:15', end: '13:00' },
      },
      {
        icon: 'mdi:silverware-fork-knife',
        topic: 'Complimentary Lunch',
        speaker: '',
        time: { start: '13:00', end: '14:00' },
        class: 'bg-primary-950',
      },
      {
        icon: 'material-symbols:group-work',
        speaker: 'Ruchira Huchgol',
        topic: 'Round Table Activity',
        time: { start: '14:00', end: '14:30' },
      },
      {
        online: false,
        icon: 'mdi:microphone',
        topic: 'Affordable Radio Astronomy Lab',
        speaker: 'Nadia Makhijani and Udhish Sharma',
        time: { start: '14:30', end: '15:00' },
      },
      {
        online: false,
        icon: 'mdi:microphone',
        topic: 'Light pollution: A Camouflaging pollution',
        speaker: 'Vedavrat Bedekar',
        time: { start: '15:00', end: '15:30' },
      },
      {
        online: false,
        icon: 'mdi:microphone',
        topic: 'Lighting for Dark Skies',
        speaker: 'Neethu Susan George',
        time: { start: '15:30', end: '16:00' },
      },
      {
        icon: 'mdi:coffee',
        topic: 'Complimentary Tea',
        speaker: '',
        time: { start: '16:00', end: '16:15' },
        class: 'bg-primary-950',
      },
      {
        online: false,
        icon: 'material-symbols:group-work',
        topic: 'Panel Discussion',
        speaker: 'Shweta Kulkarni',
        time: { start: '16:15', end: '16:45' },
      },
      {
        online: false,
        icon: 'material-symbols:line-end-circle',
        topic: 'Closing Remarks',
        speaker: 'Ruchira Huchgol',
        time: { start: '16:45', end: '17:00' },
      },
      {
        icon: 'material-symbols:alarm-add',
        topic: 'Free Time',
        speaker: '',
        time: { start: '17:00', end: '18:00' },
        class: 'bg-primary-950',
      },
      {
        icon: 'material-symbols:local-fire-department-rounded',
        topic: 'Fireside Networking / Cultural Performance',
        speaker: '',
        time: { start: '18:00', end: '19:00' },
        class: 'bg-primary-950',
      },
      {
        icon: 'material-symbols:dark-mode',
        topic: 'Stargazing (Optional)',
        speaker: '',
        time: { start: '19:00', end: '20:00' },
        class: 'bg-primary-950',
      },
      {
        icon: 'mdi:silverware-fork-knife',
        topic: 'Complimentary Dinner',
        speaker: '',
        time: { start: '20:00', end: '22:00' },
        class: 'bg-primary-950',
      },
    ],
  },
]
</script>
