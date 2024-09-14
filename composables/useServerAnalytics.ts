import { defineStore } from 'pinia'
import { ref, reactive, onUnmounted, watchEffect } from 'vue'

export const useServerAnalyticsStore = defineStore('serverAnalytics', () => {
  const company = reactive({})
  const queue = reactive({})
  const performance = reactive({})
  const news_links = reactive({})

  const availableMetrics = ref<string[]>([])

  const isConnected = ref(false)
  const haveMetrics = ref(false)

  const socket = ref<WebSocket | null>(null)
  const reconnectAttempts = ref(0)
  const maxReconnectAttempts = 5
  const reconnectInterval = 3000 // 3 seconds

  function updateMetrics(newData: any) {
    console.log('Updating metrics with:', newData)
    Object.entries(newData).forEach(([key, value]) => {
      const targetMetric = {
        company,
        performance,
        news_links,
        queue,
      }[key as keyof typeof newData]

      if (targetMetric && Array.isArray(value)) {
        value.forEach((metric: any) => {
          if (metric.name && metric.value !== undefined) {
            targetMetric[metric.name] = metric.value
            if (metric.metadata) {
              targetMetric[`${metric.name}_metadata`] = metric.metadata
            }
          }
        })
      }
    })
    haveMetrics.value = true
  }

  function setAvailableMetrics(metrics: string[]) {
    availableMetrics.value = metrics
  }

  function setConnectionStatus(status: boolean) {
    isConnected.value = status
  }

  function getMetricsByType(type: string) {
    return {
      company,
      news_links,
      performance,
      queue,
    }[type]
  }

  function getAllMetrics() {
    return {
      company,
      news_links,
      performance,
      queue,
    }
  }

  function connectWebSocket() {
    console.log('Attempting to connect WebSocket...')
    if (socket.value?.readyState === WebSocket.OPEN) {
      console.log('WebSocket is already open')
      return
    }

    socket.value = new WebSocket(`ws://${window.location.host}/api/admin/server-jobs`)

    socket.value.onopen = () => {
      console.log('WebSocket connection established')
      setConnectionStatus(true)
      reconnectAttempts.value = 0
    }

    socket.value.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log('Received message from Analytics server:', data)
      if (data.type === 'availableMetrics') {
        setAvailableMetrics(data.metrics)
      } else if (data.type === 'error') {
        console.error('WebSocket error:', data.message)
      } else if (data.domain && data.metrics) {
        console.log('Updating metrics:', data)
        updateMetrics({ [data.domain]: data.metrics })
      } else {
        console.warn('Received unexpected data structure:', data)
      }
    }

    socket.value.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    socket.value.onclose = () => {
      console.log('WebSocket connection closed')
      setConnectionStatus(false)
      reconnect()
    }
  }

  function reconnect() {
    if (reconnectAttempts.value < maxReconnectAttempts) {
      reconnectAttempts.value++
      console.log(`Attempting to reconnect (${reconnectAttempts.value}/${maxReconnectAttempts})...`)
      setTimeout(connectWebSocket, reconnectInterval)
    } else {
      console.log('Max reconnect attempts reached. Please refresh the page.')
    }
  }

  function disconnectWebSocket() {
    if (socket.value) {
      socket.value.close()
      socket.value = null
      setConnectionStatus(false)
    }
  }

  function subscribeToMetrics(metricTypes: string[]) {
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      socket.value.send(
        JSON.stringify({
          action: 'subscribe',
          metrics: metricTypes,
        }),
      )
    }
  }

  function unsubscribeFromMetrics(metricTypes: string[]) {
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      socket.value.send(
        JSON.stringify({
          action: 'unsubscribe',
          metrics: metricTypes,
        }),
      )
    }
  }

  watchEffect(() => {
    if (!socket.value || socket.value.readyState !== WebSocket.OPEN) {
      connectWebSocket()
    }
  })

  onUnmounted(() => {
    disconnectWebSocket()
  })

  return {
    queue,
    company,
    news_links,
    performance,
    availableMetrics,
    isConnected,
    haveMetrics,
    connectWebSocket,
    disconnectWebSocket,
    subscribeToMetrics,
    unsubscribeFromMetrics,
    getMetricsByType,
    getAllMetrics,
  }
})
