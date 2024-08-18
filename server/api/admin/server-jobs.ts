import { defineWebSocketHandler } from 'h3'
import { WebSocket } from 'ws'
import jwt from 'jsonwebtoken'

const clients = new Set()
let serverWs: WebSocket | null = null

export default defineWebSocketHandler({
  async open(peer) {
    console.log('Nuxt client connected')
    clients.add(peer)

    if (!serverWs) {
      const scraperKey = useRuntimeConfig().scraperKey
      console.log('scraperKey', scraperKey)
      const token = jwt.sign({ sender: 'AstronEra' }, scraperKey, {
        algorithm: 'HS256'
      })
      const scraperBaseURL = useRuntimeConfig().public.scraperUrl
      console.log('scraperBaseURL', scraperBaseURL)
      const wsUrl = `${scraperBaseURL.replace(/^http/, 'ws')}/analytics`

      serverWs = new WebSocket(wsUrl, {
        headers: { Authorization: `Bearer ${token}` }
      })

      serverWs.on('open', () => {
        console.log('Connected to Analytics WebSocket server')
        // Send initial subscription
        serverWs.send(
          JSON.stringify({
            action: 'subscribe',
            metrics: ['jobMetrics', 'spiderMetrics']
          })
        )
      })

      serverWs.on('message', (data) => {
        // Broadcast the message to all connected Nuxt clients
        for (const client of clients) {
          client.send(data)
        }
      })

      serverWs.on('close', () => {
        console.log('Disconnected from Analytics WebSocket server')
        serverWs = null
      })

      serverWs.on('error', (error) => {
        console.error('Error with Analytics WebSocket connection:', error)
      })
    }
  },

  message(peer, message) {
    console.log('Received message from Nuxt client:', message)
    // Forward the message to the Analytics server
    if (serverWs && serverWs.readyState === WebSocket.OPEN) {
      serverWs.send(message)
    } else {
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
    }
  },

  error(peer, error) {
    console.error('Error with Nuxt client connection:', error)
    clients.delete(peer)
  }
})
