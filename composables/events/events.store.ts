// import * as util from './utilities'
import type { FetchInput } from '../base/fetch.base.composable'
import type { EventType } from '@/types/events'

export const useEventsStore = defineStore('eventsStore', () => {
  const events = ref([] as EventType[])
  const logger = useLogger('eventsStore')
  const baseFetch = useBaseFetch()

  async function loadEvents(input: FetchInput) {
    logger.log('loadEvents start')
    try {
      const data = await baseFetch.fetchPaginatedData(input)

      if (!data) {
        return
      }
      logger.log(`returned ${data.length} events`)
      events.value.push(...data)
    } catch (error) {
      console.error('Failed to load events:', error)
    }
  }

  // const eventById = () => {
  //   return (id: number) => events.value.find((event: EventType) => event.id === id)
  // }

  return {
    events,
    loadEvents
  }
})
