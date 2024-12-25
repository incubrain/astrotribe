<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { format } from 'date-fns'

interface ErrorLog {
  id: string
  service_name: string
  error_type: string
  severity: string
  message: string
  stack_trace?: string
  metadata?: Record<string, any>
  context?: Record<string, any>
  created_at: string
}

interface PaginatedResponse {
  logs: ErrorLog[]
  total: number
  totalPages: number
  currentPage: number
}

// Data refs
const searchQuery = ref('')
const selectedServices = ref<string[]>([])
const selectedSeverities = ref<string[]>([])
const errorLogs = ref<ErrorLog[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(50)
const totalPages = ref(0)
const totalLogs = ref(0)

// Fetch function
const { fetch } = useBaseFetch()

function getDefaultDateRange(): [Date, Date] {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 7)
  return [start, end]
}

const dateRange = ref<[Date, Date]>(getDefaultDateRange())

async function fetchErrorLogs() {
  loading.value = true
  try {
    const query = {
      page: currentPage.value,
      pageSize: pageSize.value,
      ...(selectedSeverities.value.length && { severity: selectedSeverities.value[0] }),
      ...(selectedServices.value.length && { service: selectedServices.value[0] }),
      from: dateRange.value[0].toISOString(),
      to: dateRange.value[1].toISOString(),
    }

    console.log('Fetching logs with query:', query)

    const response = await fetch<PaginatedResponse>('/api/error/logs', {
      query,
    })

    console.log('Logs response:', response)

    if (response?.data) {
      errorLogs.value = response.data.logs
      totalPages.value = response.data.totalPages
      totalLogs.value = response.data.total
      currentPage.value = response.data.currentPage
    } else {
      console.warn('No data in response:', response)
    }
  } catch (error: any) {
    console.error('Failed to fetch error logs:', error)
  } finally {
    loading.value = false
  }
}

const selectedDate = ref<Date>(new Date())

// Watch for filter changes
watch([selectedServices, selectedSeverities, dateRange], () => {
  currentPage.value = 1 // Reset to first page when filters change
  fetchErrorLogs()
})

// Format date helper
const formatDate = (date: string) => {
  return format(new Date(date), 'MMM d, yyyy HH:mm:ss')
}

// Computed properties
const services = computed(() => [...new Set(errorLogs.value.map((log) => log.service_name))])
const severities = computed(() => [...new Set(errorLogs.value.map((log) => log.severity))])

// Search filter
const filteredLogs = computed(() => {
  if (!searchQuery.value) return errorLogs.value

  return errorLogs.value.filter((log) => {
    return (
      log.message.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      log.service_name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })
})

// Pagination handlers
const handlePageChange = (newPage: number) => {
  currentPage.value = newPage
  fetchErrorLogs()
}

// Style helper for severity badges
const getSeverityStyles = (severity: string) => {
  const styles = {
    critical: 'bg-red-500/20 text-red-300 border border-red-500/30',
    high: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
    medium: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
    low: 'bg-green-500/20 text-green-300 border border-green-500/30',
  }

  return styles[severity.toLowerCase()] || 'bg-zinc-800 text-zinc-300'
}

const expandedLogId = ref<string | null>(null)

const toggleLogExpansion = (logId: string) => {
  expandedLogId.value = expandedLogId.value === logId ? null : logId
}

onMounted(() => {
  fetchErrorLogs()
})
</script>

<template>
  <div class="flex flex-col text-white">
    <!-- Compact Header with Search and Filters -->
    <div class="p-4 border-b border-zinc-800">
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
              :class="[
                'px-2 py-0.5 rounded text-xs font-medium',
                getSeverityStyles(slotProps.option),
              ]"
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

    <!-- Loading State -->
    <div
      v-if="loading"
      class="flex-1 flex items-center justify-center"
    >
      <PrimeProgressSpinner />
    </div>

    <!-- Error Logs List -->
    <div
      v-else
      class="flex-1 overflow-auto"
    >
      <div class="divide-y divide-zinc-800">
        <div
          v-for="log in filteredLogs"
          :key="log.id"
          class="hover:bg-zinc-800/50 transition-colors cursor-pointer"
          @click="toggleLogExpansion(log.id)"
        >
          <!-- Compact Row -->
          <div class="px-4 py-2 flex items-center gap-4">
            <span
              :class="[
                'px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap',
                getSeverityStyles(log.severity),
              ]"
            >
              {{ log.severity }}
            </span>

            <span class="text-sm font-medium text-zinc-200 whitespace-nowrap">
              {{ log.service_name }}
            </span>

            <span class="text-sm text-zinc-400 whitespace-nowrap">
              {{ log.error_type }}
            </span>

            <span class="text-sm text-zinc-300 flex-1 truncate">
              {{ log.message }}
            </span>

            <span class="text-sm text-zinc-400 whitespace-nowrap ml-4">
              {{ formatDate(log.created_at) }}
            </span>

            <Icon
              :name="expandedLogId === log.id ? 'mdi:chevron-up' : 'mdi:chevron-down'"
              class="h-4 w-4 text-zinc-400"
            />
          </div>

          <!-- Expanded Details -->
          <div
            v-if="expandedLogId === log.id"
            class="px-4 py-4 bg-zinc-800/30 border-t border-zinc-800"
          >
            <!-- Stack Trace -->
            <div
              v-if="log.stack_trace"
              class="mb-4"
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
    </div>

    <!-- Footer with Pagination -->
    <div class="p-4 border-t border-zinc-800 bg-zinc-900/50">
      <div class="flex items-center justify-between">
        <span class="text-sm text-zinc-400">
          Showing {{ filteredLogs.length }} of {{ totalLogs }} errors
        </span>
        <PrimePaginator
          v-model:current-page="currentPage"
          :rows="pageSize"
          :total-records="totalLogs"
          :template="{
            FirstPageLink: 'mdi:chevron-double-left',
            PrevPageLink: 'mdi:chevron-left',
            NextPageLink: 'mdi:chevron-right',
            LastPageLink: 'mdi:chevron-double-right',
          }"
          @page-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* PrimeVue MultiSelect customization */
:deep(.p-multiselect),
:deep(.p-calendar) {
  background: rgb(39 39 42);
  border: 1px solid rgb(63 63 70);
  color: white;
}

:deep(.p-multiselect:hover),
:deep(.p-calendar:hover) {
  border-color: rgb(82 82 91);
}

:deep(.p-multiselect-label),
:deep(.p-calendar-label) {
  color: white;
}

:deep(.p-multiselect-trigger),
:deep(.p-calendar-trigger) {
  color: rgb(161 161 170);
}

:deep(.p-multiselect-panel),
:deep(.p-calendar-panel) {
  background: rgb(39 39 42);
  border: 1px solid rgb(63 63 70);
}

:deep(.p-multiselect-item),
:deep(.p-calendar-item) {
  color: white;
}

:deep(.p-multiselect-item:hover),
:deep(.p-calendar-item:hover) {
  background: rgb(63 63 70);
}

:deep(.p-multiselect-item.p-highlight),
:deep(.p-calendar-item.p-highlight) {
  background: rgb(59 130 246);
}

/* Paginator customization */
:deep(.p-paginator) {
  background: transparent;
  border: none;
}

:deep(.p-paginator .p-paginator-page) {
  color: white;
}

:deep(.p-paginator .p-paginator-page.p-highlight) {
  background: rgb(59 130 246);
}

:deep(.p-paginator .p-paginator-first),
:deep(.p-paginator .p-paginator-prev),
:deep(.p-paginator .p-paginator-next),
:deep(.p-paginator .p-paginator-last) {
  color: white;
}
</style>
