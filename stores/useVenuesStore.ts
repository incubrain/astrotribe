export default defineStore('venues', () => {
  const venues = ref([])

  async function checkWeHaveVenues() {
    console.log('checkWeHavevenues', venues.value.length)
    if (venues.value.length) return
    console.log('checkWeHavevenues2', venues.value.length)
    // check appState
    const { error, data } = await useFetch('/api/venues/many')
    if (error.value) throw createError(`error getting venues: ${error.value.message}`)
    if (data.value?.venues) venues.value = data.value.venues // todo check data validity
  }

  const venueById = () => {
    return (id: number) => venues.value.find((venue) => venue.id === id)
  }

  return {
    venues,
    venueById,
    checkWeHaveVenues
  }
})
