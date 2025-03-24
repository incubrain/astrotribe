<script setup lang="ts">
defineProps({
  schedule: {
    type: Array,
    required: true,
  },
})

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

function getOrdinalIndicator(day: number) {
  if ([1, 21, 31].includes(day)) {
    return 'st'
  } else if ([2, 22].includes(day)) {
    return 'nd'
  } else if ([3, 23].includes(day)) {
    return 'rd'
  } else {
    return 'th'
  }
}

const timezone = computed(() => Intl.DateTimeFormat().resolvedOptions().timeZone)
</script>

<template>
  <div class="w-full">
    <CommonTitle
      :title="{
        main: 'Schedule',
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
          {{ `${day.label} ${day.day}${getOrdinalIndicator(day.day)} ${day.month} ${day.year}` }}
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
                    {{ convertISTtoLocal(day.day, data.time) }}
                  </span>
                </template>
              </PrimeColumn>
              <PrimeColumn
                style="width: 40%"
                field="activiy"
                header="Activity"
              >
                <template #body="slotProps">
                  <div class="text-sm">
                    {{ slotProps.data.activity }}
                  </div>
                </template>
              </PrimeColumn>

              <PrimeColumn
                style="width: 40%"
                field="description"
                header="Description"
              >
                <template #body="slotProps">
                  <ul
                    v-for="(description, index) in slotProps.data.description"
                    :key="index"
                    class="text-sm"
                  >
                    <li>{{ description }}</li
                    ><li> </li
                  ></ul>
                </template>
              </PrimeColumn>
            </PrimeDataTable>
          </div>
        </PrimeTabPanel>
      </PrimeTabPanels>
    </PrimeTabs>
  </div>
</template>
