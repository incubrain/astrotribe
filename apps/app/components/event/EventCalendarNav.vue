<script setup lang="ts">
const props = defineProps({
  currentDate: {
    type: Date,
    required: true,
  },
})

const emit = defineEmits(['navigate-month', 'go-to-today'])

const currentMonthDisplay = computed(() =>
  props.currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
)
</script>

<template>
  <div class="flex justify-between items-center mb-4 px-2">
    <div class="flex items-center gap-2">
      <PrimeButton
        icon="i-lucide-chevron-left"
        rounded
        text
        severity="secondary"
        aria-label="Previous month"
        @click="emit('navigate-month', -1)"
      />
      <PrimeButton
        label="Today"
        rounded
        text
        severity="secondary"
        @click="emit('go-to-today')"
      />
      <PrimeButton
        icon="i-lucide-chevron-right"
        rounded
        text
        severity="secondary"
        aria-label="Next month"
        @click="emit('navigate-month', 1)"
      />
    </div>
    <h2 class="text-2xl font-bold">{{ currentMonthDisplay }}</h2>
    <div class="flex items-center gap-2 text-sm bg-primary-900/30 px-3 py-1 rounded-full">
      <Icon
        name="i-lucide-map-pin"
        size="14px"
        class="text-primary-400"
      />
      <span>Pune, India</span>
    </div>
  </div>
</template>
