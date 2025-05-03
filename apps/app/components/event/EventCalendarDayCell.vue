<script setup lang="ts">
import { ref, onMounted } from 'vue'

defineProps({
  day: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['open-event', 'show-day-events'])

// Inject utilities from parent
const { getCategoryIcon, getCategoryClass } = useEventCategories()

// Pre-generate star animation properties to avoid hydration mismatches
const starAnimations = ref(
  [] as Array<{ top: string; left: string; animationDelay: string; animationDuration: string }>,
)

onMounted(() => {
  // Only generate random values after component is mounted (client-side only)
  starAnimations.value = Array.from({ length: 5 }, () => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 3}s`,
    animationDuration: `${2 + Math.random() * 3}s`,
  }))
})

// Remove the getMoonPhase function since we'll use the MoonPhase component
</script>

<template>
  <div
    :class="[
      'relative min-h-24 p-1 rounded-md overflow-hidden transition-all',
      day.isCurrentMonth ? 'bg-primary-900/30' : 'bg-primary-950/50 opacity-60',
      day.isToday ? 'ring-2 ring-primary-500/70' : '',
      day.isPast ? 'opacity-80' : '',
    ]"
  >
    <!-- Star Animation - Only render on client after mount -->
    <div class="absolute inset-0 opacity-20 pointer-events-none">
      <div
        v-for="(star, n) in starAnimations"
        :key="n"
        class="absolute w-0.5 h-0.5 bg-white rounded-full animate-pulse"
        :style="star"
      ></div>
    </div>

    <!-- Date & Moon Phase -->
    <div class="flex justify-between items-start">
      <span class="text-sm font-semibold">{{ day.date.getDate() }}</span>
      <!-- Replace direct moon phase with the component -->
      <MoonPhase
        v-if="day.isCurrentMonth"
        :date="day.date"
        class="text-xs"
      />
    </div>

    <!-- Events for Day -->
    <div class="mt-1 space-y-1">
      <template v-if="day.events.length">
        <div
          v-for="(event, eventIndex) in day.events.slice(0, 2)"
          :key="`event-${day.date}-${eventIndex}`"
          v-tooltip.top="event.title"
          :class="[
            'text-xs px-1 py-0.5 rounded flex items-center gap-1 cursor-pointer hover:opacity-90 transition-opacity',
            getCategoryClass(event.category),
          ]"
          @click="(e) => $emit('open-event', event, e)"
        >
          <Icon
            :name="getCategoryIcon(event.category)"
            size="12px"
          />
          <span class="truncate">{{ event.title }}</span>
        </div>
        <!-- More Events Indicator -->
        <div
          v-if="day.events.length > 2"
          class="text-xs text-primary-300 flex items-center gap-1 cursor-pointer"
          @click="$emit('show-day-events', day.date, $event)"
        >
          <Icon
            name="i-lucide-plus"
            size="12px"
          />
          <span>{{ day.events.length - 2 }} more</span>
        </div>
      </template>
    </div>
  </div>
</template>
