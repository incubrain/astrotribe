import { current, many, byId } from './supabase/data/user'

export default function useData() {
    return {
        user: {
            current,
            many,
            byId,
        }
    }
}
