<template>
  <div class="flex flex-col h-full bg-zinc-900 text-white">
    <!-- Compact Header with Search and Filters -->
    <div class="p-4 border-b border-zinc-800">
      <div class="flex items-center gap-4">
        <h1 class="text-xl font-medium whitespace-nowrap">Error Logs</h1>

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
                :class="[
                  'px-2 py-0.5 rounded text-xs font-medium',
                  getSeverityStyles(severity, true),
                ]"
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
              :class="[
                'px-2 py-0.5 rounded text-xs font-medium',
                getSeverityStyles(slotProps.option, true),
              ]"
            >
              {{ slotProps.option }}
            </span>
          </template>
        </PrimeMultiSelect>

        <!-- Action Buttons -->
        <div class="flex gap-2">
          <PrimeButton
            severity="danger"
            :loading="loading"
            class="px-4"
            @click="triggerTestError"
          >
            <template #icon>
              <Icon
                name="mdi:alert"
                class="mr-2 h-4 w-4"
              />
            </template>
            Test Error
          </PrimeButton>
          <PrimeButton
            severity="secondary"
            class="px-3"
            @click="fetchErrorLogs"
          >
            <Icon
              name="mdi:refresh"
              class="h-4 w-4"
            />
          </PrimeButton>
        </div>
      </div>
    </div>

    <!-- Error Logs List -->
    <div class="flex-1 overflow-auto">
      <div class="divide-y divide-zinc-800">
        <div
          v-for="log in filteredLogs"
          :key="log.id"
          class="p-6 hover:bg-zinc-800/50 transition-colors"
        >
          <!-- Header -->
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-3">
              <span
                :class="[
                  'px-2 py-0.5 rounded-full text-xs font-medium',
                  getSeverityStyles(log.severity, true),
                ]"
              >
                {{ log.severity }}
              </span>
              <span class="text-sm font-medium text-zinc-200">
                {{ log.service_name }}
              </span>
            </div>
            <span class="text-sm text-zinc-400">
              {{ formatDate(log.created_at) }}
            </span>
          </div>

          <!-- Message -->
          <p class="text-sm text-zinc-300 mb-3">{{ log.message }}</p>

          <!-- Stack Trace -->
          <div
            v-if="log.stack_trace"
            class="mb-3"
          >
            <div class="flex items-center gap-2 mb-2">
              <Icon
                name="mdi:console"
                class="h-4 w-4 text-zinc-400"
              />
              <span class="text-xs font-medium text-zinc-400">Stack Trace</span>
            </div>
            <pre class="text-xs bg-zinc-800/50 p-3 rounded-lg overflow-x-auto text-zinc-300">{{
              log.stack_trace
            }}</pre>
          </div>

          <!-- Metadata and Context -->
          <div
            v-if="log.metadata || log.context"
            class="grid grid-cols-2 gap-4"
          >
            <div
              v-if="log.metadata"
              class="space-y-2"
            >
              <div class="flex items-center gap-2">
                <Icon
                  name="mdi:information"
                  class="h-4 w-4 text-zinc-400"
                />
                <span class="text-xs font-medium text-zinc-400">Metadata</span>
              </div>
              <pre class="text-xs bg-zinc-800/50 p-3 rounded-lg overflow-x-auto text-zinc-300">{{
                JSON.stringify(log.metadata, null, 2)
              }}</pre>
            </div>
            <div
              v-if="log.context"
              class="space-y-2"
            >
              <div class="flex items-center gap-2">
                <Icon
                  name="mdi:code-tags"
                  class="h-4 w-4 text-zinc-400"
                />
                <span class="text-xs font-medium text-zinc-400">Context</span>
              </div>
              <pre class="text-xs bg-zinc-800/50 p-3 rounded-lg overflow-x-auto text-zinc-300">{{
                JSON.stringify(log.context, null, 2)
              }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="p-4 border-t border-zinc-800 bg-zinc-900/50">
      <span class="text-sm text-zinc-400">
        Showing {{ filteredLogs.length }} of {{ errorLogs.length }} errors
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { format } from 'date-fns'

// Data refs
const searchQuery = ref('')
const selectedServices = ref([])
const selectedSeverities = ref([])
const dateRange = ref(null)
const errorLogs = ref<any[]>([]) // Add this
const loading = ref(false)

// Fetch function
const { fetch } = useBaseFetch()

// Fetch error logs
async function fetchErrorLogs() {
  loading.value = true
  try {
    const response = await fetch('/api/error-logs', {
      query: {
        from: dateRange.value?.[0]?.toISOString(),
        to: dateRange.value?.[1]?.toISOString(),
      },
    })

    if (response?.data) {
      errorLogs.value = response.data
    }
  } catch (error) {
    console.error('Failed to fetch error logs:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (date: string) => {
  return format(new Date(date), 'MMM d, yyyy HH:mm:ss')
}

// Computed properties
const services = computed(() => [...new Set(errorLogs.value.map((log) => log.service_name))])

const severities = computed(() => [...new Set(errorLogs.value.map((log) => log.severity))])

// Filter logic gets simpler
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

// Style helper for severity badges
const getSeverityStyles = (severity: string, isSelected: boolean) => {
  const styles = {
    critical: 'bg-red-500/20 text-red-300 border border-red-500/30',
    high: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
    medium: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
    low: 'bg-green-500/20 text-green-300 border border-green-500/30',
  }

  return styles[severity] || 'bg-zinc-800 text-zinc-300'
}
</script>

<style scoped>
/* Add these styles to customize PrimeVue MultiSelect */
:deep(.p-multiselect) {
  background: rgb(39 39 42);
  border: 1px solid rgb(63 63 70);
  color: white;
}

:deep(.p-multiselect:hover) {
  border-color: rgb(82 82 91);
}

:deep(.p-multiselect-label) {
  color: white;
}

:deep(.p-multiselect-trigger) {
  color: rgb(161 161 170);
}

:deep(.p-multiselect-panel) {
  background: rgb(39 39 42);
  border: 1px solid rgb(63 63 70);
}

:deep(.p-multiselect-item) {
  color: white;
}

:deep(.p-multiselect-item:hover) {
  background: rgb(63 63 70);
}

:deep(.p-multiselect-item.p-highlight) {
  background: rgb(59 130 246);
}
</style>
