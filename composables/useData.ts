import { current, many, byId } from './supabase/data/user'
import { manyPosts } from './supabase/data/posts'

export default function useData() {
    return {
        posts: {
            many: manyPosts,
        },
        user: {
            current,
            many,
            byId,
        }
    }
}
