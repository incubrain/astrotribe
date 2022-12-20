import { single, data } from './supabase/realtime/table'

export default function useRealtime() {
    return {
        table: {
            single,
        },
        store: computed(() => data.value)
    }
}
