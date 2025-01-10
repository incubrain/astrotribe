// components/error-logs/LogFilters.vue
<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  services: string[]
  severities: string[]
  loading: boolean
}>()

const getSeverityStyles = (severity: string) => {
  const styles = {
    critical: 'bg-red-500/20 text-red-300 border border-red-500/30',
    high: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
    medium: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
    low: 'bg-green-500/20 text-green-300 border border-green-500/30',
  }
  return styles[severity.toLowerCase()] || 'bg-zinc-800 text-zinc-300'
}

const emit = defineEmits<{
  (e: 'update:filters', filters: Record<string, any>): void
  (e: 'refresh'): void
}>()

const searchQuery = ref('')
const selectedServices = ref<string[]>([])
const selectedSeverities = ref<string[]>([])
const dateRange = ref<[Date, Date]>(getDefaultDateRange())

function getDefaultDateRange(): [Date, Date] {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 7)
  return [start, end]
}

watch([selectedServices, selectedSeverities, dateRange], () => {
  emit('update:filters', {
    service: selectedServices.value[0],
    severity: selectedSeverities.value[0],
    from: dateRange.value[0].toISOString(),
    to: dateRange.value[1].toISOString(),
  })
})
</script>

<template>
  <div class="flex items-center gap-4">
    <h1 class="text-xl font-medium whitespace-nowrap">Logs</h1>

    <!-- Search -->
    <div class="relative flex-1">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search errors..."
        class="w-full h-10 pl-10 pr-4 rounded-lg bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <Icon
        name="mdi:magnify"
        class="absolute left-3 top-3 h-4 w-4 text-zinc-400"
      />
    </div>

    <!-- Service MultiSelect -->
    <PrimeMultiSelect
      v-model="selectedServices"
      :options="services"
      placeholder="Filter services"
      class="w-64"
      display="chip"
    />

    <!-- Severity MultiSelect -->
    <PrimeMultiSelect
      v-model="selectedSeverities"
      :options="severities"
      placeholder="Filter severity"
      class="w-48"
      display="chip"
    >
      <template #value="slotProps">
        <div
          v-if="slotProps.value && slotProps.value.length > 0"
          class="flex gap-1"
        >
          <span
            v-for="severity in slotProps.value"
            :key="severity"
            :class="['px-2 py-0.5 rounded text-xs font-medium', getSeverityStyles(severity)]"
          >
            {{ severity }}
          </span>
        </div>
        <span
          v-else
          class="text-zinc-400"
          >Filter severity</span
        >
      </template>
      <template #option="slotProps">
        <span
          :class="['px-2 py-0.5 rounded text-xs font-medium', getSeverityStyles(slotProps.option)]"
        >
          {{ slotProps.option }}
        </span>
      </template>
    </PrimeMultiSelect>

    <!-- Date Range Picker -->
    <PrimeDatePicker
      v-model="dateRange"
      selectionMode="range"
      :showIcon="true"
      placeholder="Select date range"
      class="w-64"
    />

    <!-- Action Buttons -->
    <div class="flex gap-2">
      <PrimeButton
        :loading="loading"
        severity="secondary"
        class="px-3"
      >
        <Icon
          name="mdi:refresh"
          class="h-4 w-4"
        />
      </PrimeButton>
    </div>
  </div>
</template>
