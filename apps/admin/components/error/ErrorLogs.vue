<script setup lang="ts">
import { ref, watch } from 'vue'

const {
  logs,
  loading,
  currentPage,
  pageSize,
  totalPages,
  totalLogs,
  expandedLogId,
  services,
  severities,
  isConnected,
  lastError,
  fetchLogs,
  toggleLogExpansion,
  addNewLog,
  initializeSocket,
  subscribeToLogs,
  closeSocket,
} = useErrorLogs()

watch(
  logs,
  (newLogs) => {
    console.log('Logs updated:', newLogs)
    newLogs.forEach((log, index) => {
      if (!log.severity) {
        logger.warn(`Log at index ${index} missing severity:`, log)
      }
    })
  },
  { deep: true },
)

/// Handle filters
const filters = ref<ErrorLogFilters>({})

const handleFilterUpdate = (newFilters: ErrorLogFilters) => {
  filters.value = newFilters
  fetchLogs(filters.value)
  subscribeToLogs(filters.value) // Changed to use subscribe method
}

// Handle pagination
const handlePageChange = (newPage: number) => {
  currentPage.value = newPage
  fetchLogs(filters.value)
}

// Lifecycle hooks
onMounted(() => {
  fetchLogs(filters.value)
  initializeSocket(filters.value)
})

onUnmounted(() => {
  closeSocket()
})

// Optional: Watch for reconnection to resubscribe
watch(isConnected, (newValue) => {
  if (newValue && filters.value) {
    subscribeToLogs(filters.value)
  }
})
</script>

<template>
  <div class="flex flex-col text-white">
    <!-- Connection Status -->
    <div
      v-if="!isConnected"
      class="bg-yellow-500/10 text-yellow-500 px-4 py-2 text-sm"
    >
      <span class="flex items-center gap-2">
        <i class="i-mdi:alert-circle" />
        Live updates disconnected
        <span
          v-if="lastError"
          class="text-yellow-500/75"
        >
          ({{ lastError.message }})
        </span>
      </span>
    </div>

    <div class="p-4 border-b border-zinc-800">
      <ErrorFilter
        :services="services"
        :severities="severities"
        :loading="loading"
        @update:filters="handleFilterUpdate"
        @refresh="fetchLogs(filters)"
      />
    </div>

    <!-- Loading State -->
    <div
      v-if="loading"
      class="flex-1 flex items-center justify-center"
    >
      <PrimeProgressSpinner />
    </div>

    <!-- Log List -->
    <div
      v-else
      class="flex-1 overflow-auto"
    >
      <div class="divide-y divide-zinc-800">
        <ErrorLog
          v-for="log in logs"
          :key="log.id"
          :log="log"
          :expanded="expandedLogId === log.id"
          @toggle="toggleLogExpansion(log.id)"
        />
      </div>
    </div>

    <!-- Footer -->
    <div class="p-4 border-t border-zinc-800 bg-zinc-900/50">
      <div class="flex items-center justify-between">
        <span class="text-sm text-zinc-400">
          Showing {{ logs.length }} of {{ totalLogs }} errors
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
