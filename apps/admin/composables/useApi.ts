import { ref } from 'vue'
import { useRuntimeConfig } from '#app'

export function useApi() {
  const env = useRuntimeConfig().public
  const notification = useNotification()
  const supabase = useSupabaseClient()

  const url = ref<string>(String(env.apiURL ?? 'http://localhost:8080'))
  const logs = ref<string[]>([])

  const addLog = (message: string) => {
    const timestamp = new Date().toISOString()
    logs.value.unshift(`[${timestamp}] ${message}`)
  }

  const checkSession = async (): Promise<boolean> => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      notification.error({
        summary: 'Authentication Error',
        message: 'Please sign in to use the API.',
      })
      return false
    }
    return true
  }

  const createApi = () => {
    return $fetch.create({
      baseURL: url.value,
      credentials: 'include',
      async onRequest({ options }) {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session?.access_token) {
          throw new Error('No authentication session found')
        }

        options.headers = {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': window.location.origin,
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
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    body?: any,
  ) => {
    if (!(await checkSession())) return

    try {
      const api = createApi()
      addLog(`Testing ${method} ${path}`)
      const response = await api(path, {
        method,
        body,
        credentials: 'include',
      })

      addLog(`${method} ${path}: 200 OK`)
      return response
    } catch (error: any) {
      addLog(`${method} ${path}: ${error.status || 500} Error - ${error.message}`)
      throw error
    }
  }

  return {
    url,
    logs,
    addLog,
    createApi,
    checkSession,
    testEndpoint,
  }
}
