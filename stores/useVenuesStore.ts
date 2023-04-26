import useData from '../composables/useData'
import * as util from './utilities'
import { appState } from './appState'

export const useVenuesStore = defineStore('venues', {
  state: () => ({}),
  actions: {
    async getVenues() {
      const dataType = 'venues'
      const globalState = appState()
      // check localStorage and state
      if (globalState[dataType].length) return globalState[dataType]

      const { data, error } = await useData().venues.many()
      console.log('get events from supabase', data)
      if (error) throw createError(error)
      globalState[dataType] = await util.checkDataValidity({
        data,
        dataType,
        schema: 'VenueBasic'
      })
      console.log('Venues Store', globalState[dataType])
    },
    async getVenueSingle({ venueId }: { venueId: number }): Promise<void> {
      const dataType = 'venue'
      const globalState = appState()
      // check localStorage and state
      // if (globalState[dataType]) return
      console.log('retTest')

      const { data, error } = await useData().venues.single(venueId)
      if (error) throw createError(error)
      globalState[dataType] = await util.checkDataValidity({
        data,
        dataType,
        schema: 'VenueFull'
      })
      console.log('Venue Store', globalState[dataType])
    },
    async getVenueImages({ venueId }: { venueId: number }): Promise<string[]> {
      const data = await useData().venues.allImages(venueId)
      return data
    }
  },
  getters: {
    venueById: () => {
      const globalState = appState()
      return (id: number) => globalState.venues.find((venue) => venue.id === id)
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useVenuesStore, import.meta.hot))
}
