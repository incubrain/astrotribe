<script setup lang="ts">
// 1. Props and Emits
const props = defineProps({
  schedule: {
    type: Array,
    required: true,
  },
})

// 3. Reactive Variables
const activeTab = ref(0)

// 6. Other Composables
const timezone = computed(() => Intl.DateTimeFormat().resolvedOptions().timeZone)

// 11. Methods
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
</script>

<template>
  <div class="w-full mb-8">
    <h3 class="text-xl font-bold text-primary-400 mb-4">Workshop Schedule</h3>

    <PrimeTabs
      v-model:value="activeTab"
      :pt="{
        root: 'w-full',
      }"
    >
      <PrimeTabList
        :pt="{
          root: 'flex gap-4 mb-4 border-b border-primary-700/30 overflow-x-auto no-scrollbar',
        }"
      >
        <PrimeTab
          v-for="(day, i) in schedule"
          :key="`tab-${i}`"
          :value="i"
          :pt="{
            root: ({ context }) => ({
              class: [
                'px-4 py-2 font-medium text-sm transition-all duration-200',
                {
                  'text-primary-400 border-b-2 border-primary-400': context.active,
                  'text-gray-400 hover:text-primary-300': !context.active,
                },
              ],
            }),
          }"
        >
          <span>
            {{
              `${day.label} ${day.day}${getOrdinalIndicator(day.day)} ${day.month || 'March'} ${day.year}`
            }}
          </span>
        </PrimeTab>
      </PrimeTabList>

      <PrimeTabPanel
        v-for="(day, i) in schedule"
        :key="`tab-${i}`"
        :value="i"
      >
        <div
          class="bg-primary-900/40 backdrop-blur-sm rounded-lg overflow-hidden border border-primary-800/50"
        >
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-primary-800/80">
                  <th class="text-left py-3 px-4 font-semibold text-sm text-primary-300 w-1/5">
                    Time ({{ timezone }})
                  </th>
                  <th class="text-left py-3 px-4 font-semibold text-sm text-primary-300 w-2/5">
                    Activity
                  </th>
                  <th class="text-left py-3 px-4 font-semibold text-sm text-primary-300 w-2/5">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, itemIndex) in day.items"
                  :key="`item-${itemIndex}`"
                  :class="[
                    itemIndex % 2 === 0 ? 'bg-primary-950/50' : 'bg-primary-900/30',
                    'transition-colors hover:bg-primary-800/40',
                  ]"
                >
                  <td class="py-3 px-4 text-sm border-t border-primary-800/30">
                    <div class="flex items-center gap-2">
                      <Icon
                        v-if="item.icon"
                        :name="item.icon"
                        class="text-primary-400"
                        size="18px"
                      />
                      {{ convertISTtoLocal(day.day, item.time) }}
                    </div>
                  </td>
                  <td class="py-3 px-4 text-sm border-t border-primary-800/30 font-medium">
                    {{ item.activity }}
                  </td>
                  <td class="py-3 px-4 text-sm border-t border-primary-800/30 text-gray-300">
                    <ul class="space-y-1">
                      <li
                        v-for="(desc, descIndex) in item.description"
                        :key="`desc-${descIndex}`"
                        class="flex items-start"
                      >
                        <span
                          class="inline-block w-3 h-3 mt-1 mr-2 bg-primary-800/80 rounded-full"
                        ></span>
                        <span>{{ desc }}</span>
                      </li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </PrimeTabPanel>
    </PrimeTabs>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
