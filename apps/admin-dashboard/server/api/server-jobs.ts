import { defineWebSocketHandler } from 'h3'
import { WebSocket } from 'ws'
import jwt from 'jsonwebtoken'

const clients = new Set()
let serverWs: WebSocket | null = null
let reconnectTimeout: NodeJS.Timeout | null = null
let reconnectAttempts = 0
const maxReconnectAttempts = 5
let reconnectInterval = 5000 // 5 seconds

let selectedMetrics: string[] = ['all']

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

  console.log(`Connecting to WebSocket URL: ${wsUrl}`)

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
    console.log('Received message from Analytics server:', data.toString())
    for (const client of clients) {
      client.send(data)
    }
  })

  serverWs.on('close', (code, reason) => {
    console.log(`Disconnected from Analytics WebSocket server: ${code} - ${reason}`)
    serverWs = null
    scheduleReconnect()
  })

  serverWs.on('error', (error: any) => {
    console.error('Error with Analytics WebSocket connection:', error)
    if (serverWs) {
      serverWs.close()
    }
  })
}

const scheduleReconnect = () => {
  if (reconnectAttempts < maxReconnectAttempts) {
    reconnectAttempts++
    console.log(
      `Scheduling reconnection attempt ${reconnectAttempts}/${maxReconnectAttempts} in ${reconnectInterval}ms`,
    )
    reconnectTimeout = setTimeout(() => {
      console.log(`Executing reconnection attempt ${reconnectAttempts}`)
      connectToAnalyticsServer()
    }, reconnectInterval)
  } else {
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
    try {
      const parsedMessage = JSON.parse(message)
      selectedMetrics = parsedMessage.metrics
      console.log('Updated selectedMetrics:', selectedMetrics)

      if (serverWs && serverWs.readyState === WebSocket.OPEN) {
        console.log(
          'Forwarding message to Analytics server:',
          JSON.stringify({
            action: 'subscribe',
            subscribedMetrics: parsedMessage.metrics,
          }),
        )
        serverWs.send(
          JSON.stringify({
            action: 'subscribe',
            subscribedMetrics: parsedMessage.metrics,
          }),
        )
      } else {
        console.log(
          'Cannot forward message: serverWs not ready. Current state:',
          serverWs ? serverWs.readyState : 'null',
        )
      }
    } catch (error: any) {
      console.error('Error parsing or handling message:', error)
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
