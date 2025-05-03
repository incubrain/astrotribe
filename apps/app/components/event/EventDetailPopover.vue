<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  event: {
    type: Object,
    default: null,
  },
  triggerEvent: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close'])

const { getCategoryIcon, getCategoryColor, getCategoryIntensity, getCategoryTextColor } =
  useEventCategories()

// Popover reference
const popoverRef = ref(null)

watch(
  () => [props.event, props.triggerEvent],
  ([newEvent, newTriggerEvent]) => {
    if (newEvent && newTriggerEvent) {
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

// Helper for formatting date
const formatDate = (date) => {
  if (!date) return ''
  const dateObj = new Date(date)
  return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<template>
  <PrimePopover
    ref="popoverRef"
    class="astronomy-event-popover border border-color"
    dismissable
    @hide="handleHide"
  >
    <div
      v-if="event"
      class="space-y-4 p-4"
    >
      <div class="flex items-center gap-2">
        <div
          :class="[
            'p-2 rounded-full',
            `bg-${getCategoryColor(event.category)}-${getCategoryIntensity(event.category)}/30`,
          ]"
        >
          <Icon
            :name="getCategoryIcon(event.category)"
            size="24px"
            :class="getCategoryTextColor(event.category)"
          />
        </div>
        <span
          :class="[
            'px-3 py-1 rounded-full text-sm',
            `bg-${getCategoryColor(event.category)}-${getCategoryIntensity(event.category)}/20`,
            getCategoryTextColor(event.category),
          ]"
        >
          {{ event.category }}
        </span>
      </div>

      <h3 class="text-xl font-bold text-white">{{ event.title }}</h3>

      <div class="space-y-3 text-gray-300">
        <div class="flex items-start gap-3">
          <Icon
            name="i-lucide-calendar"
            size="18px"
            class="mt-0.5 text-primary-400"
          />
          <span>{{ formatDate(event.date) }}</span>
        </div>
        <div
          v-if="event.time"
          class="flex items-start gap-3"
        >
          <Icon
            name="i-lucide-clock"
            size="18px"
            class="mt-0.5 text-primary-400"
          />
          <span>{{ event.time }}</span>
        </div>
        <div
          v-if="event.location"
          class="flex items-start gap-3"
        >
          <Icon
            name="i-lucide-map-pin"
            size="18px"
            class="mt-0.5 text-primary-400"
          />
          <span>{{ event.location }}</span>
        </div>
        <div
          v-if="event.visibility"
          class="flex items-start gap-3"
        >
          <Icon
            name="i-lucide-eye"
            size="18px"
            class="mt-0.5 text-primary-400"
          />
          <span>Visibility: {{ event.visibility }}</span>
        </div>
        <div class="flex items-start gap-3">
          <Icon
            name="i-lucide-info"
            size="18px"
            class="mt-0.5 text-primary-400"
          />
          <p>{{ event.description }}</p>
        </div>
      </div>

      <!-- Optional viewing tips if available -->
      <div
        v-if="event.viewingTips"
        class="bg-primary-800/30 rounded-lg p-3"
      >
        <div class="flex items-center gap-2 mb-2">
          <Icon
            name="i-lucide-binoculars"
            size="18px"
            class="text-primary-400"
          />
          <h4 class="font-medium text-white">Viewing Tips</h4>
        </div>
        <p class="text-sm text-gray-300">{{ event.viewingTips }}</p>
      </div>

      <!-- Related information links if available -->
      <div
        v-if="event.links && event.links.length"
        class="space-y-2"
      >
        <h4 class="font-medium text-white">Learn More</h4>
        <a
          v-for="(link, index) in event.links"
          :key="index"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="block text-primary-400 hover:text-primary-300 text-sm"
        >
          <div class="flex items-center gap-2">
            <Icon
              name="i-lucide-external-link"
              size="14px"
            />
            <span>{{ link.title }}</span>
          </div>
        </a>
      </div>

      <!-- Registration button for Astronera events -->
      <div
        v-if="event.category === 'Event by Astronera'"
        class="pt-2"
      >
        <PrimeButton
          label="Register for this event"
          severity="primary"
          class="w-full"
        />
      </div>

      <!-- Reminder/calendar option -->
      <div
        v-if="event.date"
        class="flex justify-between items-center"
      >
        <PrimeButton
          icon="i-lucide-bell"
          label="Set Reminder"
          text
          severity="secondary"
          class="text-sm"
        />
        <PrimeButton
          icon="i-lucide-calendar-plus"
          label="Add to Calendar"
          text
          severity="secondary"
          class="text-sm"
        />
      </div>

      <!-- Social sharing options -->
      <div class="flex justify-center gap-3 pt-2">
        <button class="text-gray-400 hover:text-primary-400 transition-colors">
          <Icon
            name="i-lucide-share"
            size="20px"
          />
        </button>
        <button class="text-gray-400 hover:text-primary-400 transition-colors">
          <Icon
            name="i-lucide-bookmark"
            size="20px"
          />
        </button>
      </div>
    </div>
  </PrimePopover>
</template>

<style scoped>
/* Enhanced popover styling */
:deep(.p-popover) {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  border-radius: 0.75rem;
}

:deep(.p-popover .p-popover-content) {
  padding: 0;
}

:deep(.astronomy-event-popover) {
  width: 320px !important;
  max-width: 320px !important;
  background-color: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 0.5rem;
  border: 1px solid rgba(51, 65, 85, 0.5);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  color: #fff;
}

/* Subtle star background for popover */
:deep(.astronomy-event-popover::before) {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
  pointer-events: none;
  opacity: 0.1;
  z-index: -1;
}
</style>
