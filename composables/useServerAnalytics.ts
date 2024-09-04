import { defineStore } from 'pinia'
import { ref, reactive, onUnmounted, watchEffect } from 'vue'

export const useServerAnalyticsStore = defineStore('serverAnalytics', () => {
  const jobMetrics = reactive({})
  const spiderMetrics = reactive({})
  const paginationMetrics = reactive({})
  const blogPostScraperMetrics = reactive({})
  const resourceAnalytics = reactive({})
  const pageToMarkdownAnalytics = reactive({})
  const availableMetrics = ref<string[]>([])
  const isConnected = ref(false)
  const haveMetrics = ref(false)

  const socket = ref<WebSocket | null>(null)
  const reconnectAttempts = ref(0)
  const maxReconnectAttempts = 5
  const reconnectInterval = 3000 // 3 seconds

  function updateMetrics(newData: any) {
    Object.keys(newData).forEach((key) => {
      const targetMetric = {
        jobMetrics,
        spiderMetrics,
        paginationMetrics,
        blogPostScraperMetrics,
        resourceAnalytics,
        pageToMarkdownAnalytics
      }[key]

      if (targetMetric) {
        Object.assign(targetMetric, { ...targetMetric, ...newData[key] })
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
      jobMetrics,
      spiderMetrics,
      paginationMetrics,
      blogPostScraperMetrics,
      resourceAnalytics,
      pageToMarkdownAnalytics
    }[type]
  }

  function getAllMetrics() {
    return {
      jobMetrics,
      spiderMetrics,
      paginationMetrics,
      blogPostScraperMetrics,
      resourceAnalytics,
      pageToMarkdownAnalytics
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
      if (data.type === 'availableMetrics') {
        setAvailableMetrics(data.metrics)
      } else if (data.type === 'error') {
        console.error('WebSocket error:', data.message)
      } else {
        console.log('Updating metrics with:', data)
        updateMetrics(data)
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
          metrics: metricTypes
        })
      )
    }
  }

  function unsubscribeFromMetrics(metricTypes: string[]) {
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      socket.value.send(
        JSON.stringify({
          action: 'unsubscribe',
          metrics: metricTypes
        })
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
    jobMetrics,
    spiderMetrics,
    paginationMetrics,
    blogPostScraperMetrics,
    resourceAnalytics,
    pageToMarkdownAnalytics,
    availableMetrics,
    isConnected,
    haveMetrics,
    connectWebSocket,
    disconnectWebSocket,
    subscribeToMetrics,
    unsubscribeFromMetrics,
    getMetricsByType,
    getAllMetrics
  }
})
