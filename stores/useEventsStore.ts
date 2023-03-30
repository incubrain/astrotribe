import useData from '../composables/useData'
import * as util from './utilities'
import { appState } from './appState'

export const useEventsStore = defineStore('events', () => {
  const globalState = appState()
  async function getEvents() {
    const dataType = 'events'
    // check localStorage and state
    if (globalState[dataType].length) return globalState[dataType]
    // globalState[dataType] = util.checkLocalStorage({ dataType: 'events' })
    // if (globalState[dataType].length) return globalState[dataType]
    // if not stored get them from database
    const { data, error } = await useData().events.many()
    console.log('get events from supabase', data)
    if (error) throw createError(error)
    globalState[dataType] = await util.checkDataValidity({
      data,
      dataType,
      schema: 'ATEvent'
    })
    console.log('events Store', globalState[dataType])
    if (!globalState[dataType]) throw createError(`Error validating ${dataType} data`)
  }

  async function getSingleEvent({ eventId }: { eventId: number }) {
    console.log('testing', globalState.user)
    const dataType = 'event'
    // check appState
    if (globalState[dataType].id === eventId) return globalState[dataType]
    console.log('userzz2')
    // check localStorage
    // globalState[dataType] = util.checkLocalStorage({ dataType })
    // if (globalState[dataType]) return globalState[dataType]
    console.log('userzz3')
    // if not stored get them from database
    const { data, error } = await useData().events.single({ eventId })
    console.log('userzz4', data, error)
    if (error) throw createError(error)
    // validate data, then store in localStorage
    globalState[dataType] = util.checkDataValidity({
      data,
      dataType,
      schema: 'UserFull'
    })
    console.log('userzz5', globalState[dataType])
    if (!globalState[dataType]) throw createError(`Error validating ${dataType} data`)
  }

  const eventById = () => {
    return (id: number) => globalState.events.find((event) => event.id === id)
  }

  return {
    getEvents,
    getSingleEvent,
    eventById
  }
})

// if (import.meta.hot) {
//   import.meta.hot.accept(acceptHMRUpdate(useEventsStore, import.meta.hot))
// }
