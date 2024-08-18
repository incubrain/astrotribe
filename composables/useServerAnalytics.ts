export function useServerAnalytics() {
  const socket = ref<WebSocket | null>(null)
  const metrics = reactive({
    jobMetrics: {},
    spiderMetrics: {},
    paginationMetrics: {},
    blogPostScraperMetrics: {},
    resourceAnalytics: {}
  })
  const availableMetrics = ref<string[]>([])
  const isConnected = ref(false)

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
        Object.assign(metrics, data)
      }
    }

    socket.value.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    socket.value.onclose = () => {
      console.log('WebSocket connection closed')
      isConnected.value = false
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

  const subscribeToAllMetrics = () => {
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      socket.value.send(
        JSON.stringify({
          action: 'subscribe',
          metrics: ['jobMetrics', 'spiderMetrics']
        })
      )
    }
  }

  onUnmounted(() => {
    disconnectWebSocket()
  })

  return {
    metrics,
    availableMetrics,
    isConnected,
    connectWebSocket,
    disconnectWebSocket,
    subscribeToMetrics,
    unsubscribeFromMetrics
  }
}
