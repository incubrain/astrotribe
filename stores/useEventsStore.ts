// import * as util from './utilities'

export default defineStore('events', () => {
  const events = ref([])

  async function checkWeHaveEvents() {
    if (events.value.length) return
    // check appState
    const { error, data } = await useFetch('/api/events/many')
    if (error.value) throw createError(`error getting events: ${error.value.message}`)
    if (data.value?.events) events.value = data.value.events // todo check data validity
  }

  const eventById = () => {
    return (id: number) => events.value.find((event) => event.id === id)
  }

  return {
    events,
    eventById,
    checkWeHaveEvents
  }
})
