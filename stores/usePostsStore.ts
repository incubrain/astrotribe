import * as z from 'zod'

const PostSchema = z.object({
    id: z.number(),
    created_at: z.string().nullable(),
    user_id: z.string().nullable(),
    title: z.string().nullable(),
    body: z.string().nullable(),
    status_id: z.number(),
})

const NewsSchema = z.object({
    title: z.string().nullable(),
    body: z.string().nullable(),
    author: z.string().nullable(),
    published: z.string().nullable(),
    category: z.string().nullable(),
})

export const usePostsStore = defineStore('posts', {
    //...
    state: () => {
        return {
            posts: [] as typeof PostSchema[],
            news: [] as typeof NewsSchema[],
        }
    },
    actions: {
        async storageCheck(dataType: string) {
            let Schema = dataType === 'posts' ? PostSchema : NewsSchema
            // if in state, return state posts
            if (this[dataType].length) return this[dataType]
            // if in localStorage, update state
            const localStore = localStorage.getItem(dataType)
            console.log(`${dataType} local storage check `)
            if (!localStore) return false

            try {
                const parsedStore = JSON.parse(localStore)
                const data = Schema.parse(parsedStore[1])
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
        async getNews() {
            // check if posts are in localStorage or state
            let news = await this.storageCheck('news')
            console.log('localStorage news', news)
            if (!news) {
                console.log('get news from appify')
                const { data, error } = await useData().news.many()
                console.log('news returned', data, error)
                if (error.value) throw createError(error)
                this.news = data.value
                localStorage.setItem('news', JSON.stringify(data))
            }
        },
    },
    getters: {
        postById: (state) => {
            return (id: number) => state.posts.find(post => post.id === id)
        }
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(usePostsStore, import.meta.hot))
}
