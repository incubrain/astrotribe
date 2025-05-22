import { ref } from 'vue'
import { io, Socket } from 'socket.io-client'

export interface Event {
  module: 'payment' | 'subscription'
  type: 'created' | 'updated' | 'deleted'
  data: {
    subscription: any
    changes?: any
    timestamp: string
  }
}

// Singleton instance
let socketInstance: Socket | null = null

export const useEvents = () => {
  const lastEvent = ref<Event | null>(null)
  const isConnected = ref(false)

  // Only create a new socket if one doesn't exist
  if (!socketInstance) {
    socketInstance = io(`${useRuntimeConfig().public.apiURL}`, {
      path: '/events',
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    })
  }

  // Set up event listeners
  socketInstance.on('connect', () => {
    console.log('Socket connected')
    isConnected.value = true
  })

  socketInstance.on('disconnect', () => {
    console.log('Socket disconnected')
    isConnected.value = false
  })

  socketInstance.on('paymentEvent', async (event: Event) => {
    lastEvent.value = event
  })

  // Clean up listeners on component unmount
  onUnmounted(() => {
    socketInstance?.off('connect')
    socketInstance?.off('disconnect')
    socketInstance?.off('paymentEvent')
  })

  return {
    lastEvent,
    isConnected,
  }
}
