// composables/useApi.ts
import { ref } from 'vue'
import { useRuntimeConfig } from '#app'

export function useApi() {
  const env = useRuntimeConfig().public
  const notification = useNotification()

  const url = ref<string>(String(env.apiURL ?? 'http://localhost:8080'))
  const logs = ref<string[]>([])

  const addLog = (message: string) => {
    const timestamp = new Date().toISOString()
    logs.value.unshift(`[${timestamp}] ${message}`)
  }

  const createApi = () => {
    return $fetch.create({
      baseURL: '/api/proxy',
      credentials: 'include',
      async onRequest({ options }) {
        options.headers = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': window.location.origin,
          'X-Target-URL': url.value,
        }
      },
      async onResponse({ response }) {
        const requestId = response.headers.get('X-Railway-Request-Id')
        if (requestId) {
          addLog(`Railway Request ID: ${requestId}`)
        }

        const protocol = response.headers.get('X-Forwarded-Proto')
        if (protocol !== 'https') {
          addLog('Warning: Connection not using HTTPS')
        }
      },

      onResponseError({ response }) {
        const message = `Request failed: ${response.status} - ${response.statusText}`
        addLog(message)
        notification.error({ summary: 'API Error', message })
      },
    })
  }

  const testEndpoint = async (
    path: string,
    options: {
      method: 'GET' | 'POST' | 'PUT' | 'DELETE'
      body?: any
    },
  ) => {
    try {
      const api = createApi()
      addLog(`Testing ${options.method} ${path}`)
      const response = await api(path, {
        ...options,
        credentials: 'include',
      })

      addLog(`${options.method} ${path}: 200 OK`)
      return response
    } catch (error: any) {
      addLog(`${options.method} ${path}: ${error.status || 500} Error - ${error.message}`)
      throw error
    }
  }

  return {
    url,
    logs,
    addLog,
    createApi,
    testEndpoint,
  }
}
