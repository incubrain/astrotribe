<template>
  <div class="card p-4">
    <div class="mb-4 flex gap-4">
      <PrimeInputText
        id="apiUrl"
        v-model="baseUrl"
        class="w-full"
      />

      <PrimeButton
        @click="testConnection"
        :loading="isLoading"
        severity="info"
        class="text-nowrap"
      >
        Test Connection
      </PrimeButton>
    </div>

    <!-- Endpoints List -->
    <PrimeDataView :value="endpoints">
      <template #list="slotProps">
        <div class="flex flex-col">
          <div
            v-for="(endpoint, index) in slotProps.items"
            :key="endpoint.path"
          >
            <div
              class="flex flex-col p-6 gap-4"
              :class="{ 'border-t border-surface-200 dark:border-surface-700': index !== 0 }"
            >
              <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div class="flex items-center gap-3">
                  <PrimeTag
                    :value="endpoint.method"
                    :severity="getMethodSeverity(endpoint.method)"
                  />
                  <div class="flex flex-col">
                    <span class="font-medium text-lg">{{ endpoint.path }}</span>
                    <span class="text-surface-500">{{
                      endpoint.description || 'No description available'
                    }}</span>
                  </div>
                </div>
                <PrimeButton
                  @click="testEndpoint(endpoint)"
                  :loading="endpoint.isLoading"
                  label="Test Endpoint"
                  size="small"
                />
              </div>

              <!-- Response Section -->
              <div
                v-if="endpoint.response"
                class="mt-2"
              >
                <PrimeMessage :severity="getResponseSeverity(endpoint.response.status)">
                  <div class="w-full flex flex-row items-center gap-2">
                    <Icon
                      name="mdi:information"
                      class="flex"
                    />
                    <p class="font-medium">Status: {{ endpoint.response.status }}</p>
                  </div>
                </PrimeMessage>
                <div
                  class="whitespace-pre-wrap text-sm p-4 rounded-lg overflow-x-auto max-h-96 overflow-scroll"
                >
                  <code>{{ formattedResponse(endpoint.responseStr) }}</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </PrimeDataView>

    <!-- Response Log -->
    <PrimeAccordion
      v-if="logs.length"
      class="mt-4"
    >
      <PrimeAccordionPanel value="0">
        <PrimeAccordionHeader>
          <div class="flex items-center gap-2">
            <Icon name="mdi:format-list-bulleted" />
            <span>Request Log</span>
            <PrimeBadge
              :value="logs.length.toString()"
              severity="info"
            />
          </div>
        </PrimeAccordionHeader>
        <PrimeAccordionContent>
          <div class="w-full h-[200px] rounded-lg border border-color relative overflow-auto">
            <div
              v-for="(log, index) in logs"
              :key="index"
              class="p-2 border-b flex items-center gap-2"
            >
              <Icon name="mdi:information" />
              <span class="font-mono text-sm">{{ log }}</span>
            </div>
          </div>
        </PrimeAccordionContent>
      </PrimeAccordionPanel>
    </PrimeAccordion>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const env = useRuntimeConfig().public

const notification = useNotification()
const baseUrl = ref(env.apiUrl ?? 'http://localhost:3030')
const isLoading = ref(false)
const logs = ref([])
const supabase = useSupabaseClient()

// Create authenticated API instance
const createApi = () => {
  return $fetch.create({
    baseURL: baseUrl.value,
    async onRequest({ options }) {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.access_token) {
        throw new Error('No authentication session found')
      }

      // Add all required headers
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    },
    // Add error handling
    onResponseError({ response }) {
      switch (response.status) {
        case 401:
          addLog('Authentication failed: Invalid or expired token')
          break
        case 403:
          addLog('Authorization failed: Insufficient permissions')
          break
        default:
          addLog(`Request failed with status: ${response.status}`)
      }
    },
  })
}

// Add session check before making requests
const checkSession = async () => {
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

// Enhanced endpoints with descriptions
const endpoints = ref([
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
    path: '/api/v1/health',
    description: 'Check API health status',
    isLoading: false,
    responseStr: '',
    response: null,
  },
])

// Your existing helper methods remain the same
const getMethodSeverity = (method) => {
  const severities = {
    GET: 'info',
    POST: 'success',
    PUT: 'warning',
    DELETE: 'danger',
  }
  return severities[method] || 'info'
}

const getResponseSeverity = (status) => {
  if (status >= 200 && status < 300) return 'success'
  if (status >= 300 && status < 400) return 'info'
  if (status >= 400 && status < 500) return 'warning'
  return 'danger'
}

const addLog = (message) => {
  const timestamp = new Date().toISOString()
  logs.value.unshift(`[${timestamp}] ${message}`)
}

const testConnection = async () => {
  try {
    isLoading.value = true
    const api = createApi()
    const data = await api('/api/v1/health')
    addLog(`Health check: Success`)

    notification.success({
      summary: 'Connection Test',
      message: 'Connection established successfully',
    })
  } catch (error: any) {
    addLog(`Error: ${error.message}`)
    notification.error({
      summary: 'Connection Test',
      message: error.message,
    })
  } finally {
    isLoading.value = false
  }
}

const testEndpoint = async (endpoint) => {
  if (!(await checkSession())) return

  try {
    endpoint.isLoading = true
    addLog(`Testing ${endpoint.method} ${endpoint.path}`)

    const api = createApi()
    const data = await api(endpoint.path, {
      method: endpoint.method,
    })

    console.log('returned data', data)

    endpoint.response = {
      status: 200,
      data,
    }
    endpoint.responseStr = JSON.stringify(data, null, 2)

    addLog(`Response: 200 OK`)
    notification.success({
      summary: 'API Response',
      message: `Successfully received response from ${endpoint.path}`,
    })
  } catch (error: any) {
    addLog(`Error: ${error.message}`)
    endpoint.response = {
      status: error.status || 'Error',
      data: { error: error.message },
    }
    endpoint.responseStr = JSON.stringify(endpoint.response.data, null, 2)
    notification.error({
      summary: 'API Error',
      message: error.message,
    })
  } finally {
    endpoint.isLoading = false
  }
}

const formattedResponse = (output: any): string => {
  console.info('RAW_OUTPUT', output)
  // If output is already an object, stringify it
  if (typeof output === 'object' && output !== null) {
    return JSON.stringify(output, null, 2)
  }

  // Ensure we're working with a string
  const str = String(output)

  try {
    // Step 1: Try parsing as-is first
    try {
      const parsed = JSON.parse(str)
      return JSON.stringify(parsed, null, 2)
    } catch (e) {
      // Continue to cleaning steps if direct parse fails
    }

    // Step 2: Clean the string
    const cleanStr = str
      // Fix newlines
      .replace(/\\n/g, '\n')
      // Fix quotes
      .replace(/\\"/g, '"')
      // Remove extra backslashes before quotes
      .replace(/\\+"/g, '"')
      // Remove standalone backslashes
      .replace(/([^\\])\\([^"\\])/g, '$1$2')
      // Fix double escaped unicode
      .replace(/\\\\u/g, '\\u')
      // Remove any remaining consecutive backslashes
      .replace(/\\+/g, '\\')
      // Trim whitespace
      .trim()

    // Step 3: Handle potential leading/trailing quotes
    if (cleanStr.startsWith('"') && cleanStr.endsWith('"')) {
      try {
        // If it's a quoted string, try parsing the inner content
        const innerContent = cleanStr.slice(1, -1)
        const parsed = JSON.parse(innerContent)
        return JSON.stringify(parsed, null, 2)
      } catch (e) {
        // If inner parsing fails, try the whole string
      }
    }

    // Step 4: Final parse attempt
    const parsed = JSON.parse(cleanStr)
    return JSON.stringify(parsed, null, 2)
  } catch (e) {
    console.error('JSON parsing error:', {
      error: e,
      originalString: str.slice(0, 100) + (str.length > 100 ? '...' : ''),
      attemptedClean: cleanStr?.slice(0, 100) + (cleanStr?.length > 100 ? '...' : ''),
    })

    // Return original string if all parsing attempts fail
    return str
  }
}
</script>
