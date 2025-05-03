<script setup lang="ts">
defineProps({
  events: {
    type: Array,
    required: true,
  },
})

defineEmits(['open-event'])

// Inject utilities from parent
const { getCategoryIcon, getCategoryColor, getCategoryIntensity, getCategoryTextColor } =
  useEventCategories()

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const isValidTime = (time: string | null) => {
  return time && time !== 'null'
}
</script>

<template>
  <div class="bg-primary-900/20 rounded-lg p-4">
    <div
      v-if="events.length === 0"
      class="text-center py-8 text-gray-400"
    >
      No events found for the selected filters.
    </div>
    <div
      v-else
      class="space-y-2"
    >
      <div
        v-for="event in events"
        :key="`list-${event.id}`"
        class="bg-primary-900/40 rounded-lg p-3 hover:bg-primary-800/40 transition-colors cursor-pointer"
        @click="(e) => $emit('open-event', event, e)"
      >
        <div class="flex justify-between items-start">
          <div class="flex gap-3 items-start">
            <div
              :class="[
                'p-2 rounded-full flex',
                `bg-${getCategoryColor(event.category)}-${getCategoryIntensity(event.category)}/30`,
              ]"
            >
              <Icon
                :name="getCategoryIcon(event.category)"
                size="20px"
                :class="getCategoryTextColor(event.category)"
              />
            </div>
            <div>
              <h4 class="font-semibold">{{ event.title }}</h4>
              <p class="text-sm text-gray-400 mt-1">{{ event.description }}</p>
            </div>
          </div>
          <div class="text-sm text-right flex-shrink-0 w-24">
            <div class="font-medium">{{ formatDate(event.date) }}</div>
            <div
              v-if="isValidTime(event.time)"
              class="text-gray-400"
            >
              {{ event.time }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
