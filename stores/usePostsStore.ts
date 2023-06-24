import useData from '../composables/useData'
import * as util from './utilities'

export const usePostsStore = defineStore('posts', {
  actions: {
    async getPosts() {
      const dataType = 'posts'
      // check if posts are in localStorage or state
      this.posts = await util.checkLocalStorage({ dataType })
      if (this.posts) return this.posts
      console.log('localStorage posts', this.posts)

      const { data, error } = await useData().posts.many()
      if (error) throw createError(error)

      const validated = util.checkDataValidity({ data, dataType, schema: 'PostSchemaValidation' })
      if (validated) this[`${dataType}`] = validated
    },
    async getNews() {
      const dataType = 'news'
      // check if posts are in localStorage or state
      const news = await util.checkLocalStorage({ dataType })
      console.log('localStorage news', news)
      if (!news) {
        console.log('get news from appify')
        const { data, error } = await useData().news.many()
        if (error.value) throw createError(error)

        const validated = util.checkDataValidity({ data, dataType, schema: 'NewsSchemaValidation' })
        if (validated) this[`${dataType}`] = validated
      }
    }
  },
  getters: {
    postById: (state) => {
      return (id: number) => state.posts.find((post) => post.id === id)
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePostsStore, import.meta.hot))
}
