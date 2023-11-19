<template>
  <div class="py-12 space-y-6">
    <CommonTitle
      :title="{
        label: 'Conference Schedule',
        main: 'A 3-Day Astronomical Adventure '
      }"
    />
    <div class="space-x-2">
      <UButton
        v-for="link in registerLinks"
        :key="`register-for-${link.day}`"
        :to="link.url"
        target="_blank"
        color="primary"
      >
        Online Register {{ link.day }}
      </UButton>
    </div>
    <UTabs
      :items="schedule"
      :ui="{
        wrapper: 'space-y-6',
        list: {
          background: 'bg-white dark:bg-black',
          padding: 'p-2',
          rounded: 'border border-color',
          height: 'h-auto',
          marker: {
            background: 'bg-primary-50 dark:bg-primary-950'
          }
        }
      }"
      orientation="horizontal"
    >
      <template #default="{ item, index, selected }">
        <div>
          <p class="text-sm font-semibold lg:text-lg">
            {{ item.label.slice(0, 3) }} {{ item.day }}th Nov
          </p>
        </div>
      </template>
      <template
        v-for="(day, i) in schedule"
        :key="`conference-day${i}`"
        #[day.slot]="{ item }"
      >
        <div class="border border-color rounded-md">
          <UTable
            :columns="columns"
            :rows="item.items"
            :ui="{
              wrapper: width > 520 ? '' : 'overflow-x-scroll',
              thead: 'sticky top-0 z-10'
            }"
          >
            <template #topic-data="{ row }">
              <span class="flex items-center gap-2 whitespace-normal">
                {{ row.topic }}
              </span>
            </template>
            <template #speaker-data="{ row }">
              <span class="font-semibold flex items-center leading-none">
                <div
                  v-if="row.online"
                  class="w-3 h-3 rounded-full bg-emerald-500 mr-1"
                />
                {{ row.speaker }}
              </span>
            </template>
            <template #speaker-header="{ row }">
              <span class="font-semibold flex items-center leading-none">
                Speaker (
                <div class="w-3 h-3 rounded-full bg-emerald-500 mr-1" />
                = Online)
              </span>
            </template>
            <template #time-data="{ row }">
              <span class="flex items-center gap-2">
                <UIcon
                  :name="row.icon"
                  class="w-5 h-5"
                />
                {{ convertISTtoLocal(String(i + 24), row.time) }}
              </span>
            </template>
          </UTable>
        </div>
      </template>
    </UTabs>
  </div>
</template>

<script setup lang="ts">
function convertISTtoLocal(day: string, time: { start: string; end: string }) {
  const start = `2023-11-${day}T${time.start}:00+05:30` // '+05:30' is the offset for IST
  const end = `2023-11-${day}T${time.end}:00+05:30` // '+05:30' is the offset for IST

  // Creating a Date object
  const startIST = new Date(start)
  const endIST = new Date(end)

  // Converting to local time string
  const startLocal = startIST.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })

  const endLocal = endIST.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })

  return `${startLocal} - ${endLocal}`
}

const { width } = useWindowSize()

const timezone = computed(() => Intl.DateTimeFormat().resolvedOptions().timeZone)
console.log('timezone', timezone.value)
const columns = computed(() => [
  {
    key: 'time',
    label: `Time (${timezone.value})`
  },
  {
    key: 'speaker',
    label: 'Speaker'
  },
  {
    key: 'topic',
    label: 'Topic'
  }
])

const registerLinks = [
  {
    day: 'Friday',
    url: 'https://us06web.zoom.us/meeting/register/tZIoc-igrzstHdIOAAn1vJXPRxgohInXjlsV'
  },
  {
    day: 'Saturday',
    url: 'https://us06web.zoom.us/meeting/register/tZAodeyvpjMrG9AwjinCx86l5d5pPHPVp5JQ'
  },
  {
    day: 'Sunday',
    url: 'https://us06web.zoom.us/meeting/register/tZUudO2qrzkpE9IGWf_fEi7ejckAdy2Mm370'
  }
]

const schedule = [
  {
    slot: 'friday',
    label: 'Friday',
    day: 24,
    items: [
      {
        icon: 'i-mdi-calendar-clock',
        topic: 'Registration at Manu Allaya',
        speaker: '',
        time: { start: '09:00', end: '11:00' },
        class: 'bg-primary-50 dark:bg-primary-950'
      },
      {
        icon: 'i-material-symbols-breakfast-dining',
        topic: 'Complimentary Breakfast',
        speaker: '',
        time: { start: '09:00', end: '10:00' },
        class: 'bg-primary-50 dark:bg-primary-950'
      },
      {
        icon: 'i-material-symbols-line-end-arrow-rounded',
        topic: 'Opening Ceremony / Inauguration',
        speaker: 'Ruchira Huchgol',
        time: { start: '11:00', end: '11:20' }
      },
      {
        online: true,
        icon: 'i-mdi-microphone',
        topic:
          'Climate Change & Clean Energy (C3E) Division, Department of Science and Technolohgy, Government of India',
        speaker: 'Dr. Anita Gupta',
        time: { start: '11:30', end: '12:00' }
      },
      {
        online: true,
        icon: 'i-mdi-microphone',
        topic: 'Light Pollution and Satellite Constellations',
        speaker: 'Dr. Constance (Connie) Walker',
        time: { start: '12:00', end: '12:30' }
      },
      {
        icon: 'i-mdi-silverware-fork-knife',
        topic: 'Complimentary Lunch + Check In',
        speaker: '',
        time: { start: '12:30', end: '13:30' },
        class: 'bg-primary-50 dark:bg-primary-950'
      },
      {
        icon: 'i-mdi-microphone',
        online: true,
        topic: 'Harnessing Dark Skies for Socioeconomic Development in Rural Areas',
        speaker: 'Samyukta Manikumar',
        time: { start: '13:30', end: '14:00' }
      },
      {
        icon: 'i-mdi-microphone',
        topic: 'Know to Preserve',
        speaker: 'Alejandro Sommer',
        online: true,
        time: { start: '14:00', end: '14:30' }
      },
      {
        online: false,
        icon: 'i-mdi-microphone',
        topic: 'Intruders in the Dark Sky: The Megaconstellation Crisiss',
        speaker: 'Upasana Dasgupta',
        time: { start: '14:30', end: '15:00' }
      },
      {
        online: false,
        icon: 'i-mdi-microphone',
        topic: 'AstroTourism in Nepal',
        speaker: 'Dr. Jayanta Acharya',
        time: { start: '15:00', end: '15:30' }
      },
      {
        online: false,
        icon: 'i-mdi-microphone',
        topic: 'The ancient science of space and agriculture for sustainability and harmony',
        speaker: 'Amshu CR',
        time: { start: '15:30', end: '16:00' }
      },
      {
        icon: 'i-mdi-coffee',
        topic: 'Complimentary Tea',
        speaker: '',
        time: { start: '16:00', end: '16:30' },
        class: 'bg-primary-50 dark:bg-primary-950'
      },
      {
        icon: 'i-mdi-microphone',
        online: false,
        topic: 'Mental Health, Arts and Astronomy',
        speaker: 'Aishwarya Khade',
        time: { start: '16:30', end: '17:00' }
      },
      {
        online: false,
        icon: 'i-material-symbols-trophy-rounded',
        topic: 'Poster winners announcement / day conclusion',
        speaker: 'Ruchira Huchgol',
        time: { start: '17:00', end: '17:30' }
      },
      {
        online: false,
        icon: 'i-material-symbols-group-work',
        topic: 'Workshop',
        speaker: 'Aishwarya Khade',
        time: { start: '17:30', end: '18:30' }
      },
      {
        icon: 'i-material-symbols-dark-mode',
        topic: 'Stargazing (Optional)',
        speaker: '',
        time: { start: '18:30', end: '20:00' },
        class: 'bg-primary-50 dark:bg-primary-950'
      },
      {
        icon: 'i-material-symbols-celebration',
        topic: 'AstronEra 5 Year Celebration',
        speaker: '',
        time: { start: '20:00', end: '21:00' },
        class: 'bg-primary-50 dark:bg-primary-950'
      },
      {
        icon: 'i-mdi-silverware-fork-knife',
        topic: 'Complimentary Dinner',
        speaker: '',
        time: { start: '21:00', end: '22:00' },
        class: 'bg-primary-50 dark:bg-primary-950'
      }
    ]
  },
  {
    slot: 'saturday',
    label: 'Saturday',
    day: 25,
    items: [
      {
        icon: 'i-material-symbols-breakfast-dining',
        topic: 'Complimentary Breakfast',
        speaker: '',
        time: { start: '09:00', end: '09:45' },
        class: 'bg-primary-50 dark:bg-primary-950'
      },
      {
        icon: 'i-material-symbols-line-end-arrow-rounded',
        topic: 'Opening Remarks',
        speaker: 'Ruchira Huchgol',
        online: false,
        time: { start: '09:45', end: '10:00' }
      },
      {
        online: false,
        icon: 'i-mdi-microphone',
        topic: 'Skill Training in Astronomy for Income Generation',
        speaker: 'Shweta Kulkarni',
        time: { start: '10:00', end: '10:30' }
      },
      {
        online: false,
        icon: 'i-mdi-microphone',
        topic: 'Sustainable Development for Tribal Ladakhies through Astronomy',
        speaker: 'Sonam Wangchuk',
        time: { start: '10:30', end: '11:00' }
      },
      {
        online: false,
        icon: 'i-mdi-microphone',
        topic: 'The planetarium as a creative space',
        speaker: 'David Ault',
        time: { start: '11:00', end: '11:30' }
      },
      {
        online: false,
        icon: 'i-mdi-microphone',
        topic: 'Indian successors to the Indian Gamma-Ray Observatory(IGRO) Mission',
        speaker: 'Bhakti Shashikant Mithagri',
        time: { start: '11:30', end: '12:00' }
      },
      {
        online: true,
        icon: 'i-mdi-microphone',
        topic: "Astronomy's Impact on Sustainability",
        speaker: 'María Alejandra Díaz Teodori',
        time: { start: '12:00', end: '12:30' }
      },
      {
        online: true,
        icon: 'i-mdi-microphone',
        topic: 'ASTROx Dark Sky: How to Integrate Astronomy Education into Interactive Classroom',
        speaker: 'Exodus Chun-Long Sit',
        time: { start: '12:30', end: '13:00' }
      },
      {
        icon: 'i-mdi-silverware-fork-knife',
        topic: 'Complimentary Lunch',
        speaker: '',
        time: { start: '13:00', end: '14:00' },
        class: 'bg-primary-50 dark:bg-primary-950'
      },
      {
        online: false,
        icon: 'i-mdi-microphone',
        topic: 'Working group discussion',
        speaker: 'Ruchira, Shweta, Aishwarya',
        time: { start: '14:00', end: '15:00' }
      },
      {
        online: false,
        icon: 'i-mdi-microphone',
        topic: 'Stellar Education: Unveiling ISAAC',
        speaker: 'Dinesh Nisang',
        time: { start: '15:00', end: '15:30' }
      },
      {
        online: false,
        icon: 'i-mdi-microphone',
        topic: 'Day and Night on the Pale Blue Dot',
        speaker: 'Rashmi Sheoran',
        time: { start: '15:30', end: '16:00' }
      },
      {
        icon: 'i-mdi-coffee',
        topic: 'Complimentary Tea',
        speaker: '',
        time: { start: '16:00', end: '16:30' },
        class: 'bg-primary-50 dark:bg-primary-950'
      },
      {
        online: false,
        icon: 'i-material-symbols-line-end-circle',
        topic: 'Closing remarks',
        speaker: 'Ruchira Huchgol',
        time: { start: '16:30', end: '17:00' }
      },
      {
        icon: 'i-material-symbols-alarm-add',
        topic: 'Free Time',
        speaker: '',
        time: { start: '17:00', end: '20:00' },
        class: 'bg-primary-50 dark:bg-primary-950'
      },
      {
        icon: 'i-material-symbols-dark-mode',
        topic: 'Stargazing (Optional)',
        speaker: '',
        time: { start: '20:00', end: '21:00' },
        class: 'bg-primary-50 dark:bg-primary-950'
      },
      {
        icon: 'i-mdi-silverware-fork-knife',
        topic: 'Complimentary Dinner',
        speaker: '',
        time: { start: '21:00', end: '22:00' },
        class: 'bg-primary-50 dark:bg-primary-950'
      }
    ]
  },
  {
    slot: 'sunday',
    label: 'Sunday',
    day: 26,
    items: [
      {
        icon: 'i-material-symbols-breakfast-dining',
        topic: 'Complimentary Breakfast',
        speaker: '',
        time: { start: '09:00', end: '09:45' },
        class: 'bg-primary-50 dark:bg-primary-950'
      },
      {
        online: false,
        icon: 'i-material-symbols-line-end-arrow-rounded',
        topic: 'Opening Remarks',
        speaker: 'Ruchira Huchgol',
        time: { start: '09:45', end: '10:00' }
      },
      {
        online: false,
        icon: 'i-mdi-microphone',
        topic: 'Sustainable Development through Astronomy: A Tribal Perspective',
        speaker: 'Dr. Kiran Kulkarni',
        time: { start: '10:00', end: '10:30' }
      },
      {
        online: false,
        icon: 'i-mdi-microphone',
        topic: 'Dark Skies and Bright Satellites',
        speaker: 'Dr. Priya Hasan',
        time: { start: '10:30', end: '11:00' }
      },
      {
        online: false,
        icon: 'i-mdi-microphone',
        topic: 'Affordable Radio Astronomy Lab',
        speaker: 'Nadia Makhijani and Udhish Sharma',
        time: { start: '11:00', end: '11:30' }
      },
      {
        online: true,
        icon: 'i-mdi-microphone',
        topic: 'Road to Sky',
        speaker: 'Hosien Khezri',
        time: { start: '11:30', end: '12:00' }
      },
      {
        online: false,
        icon: 'i-mdi-microphone',
        topic: 'Working group presentation',
        speaker: 'Ruchira, Shweta, Aishwarya',
        time: { start: '12:00', end: '12:45' }
      },
      {
        online: false,
        icon: 'i-mdi-microphone',
        topic: 'Poster winner presentation',
        speaker: 'Subhankar Saha (Inperson) Mohamed Farouk and Mr Rantwane (Online)',
        time: { start: '12:45', end: '13:00' }
      },
      {
        icon: 'i-mdi-silverware-fork-knife',
        topic: 'Complimentary Lunch',
        speaker: '',
        time: { start: '13:00', end: '14:00' },
        class: 'bg-primary-50 dark:bg-primary-950'
      },
      {
        online: true,
        icon: 'i-mdi-microphone',
        topic: 'Future Scientists in an Astrotourium',
        speaker: 'João Retre ',
        time: { start: '14:00', end: '14:30' }
      },
      {
        online: true,
        icon: 'i-mdi-microphone',
        topic:
          "Empowering Ghana's STEM Education: Bridging the Gap through Capacity Building in Astronomy Instrumentation",
        speaker: 'Albert Kuntu Forson ',
        time: { start: '14:30', end: '15:00' }
      },
      {
        online: false,
        icon: 'i-mdi-microphone',
        topic: 'Light pollution: A Camouflaging pollution',
        speaker: 'Vedavrat Bedekar',
        time: { start: '15:00', end: '15:30' }
      },
      {
        online: false,
        icon: 'i-mdi-microphone',
        topic: 'Lighting for Dark Skies',
        speaker: 'Neethu Susan George',
        time: { start: '15:30', end: '16:00' }
      },
      {
        online: false,
        icon: 'i-material-symbols-group-work',
        topic: 'Panel Discussion',
        speaker: 'Shweta Kulkarni',
        time: { start: '16:00', end: '16:30' }
      },
      {
        online: false,
        icon: 'i-material-symbols-line-end-circle',
        topic: 'Closing Remarks',
        speaker: 'Ruchira Huchgol',
        time: { start: '16:30', end: '17:00' }
      },
      {
        icon: 'i-material-symbols-local-fire-department-rounded',
        topic: 'Fireside Networking',
        speaker: '',
        time: { start: '17:00', end: '20:00' },
        class: 'bg-primary-50 dark:bg-primary-950'
      },
      {
        icon: 'i-material-symbols-dark-mode',
        topic: 'Stargazing (Optional)',
        speaker: '',
        time: { start: '20:00', end: '21:00' },
        class: 'bg-primary-50 dark:bg-primary-950'
      },
      {
        icon: 'i-mdi-silverware-fork-knife',
        topic: 'Complimentary Dinner',
        speaker: '',
        time: { start: '21:00', end: '22:00' },
        class: 'bg-primary-50 dark:bg-primary-950'
      }
    ]
  }
]
</script>
