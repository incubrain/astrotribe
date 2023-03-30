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
        schema: 'Venue'
      })
      console.log('Venue Store', globalState[dataType])
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
