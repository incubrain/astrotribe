// import * as util from './utilities'
import type { EventType } from '@/types/events'

export default defineStore('events', () => {
  const events = ref([] as EventType[])

  async function checkWeHaveEvents() {
    if (events.value.length) return
    // check appState
    const { error, data } = await useFetch('/api/events/many')
    if (error.value) throw createError(`error getting events: ${error.value.message}`)
    if (data.value?.events) events.value = data.value.events // todo check data validity
  }

  const eventById = () => {
    return (id: number) => events.value.find((event: EventType) => event.id === id)
  }

  return {
    events,
    eventById,
    checkWeHaveEvents
  }
})
