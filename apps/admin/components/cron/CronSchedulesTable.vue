<template>
  <PrimeDataTable>
    <PrimeColumn header="Actions">
      <template #body="{ data }">
        <div class="flex gap-2">
          <PrimeButton
            v-tooltip.top="'Run Now'"
            severity="success"
            rounded
            size="small"
            :loading="triggeringJob === data.name"
            @click="$emit('trigger-job', data.name, data)"
          >
            <Icon name="mdi:play" />
          </PrimeButton>
          <PrimeButton
            v-tooltip.top="'Edit Schedule'"
            severity="info"
            rounded
            size="small"
            @click="$emit('edit-schedule', data)"
          >
            <Icon name="mdi:pencil" />
          </PrimeButton>
          <PrimeButton
            v-tooltip.top="'Disable Schedule'"
            :severity="data.enabled ? 'warning' : 'success'"
            rounded
            size="small"
            @click="$emit('toggle-schedule', data)"
          >
            <Icon :name="data.enabled ? 'mdi:pause' : 'mdi:play'" />
          </PrimeButton>
        </div>
      </template>
    </PrimeColumn>
  </PrimeDataTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import cronstrue from 'cronstrue'

const props = defineProps<{
  schedules: any[]
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'edit-schedule' | 'toggle-schedule', schedule: any): void
  (e: 'trigger-job', name: string, data: any): void
}>()

const triggeringJob = ref<string | null>(null)

const formatCron = (expression: string) => {
  try {
    return cronstrue.toString(expression)
  } catch {
    return expression
  }
}

const getNextRun = (cronExpression: string) => {
  // Add later.js or similar for accurate next run calculation
  const now = new Date()
  if (cronExpression === '*/15 * * * *') {
    const next = new Date(Math.ceil(now.getTime() / 900000) * 900000)
    const diff = next.getTime() - now.getTime()
    return `in ${Math.round(diff / 60000)}m`
  }
  return 'Calculating...'
}

const getScheduleStatus = (schedule: any) => {
  if (!schedule.enabled) return 'Disabled'
  if (schedule.last_run) {
    const lastRun = new Date(schedule.last_run)
    const diff = Date.now() - lastRun.getTime()
    if (diff > 3600000) return 'Late' // More than 1 hour
    return 'Active'
  }
  return 'Pending'
}

const getScheduleStatusSeverity = (schedule: any) => {
  if (!schedule.enabled) return 'secondary'
  if (schedule.last_run) {
    const lastRun = new Date(schedule.last_run)
    const diff = Date.now() - lastRun.getTime()
    if (diff > 3600000) return 'warning'
    return 'success'
  }
  return 'info'
}

const formatMs = (ms: number) => {
  if (!ms) return '-'
  return ms < 1000 ? `${ms}ms` : `${ms / 1000}s`
}
</script>
