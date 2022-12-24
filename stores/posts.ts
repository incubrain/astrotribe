interface Post {
    id: number
    title: string
    body: string
    published: boolean
    publishedAt?: Date
}

export const usePostsStore = defineStore('posts', {
    //...
    state: () => {
        return {
            posts: [] as Post[],
        }
    },
    actions: {
        async getPosts() {
            if (this.posts.length) return this.posts
            let posts = JSON.parse(localStorage.getItem('posts'))
            //
            console.log('localStorage posts', posts)
            if (!posts) {
                console.log('get posts from supabase')
                const { data, error } = await useData().posts.many()
                if (error) throw createError(error)
                posts = data
                localStorage.setItem('posts', JSON.stringify(posts))
            }
            //
            console.log('return posts', posts)
            this.posts = posts
        },
    },
    getters: {
        allPosts: (state) => state.posts,
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(usePostsStore, import.meta.hot))
}
