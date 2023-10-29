<template>
  <div class="py-12">
    <h2 class="text-xl lg:text-3xl pb-12"> Conference Schedule </h2>
    <UTabs
      :items="schedule"
      :ui="{ wrapper: 'space-y-6' }"
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
        <div class="border border-color">
          <UTable
            :columns="columns"
            :rows="item.items"
          >
            <template #topic-data="{ row }">
              <span class="flex items-center gap-2">
                {{ row.topic }}
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
  console.log('dateInIST', day, time)
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
        time: { start: '09:00', end: '11:00' }
      },
      {
        icon: 'i-material-symbols-breakfast-dining',
        topic: 'Complimentary Breakfast',
        speaker: '',
        time: { start: '09:00', end: '10:00' }
      },
      {
        icon: 'i-material-symbols-play-circle-outline',
        topic: 'Opening ceremony',
        speaker: 'Host Ruchira Huchgol',
        time: { start: '11:00', end: '11:10' }
      },
      {
        icon: 'i-mdi-microphone',
        topic: 'KeyNote',
        speaker: 'Speaker 1',
        time: { start: '11:30', end: '12:00' }
      },
      {
        icon: 'i-mdi-microphone',
        topic: 'KeyNote',
        speaker: 'Speaker 2',
        time: { start: '12:00', end: '12:30' }
      },
      {
        icon: 'i-mdi-silverware-fork-knife',
        topic: 'Complimentary Lunch + Check In',
        speaker: '',
        time: { start: '12:30', end: '14:00' }
      },
      {
        icon: 'i-mdi-microphone',
        topic: 'Presentation',
        speaker: 'Speaker 3',
        time: { start: '14:00', end: '14:30' }
      },
      {
        icon: 'i-mdi-microphone',
        topic: 'Presentation',
        speaker: 'Speaker 4',
        time: { start: '14:30', end: '15:00' }
      },
      {
        icon: 'i-mdi-microphone',
        topic: 'Presentation',
        speaker: 'Speaker 5',
        time: { start: '15:00', end: '15:30' }
      },
      {
        icon: 'i-mdi-microphone',
        topic: 'Presentation',
        speaker: 'Speaker 6',
        time: { start: '15:30', end: '16:00' }
      },
      {
        icon: 'i-mdi-coffee',
        topic: 'Complimentary Tea',
        speaker: '',
        time: { start: '16:00', end: '16:30' }
      },
      {
        icon: 'i-mdi-microphone',
        topic: 'Presentation',
        speaker: 'Speaker 7',
        time: { start: '16:30', end: '17:00' }
      },
      {
        icon: 'i-mdi-microphone',
        topic: 'Poster winners announcement and conclusion of the day',
        speaker: 'Ruchira Huchgol',
        time: { start: '17:00', end: '17:30' }
      },
      {
        icon: 'i-material-symbols-group-work',
        topic: 'Workshop',
        speaker: 'Aishwarya Khade',
        time: { start: '17:30', end: '18:30' }
      },
      {
        icon: 'i-material-symbols-dark-mode-outline',
        topic: 'Stargazing (Optional)',
        speaker: '',
        time: { start: '18:30', end: '20:00' }
      },
      {
        icon: 'i-material-symbols-celebration',
        topic: 'AstronEra 5 Year Celebration',
        speaker: '',
        time: { start: '20:00', end: '21:00' }
      },
      {
        icon: 'i-mdi-silverware-fork-knife',
        topic: 'Complimentary Dinner',
        speaker: '',
        time: { start: '21:00', end: '22:00' }
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
        time: { start: '09:00', end: '10:00' },
        class: 'bg-primary-500/50 dark:bg-primary-950'
      },
      {
        icon: 'i-mdi-microphone',
        topic: 'Presentation',
        speaker: 'Speaker 8',
        time: { start: '10:00', end: '10:30' }
      },
      {
        icon: 'i-mdi-microphone',
        topic: 'Presentation',
        speaker: 'Speaker 9',
        time: { start: '10:30', end: '11:00' }
      },
      {
        icon: 'i-mdi-microphone',
        topic: 'Presentation',
        speaker: 'Speaker 10',
        time: { start: '11:00', end: '11:30' }
      },
      {
        icon: 'i-mdi-coffee',
        topic: 'Complimentary Tea',
        speaker: '',
        time: { start: '11:30', end: '12:00' }
      },
      {
        icon: 'i-mdi-microphone',
        topic: 'Presentation',
        speaker: 'Speaker 11',
        time: { start: '12:00', end: '12:30' }
      },
      {
        icon: 'i-mdi-microphone',
        topic: 'Presentation',
        speaker: 'Speaker 12',
        time: { start: '12:30', end: '13:00' }
      },
      {
        icon: 'i-mdi-silverware-fork-knife',
        topic: 'Complimentary Lunch',
        speaker: '',
        time: { start: '13:00', end: '14:00' }
      },
      {
        icon: 'i-mdi-microphone',
        topic: 'Presentation',
        speaker: 'Speaker 13',
        time: { start: '14:00', end: '14:30' }
      },
      {
        icon: 'i-mdi-microphone',
        topic: 'Presentation',
        speaker: 'Speaker 14',
        time: { start: '14:30', end: '15:00' }
      },
      {
        icon: 'i-mdi-microphone',
        topic: 'Presentation',
        speaker: 'Speaker 15',
        time: { start: '15:00', end: '15:30' }
      },
      {
        icon: 'i-mdi-coffee',
        topic: 'Complimentary Tea',
        speaker: '',
        time: { start: '15:30', end: '16:00' }
      },
      {
        icon: 'i-mdi-microphone',
        topic: 'Presentation',
        speaker: 'Speaker 16',
        time: { start: '16:00', end: '16:30' }
      },
      {
        icon: 'i-mdi-microphone',
        topic: 'Presentation',
        speaker: 'Speaker 17',
        time: { start: '16:30', end: '17:00' }
      },
      {
        icon: 'i-mdi-microphone',
        topic: 'Poster Presentation',
        speaker: '',
        time: { start: '17:00', end: '18:00' }
      },
      {
        icon: 'i-material-symbols-celebration',
        topic: 'Optional Manali Tour (paid)',
        speaker: '',
        time: { start: '17:00', end: '20:00' }
      },
      {
        icon: 'i-mdi-silverware-fork-knife',
        topic: 'Complimentary Dinner',
        speaker: '',
        time: { start: '21:00', end: '22:00' }
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
        time: { start: '09:00', end: '09:45' }
      },
      {
        icon: 'i-material-symbols-play-circle-outline',
        topic: 'Opening Remarks',
        speaker: 'Ruchira Huchgol',
        time: { start: '09:45', end: '10:00' }
      },
      {
        icon: 'i-mdi-microphone',
        topic: 'Presentation',
        speaker: 'Speaker 18',
        time: { start: '10:00', end: '10:30' }
      },
      {
        icon: 'i-mdi-microphone',
        topic: 'Presentation',
        speaker: 'Speaker 19',
        time: { start: '10:30', end: '11:00' }
      },
      {
        icon: 'i-mdi-microphone',
        topic: 'Presentation',
        speaker: 'Speaker 20',
        time: { start: '11:00', end: '11:30' }
      },
      {
        icon: 'i-mdi-coffee',
        topic: 'Complimentary Tea',
        speaker: '',
        time: { start: '11:30', end: '12:00' }
      },
      {
        icon: 'i-mdi-microphone',
        topic: 'Presentation',
        speaker: 'Speaker 21',
        time: { start: '12:00', end: '12:30' }
      },
      {
        icon: 'i-mdi-microphone',
        topic: 'Presentation',
        speaker: 'Speaker 21',
        time: { start: '12:00', end: '12:30' }
      },
      {
        icon: 'i-mdi-silverware-fork-knife',
        topic: 'Complimentary Lunch',
        speaker: '',
        time: { start: '13:00', end: '14:00' }
      },
      {
        topic: 'Closing Remarks',
        speaker: 'Organizer',
        time: { start: '16:30', end: '17:00' }
      },
      {
        topic: 'Fireside Networking',
        speaker: '',
        time: { start: '17:00', end: '20:00' }
      },
      { topic: 'Stargazing', speaker: '', time: { start: '20:00', end: '21:00' } },
      {
        icon: 'i-mdi-silverware-fork-knife',
        topic: 'Complimentary Dinner',
        speaker: '',
        time: { start: '21:00', end: '22:00' }
      }
    ]
  },
  {
    slot: 'monday',
    label: 'Monday',
    day: 27,
    items: [
      {
        icon: 'i-material-symbols-breakfast-dining',
        topic: 'Chargable Breakfast',
        speaker: '',
        time: { start: '09:00', end: '09:45' }
      },
      {
        icon: 'i-material-symbols-breakfast-dining',
        topic: 'Checkout',
        speaker: '',
        time: { start: '09:00', end: '10:00' }
      }
    ]
  }
]
</script>
