<template>
  <div class="flex flex-col h-full bg-white rounded-lg shadow">
    <!-- Filters Section -->
    <div class="p-4 border-b space-y-4">
      <!-- Search and Date Range -->
      <div class="flex gap-4">
        <div class="flex-1 relative">
          <Icon
            name="mdi:magnify"
            class="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
          />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search errors..."
            class="pl-10 w-full h-9 bg-gray-50 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <PrimeCalendar
          v-model="dateRange"
          selectionMode="range"
          class="h-9"
          :showIcon="true"
          dateFormat="yy-mm-dd"
          @date-select="handleDateRangeChange"
        />
      </div>

      <!-- Service and Severity Filters -->
      <div class="flex gap-4">
        <div class="flex-1 flex flex-wrap gap-2">
          <PrimeButton
            v-for="service in services"
            :key="service"
            :class="[
              'p-button-rounded p-button-sm',
              selectedServices.includes(service) ? 'p-button-info' : 'p-button-secondary',
            ]"
            @click="toggleService(service)"
          >
            {{ service }}
          </PrimeButton>
        </div>
        <div class="flex gap-2">
          <PrimeButton
            v-for="severity in severities"
            :key="severity"
            :class="[
              'p-button-rounded p-button-sm',
              `p-button-${getSeverityClass(severity)}`,
              selectedSeverities.includes(severity) ? '' : 'p-button-outlined',
            ]"
            @click="toggleSeverity(severity)"
          >
            {{ severity }}
          </PrimeButton>
        </div>
      </div>
    </div>

    <!-- Logs List -->
    <div class="flex-1 overflow-auto">
      <div class="divide-y">
        <div
          v-for="log in filteredLogs"
          :key="log.id"
          class="p-4 hover:bg-gray-50"
        >
          <div class="flex items-start justify-between mb-2">
            <div class="flex items-center gap-2">
              <PrimeTag
                :severity="getSeverityClass(log.severity)"
                :value="log.severity"
              />
              <span class="text-sm font-medium text-gray-900">
                {{ log.service_name }}
              </span>
            </div>
            <span class="text-sm text-gray-500">
              {{ formatDate(log.created_at) }}
            </span>
          </div>
          <p class="text-sm text-gray-900 mb-2">{{ log.message }}</p>
          <pre
            v-if="log.stack_trace"
            class="text-xs bg-gray-50 p-2 rounded overflow-x-auto"
            >{{ log.stack_trace }}</pre
          >
          <div
            v-if="log.metadata || log.context"
            class="mt-2 text-xs text-gray-500"
          >
            <div class="grid grid-cols-2 gap-4">
              <div v-if="log.metadata && Object.keys(log.metadata).length > 0">
                <strong>Metadata:</strong>
                <pre class="mt-1 bg-gray-50 p-2 rounded">{{
                  JSON.stringify(log.metadata, null, 2)
                }}</pre>
              </div>
              <div v-if="log.context && Object.keys(log.context).length > 0">
                <strong>Context:</strong>
                <pre class="mt-1 bg-gray-50 p-2 rounded">{{
                  JSON.stringify(log.context, null, 2)
                }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary Footer -->
    <div class="p-4 border-t bg-gray-50">
      <span class="text-sm text-gray-600">
        Showing {{ filteredLogs.length }} of {{ errorLogs.length }} errors
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { format } from 'date-fns'

const searchQuery = ref('')
const selectedServices = ref([])
const selectedSeverities = ref([])
const dateRange = ref(null)

const services = computed(() => [...new Set(errorLogs.value.map((log) => log.service_name))])

const severities = computed(() => [...new Set(errorLogs.value.map((log) => log.severity))])

const filteredLogs = computed(() => {
  return errorLogs.value.filter((log) => {
    const searchMatch =
      !searchQuery.value ||
      log.message.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      log.service_name.toLowerCase().includes(searchQuery.value.toLowerCase())

    const serviceMatch =
      selectedServices.value.length === 0 || selectedServices.value.includes(log.service_name)

    const severityMatch =
      selectedSeverities.value.length === 0 || selectedSeverities.value.includes(log.severity)

    const dateMatch =
      !dateRange.value ||
      ((!dateRange.value[0] || new Date(log.created_at) >= dateRange.value[0]) &&
        (!dateRange.value[1] || new Date(log.created_at) <= dateRange.value[1]))

    return searchMatch && serviceMatch && severityMatch && dateMatch
  })
})

const getSeverityClass = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'danger'
    case 'high':
      return 'warning'
    case 'medium':
      return 'info'
    case 'low':
      return 'success'
    default:
      return 'secondary'
  }
}

const toggleService = (service: string) => {
  if (selectedServices.value.includes(service)) {
    selectedServices.value = selectedServices.value.filter((s) => s !== service)
  } else {
    selectedServices.value.push(service)
  }
}

const toggleSeverity = (severity: string) => {
  if (selectedSeverities.value.includes(severity)) {
    selectedSeverities.value = selectedSeverities.value.filter((s) => s !== severity)
  } else {
    selectedSeverities.value.push(severity)
  }
}

const formatDate = (date: string) => {
  return format(new Date(date), 'MMM d, yyyy HH:mm:ss')
}

const handleDateRangeChange = () => {
  errorDashboard.setDate(dateRange.value[0])
}
</script>
