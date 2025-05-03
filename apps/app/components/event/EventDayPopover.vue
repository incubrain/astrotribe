<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  events: {
    type: Array,
    required: true,
  },
  date: {
    type: Date,
    default: null,
  },
  triggerEvent: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'open-event'])

// Inject utilities from parent
const { getCategoryIcon, getCategoryColor, getCategoryIntensity, getCategoryTextColor } =
  useEventCategories()

// Popover reference
const popoverRef = ref(null)

watch(
  () => [props.date, props.triggerEvent],
  ([newDate, newTriggerEvent]) => {
    if (newDate && newTriggerEvent) {
      nextTick(() => {
        popoverRef.value?.show(newTriggerEvent)
      })
    } else {
      popoverRef.value?.hide()
    }
  },
  { immediate: true },
)

const handleHide = () => {
  emit('close')
}

const openEvent = (event) => {
  emit('open-event', event)
  popoverRef.value?.hide()
}
</script>

<template>
  <PrimePopover
    ref="popoverRef"
    class="astronomy-day-events-popover border border-color"
    dismissable
    @hide="handleHide"
  >
    <div
      v-if="events.length"
      class="space-y-2 p-4"
    >
      <!-- Your popover content (unchanged) -->
      <div
        v-for="event in events"
        :key="`day-event-${event.id}`"
        class="bg-primary-900/40 rounded-lg p-3 hover:bg-primary-800/40 transition-colors cursor-pointer"
        @click="openEvent(event)"
      >
        <!-- Rest of your content -->
      </div>
    </div>
  </PrimePopover>
</template>
