import useData from '../composables/useData'
import * as util from './utilities'

export const useEventsStore = defineStore('events', {
    actions: {
        async getEvents() {
            // check localStorage and state
            if (this.events.length) return
            // let events = await checkLocalStorage({ dataType: 'events' })
            // if (events) return this.events = events
            // if not stored get them from database
            const { data, error } = await useData().events.many()
            console.log('get events from supabase', data)
            if (error) throw createError(error)
            this.events = data
            localStorage.setItem('events', JSON.stringify(data))
        },
    },
    getters: {
        eventById: (state) => {
            return (id: number) => state.events.find(event => event.id === id)
        }
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useEventsStore, import.meta.hot))
}
