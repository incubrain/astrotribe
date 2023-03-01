import useData from '../composables/useData'
import { checkLocalStorage } from './utilities'

export const useVenuesStore = defineStore('venues', {
    actions: {
        async getVenues() {
            // check localStorage and state
            if (this.venues.length) return
            let venues = await checkLocalStorage({ dataType: 'venues', schema: venueSchema})
            if (venues) return this.venues = venues
            // if not stored get them from database
            if (!venues) {
                const { data, error } = await useData().venues.many()
                console.log('get venues from supabase', data)
                if (error) throw createError(error)
                this.venues = data
                localStorage.setItem('venues', JSON.stringify(data))
            }
        },
    },
    getters: {
        venueById: (state) => {
            return (id: number) => state.venues.find(venue => venue.id === id)
        }
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useVenuesStore, import.meta.hot))
}
