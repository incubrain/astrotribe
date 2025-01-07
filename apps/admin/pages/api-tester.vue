<!-- components/ApiTester.vue -->
<script setup lang="ts">
interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  description: string
  isLoading: boolean
  responseStr: string
  response: {
    status: number | string
    data: any
  } | null
}

interface ApiResponse {
  status: number | string
  data: any
}

const env = useRuntimeConfig().public
const notification = useNotification()
const supabase = useSupabaseClient()
const { testEndpoint: api } = useApi()

const customEndpoint = ref<Endpoint>({
  method: 'GET',
  path: '',
  description: 'Custom Endpoint',
  isLoading: false,
  responseStr: '',
  response: null,
})

const testCustomEndpoint = async () => {
  if (!customEndpoint.value.path.trim()) {
    notification.error({
      summary: 'Validation Error',
      message: 'Endpoint path cannot be empty.',
    })
    return
  }

  if (!(await checkSession())) return

  try {
    customEndpoint.value.isLoading = true
    addLog(`Testing custom ${customEndpoint.value.method} ${customEndpoint.value.path}`)

    const data = await api(customEndpoint.value.path, {
      method: customEndpoint.value.method,
    })

    customEndpoint.value.response = { status: 200, data }
    customEndpoint.value.responseStr = JSON.stringify(data, null, 2)

    addLog(`Custom ${customEndpoint.value.method} ${customEndpoint.value.path}: 200 OK`)
  } catch (error: any) {
    customEndpoint.value.response = {
      status: error.status || 500,
      data: { error: error.message },
    }
    customEndpoint.value.responseStr = JSON.stringify({ error: error.message }, null, 2)
    addLog(
      `Custom ${customEndpoint.value.method} ${customEndpoint.value.path}: ${error.status || 500} Error`,
    )
  } finally {
    customEndpoint.value.isLoading = false
  }
}

const url = ref<string>(String(env.apiURL ?? 'http://localhost:8080'))
const isLoading = ref<boolean>(false)
const logs = ref<string[]>([])

const endpoints = ref<Endpoint[]>([
  {
    method: 'GET',
    path: '/api/v1/feed-sources',
    description: 'Retrieve all feed sources',
    isLoading: false,
    responseStr: '',
    response: null,
  },
  {
    method: 'GET',
    path: '/api/v1/contents',
    description: 'Get all content items',
    isLoading: false,
    responseStr: '',
    response: null,
  },
  {
    method: 'GET',
    path: '/api/v1/payments/plans',
    description: 'Get all plans',
    isLoading: false,
    responseStr: '',
    response: null,
  },
  {
    method: 'GET',
    path: '/api/v1/health',
    description: 'Check API health status',
    isLoading: false,
    responseStr: '',
    response: null,
  },
  {
    method: 'GET',
    path: '/api/v1/job-metrics',
    description: 'Check Cron Job Metrics',
    isLoading: false,
    responseStr: '',
    response: null,
  },
])

const checkSession = async (): Promise<boolean> => {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    notification.error({
      summary: 'Authentication Error',
      message: 'Please sign in to use the API tester',
    })
    return false
  }
  return true
}

const getMethodStyles = (method: Endpoint['method']) => {
  const styles = {
    GET: 'bg-blue-500',
    POST: 'bg-green-500',
    PUT: 'bg-amber-500',
    DELETE: 'bg-red-500',
  }
  return styles[method] || 'bg-gray-500'
}

const getStatusColor = (status: number | string) => {
  const statusNum = Number(status)
  if (statusNum >= 200 && statusNum < 300) return 'text-green-500'
  if (statusNum >= 300 && statusNum < 400) return 'text-amber-500'
  if (statusNum >= 400 && statusNum < 500) return 'text-red-500'
  return 'text-gray-500'
}

const addLog = (message: string) => {
  const timestamp = new Date().toISOString()
  logs.value.unshift(`[${timestamp}] ${message}`)
}

const testConnection = async () => {
  if (!(await checkSession())) return

  try {
    isLoading.value = true
    await api('/api/v1/health', { method: 'GET' })

    addLog('Connection test successful')
    notification.success({
      summary: 'Success',
      message: 'API connection established',
    })
  } catch (error: any) {
    addLog(`Connection test failed: ${error.message}`)
  } finally {
    isLoading.value = false
  }
}

// ApiTester.vue
const testEndpoint = async (endpoint: Endpoint) => {
  if (!(await checkSession())) return

  try {
    endpoint.isLoading = true
    addLog(`Testing ${endpoint.method} ${endpoint.path}`)

    // Get current session from Supabase
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      throw new Error('No active Supabase session')
    }

    // Log the token info (safely)
    addLog(`Using token: ${session.access_token.substring(0, 10)}...`)

    const data = await api(endpoint.path, {
      method: endpoint.method,
    })

    endpoint.response = { status: 200, data }
    endpoint.responseStr = JSON.stringify(data, null, 2)

    addLog(`${endpoint.method} ${endpoint.path}: 200 OK`)
  } catch (error: any) {
    endpoint.response = {
      status: error.status || 500,
      data: { error: error.message },
    }
    endpoint.responseStr = JSON.stringify({ error: error.message }, null, 2)
    addLog(`${endpoint.method} ${endpoint.path}: ${error.status || 500} Error - ${error.message}`)
  } finally {
    endpoint.isLoading = false
  }
}

const formatResponse = (response: string): string => {
  try {
    return JSON.stringify(JSON.parse(response), null, 2)
  } catch {
    return response
  }
}
</script>

<template>
  <div class="h-full bg-gray-950 p-6">
    <div class="mx-auto max-w-7xl">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-white">API Tester</h1>
        <p class="mt-1 text-gray-400">Test and validate API endpoints</p>
      </div>

      <!-- URL Input -->
      <div class="mb-8 flex items-center gap-4">
        <div class="flex-1">
          <label
            for="apiURL"
            class="mb-2 block text-sm font-medium text-gray-400"
            >API URL</label
          >
          <input
            id="apiURL"
            v-model="url"
            type="text"
            class="w-full rounded-lg border border-gray-800 bg-gray-900 px-4 py-2.5 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
            placeholder="Enter API URL"
          />
        </div>
        <button
          class="mt-6 flex h-10 items-center gap-2 rounded-lg bg-primary px-4 font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
          :disabled="isLoading"
          @click="testConnection"
        >
          <div
            v-if="isLoading"
            class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
          />
          <span>Test Connection</span>
        </button>
      </div>

      <div class="mb-8 rounded-lg bg-gray-900 p-4">
        <h3 class="mb-2 text-lg font-medium text-white">Test Custom Endpoint</h3>
        <div class="flex items-center gap-4">
          <!-- Method Dropdown -->
          <select
            v-model="customEndpoint.method"
            class="rounded-lg border border-gray-800 bg-gray-900 px-4 py-2 text-white"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>

          <!-- Path Input -->
          <input
            v-model="customEndpoint.path"
            type="text"
            class="flex-1 rounded-lg border border-gray-800 bg-gray-900 px-4 py-2 text-white placeholder-gray-500"
            placeholder="Enter endpoint path (e.g., /api/v1/custom)"
          />

          <!-- Test Button -->
          <button
            class="flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
            :disabled="customEndpoint.isLoading"
            @click="testCustomEndpoint"
          >
            <div
              v-if="customEndpoint.isLoading"
              class="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"
            ></div>
            <span>Test</span>
          </button>
        </div>

        <!-- Response Display -->
        <div
          v-if="customEndpoint.response"
          class="mt-4"
        >
          <div class="mb-2 flex items-center gap-2">
            <span class="text-sm font-medium text-gray-400">Response</span>
            <span :class="[getStatusColor(customEndpoint.response.status), 'text-sm font-medium']">
              Status: {{ customEndpoint.response.status }}
            </span>
          </div>
          <pre
            class="max-h-96 overflow-auto rounded-lg bg-gray-950 p-4 font-mono text-sm text-gray-300"
            >{{ formatResponse(customEndpoint.responseStr) }}</pre
          >
        </div>
      </div>

      <!-- Endpoints -->
      <div class="space-y-4">
        <div
          v-for="endpoint in endpoints"
          :key="endpoint.path"
          class="overflow-hidden rounded-lg bg-gray-900"
        >
          <div class="p-4">
            <!-- Endpoint Header -->
            <div class="flex items-start justify-between gap-4">
              <div class="flex items-start gap-3">
                <span
                  :class="[
                    getMethodStyles(endpoint.method),
                    'rounded px-2 py-1 text-xs font-medium text-white',
                  ]"
                >
                  {{ endpoint.method }}
                </span>
                <div>
                  <h3 class="font-mono text-white">{{ endpoint.path }}</h3>
                  <p class="mt-1 text-sm text-gray-400">{{ endpoint.description }}</p>
                </div>
              </div>
              <button
                @click="testEndpoint(endpoint)"
                :disabled="endpoint.isLoading"
                class="flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
              >
                <div
                  v-if="endpoint.isLoading"
                  class="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"
                />
                <span>Test</span>
              </button>
            </div>

            <!-- Response -->
            <div
              v-if="endpoint.response"
              class="mt-4"
            >
              <div class="mb-2 flex items-center gap-2">
                <span class="text-sm font-medium text-gray-400">Response</span>
                <span :class="[getStatusColor(endpoint.response.status), 'text-sm font-medium']">
                  Status: {{ endpoint.response.status }}
                </span>
              </div>
              <pre
                class="max-h-96 overflow-auto rounded-lg bg-gray-950 p-4 font-mono text-sm text-gray-300"
                >{{ formatResponse(endpoint.responseStr) }}</pre
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Logs -->
      <div
        v-if="logs.length"
        class="mt-8"
      >
        <div class="mb-2 flex items-center justify-between">
          <h2 class="text-lg font-medium text-white">Request Log</h2>
          <span class="rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-400">
            {{ logs.length }} entries
          </span>
        </div>
        <div class="max-h-48 overflow-auto rounded-lg bg-gray-900 p-4">
          <div
            v-for="(log, index) in logs"
            :key="index"
            class="py-1 text-sm text-gray-400"
          >
            {{ log }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional styles here */
</style>
