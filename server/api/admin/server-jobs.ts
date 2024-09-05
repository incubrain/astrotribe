import { defineWebSocketHandler } from 'h3'
import { WebSocket } from 'ws'
import jwt from 'jsonwebtoken'

const clients = new Set()
let serverWs: WebSocket | null = null
let reconnectTimeout: NodeJS.Timeout | null = null
let reconnectAttempts = 0
const maxReconnectAttempts = 5
let reconnectInterval = 5000 // 5 seconds

let selectedMetrics: string[] = [
  'spiderMetrics',
  'jobMetrics',
  'paginationMetrics',
  'blogPostScraperMetrics',
  'resourceAnalytics',
  'pageToMarkdownAnalytics',
] // Default metrics

const connectToAnalyticsServer = () => {
  if (reconnectAttempts >= maxReconnectAttempts) {
    console.log('Max reconnect attempts reached. Stopping reconnection attempts.')
    return
  }

  const scraperKey = useRuntimeConfig().scraperKey
  const token = jwt.sign({ sender: 'AstronEra' }, scraperKey, {
    algorithm: 'HS256',
  })
  const scraperBaseURL = useRuntimeConfig().public.scraperUrl
  const wsUrl = `${scraperBaseURL.replace(/^http/, 'ws')}/analytics`

  serverWs = new WebSocket(wsUrl, {
    headers: { Authorization: `Bearer ${token}` },
  })

  serverWs.on('open', () => {
    console.log('Connected to Analytics WebSocket server')
    reconnectAttempts = 0
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout)
      reconnectTimeout = null
    }
    // Send initial subscription with the selected metrics

    console.log('Subscribing to metrics:', selectedMetrics)
    serverWs.send(
      JSON.stringify({
        action: 'subscribe',
        metrics: selectedMetrics,
      }),
    )
  })

  serverWs.on('message', (data) => {
    // Broadcast the message to all connected Nuxt clients
    for (const client of clients) {
      client.send(data)
    }
  })

  serverWs.on('close', (code, reason) => {
    console.log(`Disconnected from Analytics WebSocket server: ${code} - ${reason}`)
    serverWs = null
    scheduleReconnect()
  })

  serverWs.on('error', (error) => {
    console.error('Error with Analytics WebSocket connection:', error)
    if (serverWs) {
      serverWs.close()
    }
  })
}

const scheduleReconnect = () => {
  if (reconnectAttempts < maxReconnectAttempts) {
    reconnectAttempts++
    console.log(`Scheduling reconnection attempt ${reconnectAttempts}/${maxReconnectAttempts}`)
    reconnectTimeout = setTimeout(connectToAnalyticsServer, reconnectInterval)
  }
  else {
    console.log('Max reconnect attempts reached. Please check the server.')
  }
}

export default defineWebSocketHandler({
  async open(peer) {
    console.log('Nuxt client connected')
    clients.add(peer)

    if (!serverWs) {
      connectToAnalyticsServer()
    }
  },

  message(peer, message) {
    console.log('Received message from Nuxt client:', message)
    // Forward the message to the Analytics server
    const parsedMessage = JSON.parse(message)
    selectedMetrics = parsedMessage.metrics

    // Forward the message to the Analytics server
    if (serverWs && serverWs.readyState === WebSocket.OPEN) {
      // Include the config in the forwarded message
      serverWs.send(
        JSON.stringify({
          action: 'subscribe',
          metrics: parsedMessage.metrics,
        }),
      )
    }
    else {
      console.log('Cannot forward message: serverWs not ready')
    }
  },

  close(peer) {
    console.log('Nuxt client disconnected')
    clients.delete(peer)

    if (clients.size === 0 && serverWs) {
      console.log('No more clients, closing server connection')
      serverWs.close()
      serverWs = null
      if (reconnectInterval) {
        clearInterval(reconnectInterval)
        reconnectInterval = null
      }
    }
  },

  error(peer, error) {
    console.error('Error with Nuxt client connection:', error)
    clients.delete(peer)
  },
})
