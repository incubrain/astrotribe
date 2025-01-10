// composables/useErrorLogs.ts
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { io, type Socket } from 'socket.io-client'
import { useRuntimeConfig } from 'nuxt/app'

// Keep your existing interfaces
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

interface ErrorLogFilters {
  service?: string
  severity?: string
  from?: string
  to?: string
  page?: number
  pageSize?: number
}

export function useErrorLogs() {
  if (!import.meta.client) {
    return
  }

  // State
  const logs = ref<ErrorLog[]>([])
  const loading = ref(false)
  const currentPage = ref(1)
  const pageSize = ref(50)
  const totalPages = ref(0)
  const totalLogs = ref(0)
  const expandedLogId = ref<string | null>(null)
  const socket = ref<Socket | null>(null)
  const isConnected = ref(false)
  const lastError = ref<Error | null>(null)

  // Config
  const config = useRuntimeConfig()
  const { fetch } = useBaseFetch()

  // Initialize socket with filter support
  function initializeSocket(initialFilters?: ErrorLogFilters) {
    if (socket.value) return

    socket.value = io(`${config.public.apiURL}`, {
      path: '/log-stream', // Match the path in SocketAdapter
      transports: ['websocket', 'polling'],
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      withCredentials: true,
      extraHeaders: {
        'Access-Control-Allow-Credentials': 'true',
      },
    })

    socket.value.on('connect', () => {
      console.log('Connected to log stream')
      if (initialFilters) {
        subscribeToLogs(initialFilters)
      }
    })

    socket.value.on('connection_status', (status) => {
      console.log('Connection status:', status)
      isConnected.value = status.status === 'connected'
    })

    socket.value.on('disconnect', () => {
      console.log('Disconnected from log stream')
      isConnected.value = false
    })

    socket.value.on('newLog', (log: ErrorLog) => {
      // Changed event name to match gateway
      console.log('Received new log:', log)
      addNewLog(log)
    })

    socket.value.on('connect_error', (error: Error) => {
      console.error('Connection error:', error)
      lastError.value = error
      isConnected.value = false
    })

    socket.value.onAny((event, ...args) => {
      console.debug('Socket event:', event, args)
    })
  }

  // Subscribe to logs with filters
  function subscribeToLogs(filters: ErrorLogFilters) {
    if (socket.value && socket.value.connected) {
      socket.value.emit(
        'subscribe',
        {
          service: filters.service,
          severity: filters.severity,
          startTime: filters.from,
          endTime: filters.to,
        },
        (response: any) => {
          console.log('Subscription response:', response)
        },
      )
    }
  }

  // Close socket connection
  function closeSocket() {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
      isConnected.value = false
    }
  }

  // Fetch function
  async function fetchLogs(filters: ErrorLogFilters) {
    loading.value = true
    try {
      const response = await fetch<PaginatedResponse>('/api/error/logs', {
        query: {
          page: currentPage.value,
          pageSize: pageSize.value,
          ...filters,
        },
      })

      if (response?.data) {
        logs.value = response.data.logs
        totalPages.value = response.data.totalPages
        totalLogs.value = response.data.total
        currentPage.value = response.data.currentPage
      }
    } catch (error: any) {
      console.error('Failed to fetch error logs:', error)
    } finally {
      loading.value = false
    }
  }

  function addNewLog(log: ErrorLog) {
    console.info('Adding new log:', { log })

    // Ensure log has all required fields
    const validatedLog = {
      ...log,
      severity: log.severity || 'low',
      service_name: log.service_name || 'unknown',
      error_type: log.error_type || 'unknown',
    }

    logs.value.unshift(validatedLog)
    if (logs.value.length > pageSize.value) {
      logs.value.pop()
    }
    totalLogs.value++
  }

  // Computed properties
  const services = computed(() => [...new Set(logs.value.map((log) => log.service_name))])
  const severities = computed(() => [...new Set(logs.value.map((log) => log.severity))])

  // Utility functions
  const toggleLogExpansion = (logId: string) => {
    expandedLogId.value = expandedLogId.value === logId ? null : logId
  }

  return {
    // State
    logs,
    loading,
    currentPage,
    pageSize,
    totalPages,
    totalLogs,
    expandedLogId,
    isConnected,
    lastError,

    // Computed
    services,
    severities,

    // Methods
    fetchLogs,
    toggleLogExpansion,
    addNewLog,
    initializeSocket,
    subscribeToLogs,
    closeSocket,

    // Socket access (if needed)
    socket: computed(() => socket.value),
  }
}
