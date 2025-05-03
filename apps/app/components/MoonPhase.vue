<script setup lang="ts">
const props = defineProps({
  date: {
    type: Date,
    required: true,
  },
})

const getMoonPhase = (date) => {
  const synodicMonth = 29.53059
  const refDate = new Date('2023-01-01')
  const daysSinceRef = (date - refDate) / (24 * 60 * 60 * 1000)
  const phase = (daysSinceRef % synodicMonth) / synodicMonth

  if (phase < 0.025 || phase > 0.975) return '🌑' // New Moon
  if (phase < 0.225) return '🌒' // Waxing Crescent
  if (phase < 0.275) return '🌓' // First Quarter
  if (phase < 0.475) return '🌔' // Waxing Gibbous
  if (phase < 0.525) return '🌕' // Full Moon
  if (phase < 0.725) return '🌖' // Waning Gibbous
  if (phase < 0.775) return '🌗' // Last Quarter
  return '🌘' // Waning Crescent
}

// Add tooltip descriptions for accessibility
const getMoonPhaseDescription = (phase) => {
  switch (phase) {
    case '🌑':
      return 'New Moon'
    case '🌒':
      return 'Waxing Crescent'
    case '🌓':
      return 'First Quarter'
    case '🌔':
      return 'Waxing Gibbous'
    case '🌕':
      return 'Full Moon'
    case '🌖':
      return 'Waning Gibbous'
    case '🌗':
      return 'Last Quarter'
    case '🌘':
      return 'Waning Crescent'
    default:
      return 'Moon phase'
  }
}

const moonPhase = computed(() => getMoonPhase(props.date))
const phaseDescription = computed(() => getMoonPhaseDescription(moonPhase.value))
</script>

<template>
  <span
    v-tooltip="phaseDescription"
    class="moon-phase"
    >{{ moonPhase }}</span
  >
</template>

<style scoped>
.moon-phase {
  display: inline-block;
  font-size: 0.875rem;
  line-height: 1;
}
</style>
