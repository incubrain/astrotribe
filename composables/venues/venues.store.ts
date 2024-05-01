export const useVenuesStore = defineStore('venuesStore', () => {
  const venues = ref([])

  const logger = useLogger('venuesStore')
  const baseFetch = useBaseFetch()

  async function loadVenues(dataShape: string) {
    logger.log('loadVenues start')
    try {
      const data = await baseFetch.fetchPaginatedData({
        storeKey: 'venuesStore',
        endpoint: '/api/venues/cards',
        pagination: { page: 1, limit: 20 },
        config: {
          shape: dataShape
        }
      })

      logger.log(`returned ${data.length} venues`)
      if (!data) {
        return
      }

      venues.value.push(...data)
    } catch (error) {
      console.error('Failed to load venues:', error)
    }
  }

  // const venueById = () => {
  //   return (id: number) => venues.value.find((venue) => venue.id === id)
  // }

  return {
    venues,
    loadVenues
  }
})
