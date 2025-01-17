import { ref } from 'vue'
import { io } from 'socket.io-client'

export interface Event {
  type: 'created' | 'updated' | 'deleted'
  data: {
    subscription: any // Type this based on your SubscriptionModel
    changes?: any
    timestamp: string
  }
}

export const useEvents = () => {
  const socket = io(`${useRuntimeConfig().public.apiURL}/event`)
  const lastEvent = ref<Event | null>(null)
  const isConnected = ref(false)

  socket.on('connect', () => {
    console.log('Socket connected')
    isConnected.value = true
  })

  socket.on('disconnect', () => {
    console.log('Socket disconnected')
    isConnected.value = false
  })

  socket.on('paymentEvent', (event: Event) => {
    lastEvent.value = event
  })

  onUnmounted(() => {
    socket.disconnect()
  })

  return {
    lastEvent,
    isConnected,
  }
}
