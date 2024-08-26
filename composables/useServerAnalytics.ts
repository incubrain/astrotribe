export function useServerAnalytics() {
  const socket = ref<WebSocket | null>(null)
  const metrics = reactive({
    jobMetrics: {},
    spiderMetrics: {},
    paginationMetrics: {},
    blogPostScraperMetrics: {},
    resourceAnalytics: {},
    pageToMarkdownAnalytics: {}
  })
  const availableMetrics = ref<string[]>([])
  const isConnected = ref(false)
  const haveMetrics = ref(false)
  const reconnectAttempts = ref(0)
  const maxReconnectAttempts = 5
  const reconnectInterval = 3000 // 3 seconds

  const connectWebSocket = () => {
    console.log('Attempting to connect WebSocket...')
    if (socket.value?.readyState === WebSocket.OPEN) {
      console.log('WebSocket is already open')
      return
    }

    socket.value = new WebSocket(`ws://${window.location.host}/api/admin/server-jobs`)

    socket.value.onopen = () => {
      console.log('WebSocket connection established')
      isConnected.value = true
      reconnectAttempts.value = 0
    }

    socket.value.onmessage = (event) => {
      console.log('Received message:', event.data)
      const data = JSON.parse(event.data)
      if (data.type === 'availableMetrics') {
        console.log('Received available metrics:', data.metrics)
        availableMetrics.value = data.metrics
      } else if (data.type === 'error') {
        console.error('WebSocket error:', data.message)
      } else {
        console.log('Updating metrics with:', data)
        updateMetrics(data)
        haveMetrics.value = true
      }
    }

    socket.value.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    socket.value.onclose = () => {
      console.log('WebSocket connection closed')
      isConnected.value = false
      reconnect()
    }
  }

  const reconnect = () => {
    if (reconnectAttempts.value < maxReconnectAttempts) {
      reconnectAttempts.value++
      console.log(`Attempting to reconnect (${reconnectAttempts.value}/${maxReconnectAttempts})...`)
      setTimeout(connectWebSocket, reconnectInterval)
    } else {
      console.log('Max reconnect attempts reached. Please refresh the page.')
    }
  }

  const disconnectWebSocket = () => {
    if (socket.value) {
      socket.value.close()
      socket.value = null
      isConnected.value = false
    }
  }

  const subscribeToMetrics = (metricTypes: string[]) => {
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      socket.value.send(
        JSON.stringify({
          action: 'subscribe',
          metrics: metricTypes
        })
      )
    }
  }

  const unsubscribeFromMetrics = (metricTypes: string[]) => {
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      socket.value.send(
        JSON.stringify({
          action: 'unsubscribe',
          metrics: metricTypes
        })
      )
    }
  }

  const updateMetrics = (newData: any) => {
    Object.keys(newData).forEach((key) => {
      if (key in metrics) {
        Object.keys(newData[key]).forEach((subKey) => {
          if (typeof newData[key][subKey] === 'object' && newData[key][subKey] !== null) {
            metrics[key][subKey] = { ...metrics[key][subKey], ...newData[key][subKey] }
          } else {
            metrics[key][subKey] = newData[key][subKey]
          }
        })
      }
    })
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
    metrics,
    availableMetrics,
    isConnected,
    haveMetrics,
    connectWebSocket,
    disconnectWebSocket,
    subscribeToMetrics,
    unsubscribeFromMetrics
  }
}
