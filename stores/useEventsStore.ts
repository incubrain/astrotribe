// import * as util from './utilities'

export default defineStore('events', () => {
  const events = ref([])

  async function checkWeHaveEvents() {
    console.log('checkWeHaveEvents', events.value.length)
    if (events.value.length) return
    console.log('checkWeHaveevents2', events.value.length)
    // check appState
    const { error, data } = await useFetch('/api/events/many')
    if (error.value) throw createError(`error getting events: ${error.value.message}`)
    console.log('data', data.value)
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
