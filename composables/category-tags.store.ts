import { z } from 'zod'

const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  body: z.string().nullish(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
})

const TagSchema = z.object({
  id: z.number(),
  name: z.string(),
  body: z.string().nullish(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
})

type Category = z.infer<typeof CategorySchema>
type Tag = z.infer<typeof TagSchema>

const DOMAIN_KEY = 'categoryTag'

export const useCategoryTagStore = defineStore('categoryTagStore', () => {
  const logger = useLogger(DOMAIN_KEY)
  const categories = ref([{}] as Category[])
  const tags = ref([{}] as Tag[])
  const localStorage = useBaseLocalStorage()
  const errors = useBaseError()

  const client = useSupabaseClient()

  async function getCategories() {
    const localStorageData = await localStorage.check('astron-categories')

    if (localStorageData) {
      logger.debug('Retrieved categories from local storage', localStorageData)
      categories.value.push(...localStorageData.categories)
      return
    }

    const response = await client.from('categories').select('id, name')
    console.log('category response', response)

    // "TypeError: Failed to fetch\n
    // at http://localhost:3000/_nuxt/node_modules/@supabase/supabase-js/dist/module/lib/fetch.js?v=6c748db4:23:25\n
    // at http://localhost:3000/_nuxt/node_modules/@supabase/supabase-js/dist/module/lib/fetch.js?v=6c748db4:44:16\n
    // at Generator.next (<anonymous>)\n    at fulfilled (http://localhost:3000/_nuxt/node_modules/@supabase/supabase-js/dist/module/lib/fetch.js?v=6c748db4:4:58)"

    const cat = errors.server({
      response,
      devOnly: true,
      devMessage: `Error Fetching Categories from DB`,
      userMessage: `There was an error getting Categories from the database`
    })
    categories.value.push(...cat)
    localStorage.store('astron-categories', { categories: cat })
  }

  async function getTags() {
    const localStorageData = await localStorage.check('astron-tags')

    if (localStorageData) {
      logger.debug('Retrieved tags from local storage', localStorageData)
      tags.value.push(...localStorageData.tags)
      return
    }

    const response = await client.from('tags').select('id, name')
    const cat = errors.server({
      response,
      devOnly: true,
      devMessage: `Error Fetching Tags from DB`,
      userMessage: `There was an error getting Tags from the database`
    })
    tags.value.push(...cat)
    localStorage.store('astron-tags', { tags: cat })
  }

  const getCategoryName = (categoryId: number) => {
    return categories.value.find((category) => category.id === categoryId)?.name
  }

  const getTagName = (tagId: number) => {
    return tags.value.find((tag) => tag.id === tagId)
  }

  return {
    categories,
    tags,
    getCategories,
    getTags,
    getCategoryName,
    getTagName
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCategoryTagStore, import.meta.hot))
}
