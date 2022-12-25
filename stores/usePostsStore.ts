import * as z from 'zod'

const PostSchema = z.object({
    id: z.number(),
    created_at: z.string().nullable(),
    user_id: z.string().nullable(),
    title: z.string().nullable(),
    body: z.string().nullable(),
    status_id: z.number(),
})

export const usePostsStore = defineStore('posts', {
    //...
    state: () => {
        return {
            posts: [] as typeof PostSchema[],
        }
    },
    actions: {
        async storageCheck(dataType: string) {
            // if in state, return state posts
            if (this[dataType].length) return this[dataType]
            // if in localStorage, update state
            const localStore = localStorage.getItem('posts')
            if (!localStore) return false

            try {
                const parsedStore = JSON.parse(localStore)
                const data = PostSchema.parse(parsedStore[1])
                console.log(`${dataType} local data is valid: `, data)
                this[dataType] = parsedStore
                return parsedStore
            } catch (error) {
                createError(`Error validating ${dataType} local data: `, error)
                return false
            }
        },
        async getPosts() {
            // check if posts are in localStorage or state
            let posts = await this.storageCheck('posts')
            console.log('localStorage posts', posts)
            if (!posts) {
                console.log('get posts from supabase')
                const { data, error } = await useData().posts.many()
                if (error) throw createError(error)
                this.posts = data
                localStorage.setItem('posts', JSON.stringify(data))
            }
        },
    },
    getters: {
        allPosts: (state) => state.posts,
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(usePostsStore, import.meta.hot))
}
