import { defineWebSocketHandler } from 'h3'
import { $fetch } from 'ofetch'
import { WebSocket } from 'ws'
import jwt from 'jsonwebtoken'

const clients = new Set()
let serverWs: WebSocket | null = null

export default defineWebSocketHandler({
  async open(peer) {
    console.log('Nuxt client connected')
    clients.add(peer)

    if (!serverWs) {
      const token = jwt.sign({ sender: 'AstronEra' }, useRuntimeConfig().scraperKey, {
        algorithm: 'HS256'
      })

      const scraperBaseURL = useRuntimeConfig().public.scraperUrl
      const wsUrl = `${scraperBaseURL.replace(/^http/, 'ws')}/api/jobs`

      serverWs = new WebSocket(wsUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      serverWs.on('open', () => {
        console.log('Connected to Express WebSocket server')
      })

      serverWs.on('message', (data) => {
        // Broadcast the message to all connected Nuxt clients
        for (const client of clients) {
          client.send(data)
        }
      })

      serverWs.on('close', () => {
        console.log('Disconnected from Express WebSocket server')
        serverWs = null
      })

      serverWs.on('error', (error) => {
        console.error('Error with Express WebSocket connection:', error)
      })
    }
  },

  message(peer, message) {
    console.log('Received message from Nuxt client:', message)
    // If you need to handle messages from the client to the server,
    // you can implement that logic here
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
