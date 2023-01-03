import { current, many, byId } from './supabase/data/user'
import { manyPosts } from './supabase/data/posts'
import { manyNews } from './supabase/data/news'

export default function useData() {
    return {
        posts: {
            many: manyPosts,
        },
        news: {
            many: manyNews,
        },
        user: {
            current,
            many,
            byId,
        }
    }
}
