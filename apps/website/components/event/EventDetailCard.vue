<script setup lang="ts">
import type { AstronomyEvent } from '~/composables/useEvents' // Adjust import path
import { usePersona } from '~/composables/usePersona'
import CountdownTimer from '~/components/CountdownTimer.vue'
import AddToCalendarButton from '~/components/AddToCalendarButton.vue'

// Use defineProps for type safety
interface Props {
  event: AstronomyEvent
}

const props = defineProps<Props>()

const { activePersona } = usePersona()

const { formatEventDate } = useEvents()
</script>

<template>
  <div
    class="rounded-xl bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 overflow-hidden transition-all duration-500"
    :class="`border-${activePersona.color}-800/30 shadow-xl shadow-${activePersona.color}-900/10`"
  >
    <div
      class="px-6 py-4 border-b border-slate-800/30 flex items-center justify-between transition-colors duration-500"
      :class="`bg-${activePersona.color}-900/20`"
    >
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500"
          :class="`bg-${activePersona.color}-600/30 text-${activePersona.color}-400`"
        >
          <Icon
            :name="props.event.icon"
            size="24"
          />
        </div>
        <div>
          <h3 class="text-xl font-bold text-white">{{ props.event.name }}</h3>
          <p class="text-sm text-gray-400">{{ formatEventDate(props.event.date) }}</p>
        </div>
      </div>
      <div>
        <span
          class="px-3 py-1 rounded-full text-sm transition-colors duration-500"
          :class="`bg-${activePersona.color}-900/30 text-${activePersona.color}-400 border border-${activePersona.color}-800/30`"
        >
          {{ props.event.type }}
        </span>
      </div>
    </div>

    <div class="p-8">
      <p class="text-gray-300 mb-6">{{ props.event.description }}</p>

      <div class="mb-8">
        <CountdownTimer
          :target-date="props.event.date"
          :color="activePersona.color"
        />
      </div>

      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span class="text-sm text-gray-400">Add to your calendar:</span>
          <div class="mt-2">
            <AddToCalendarButton
              :event-name="props.event.name"
              :event-date="props.event.date"
              :event-description="props.event.description"
              :event-id="props.event.id"
              variant="mini"
              inline
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
