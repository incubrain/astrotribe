import { z } from 'zod'

const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  body: z.string().nullish(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
})

const TagSchema = z.object({
  id: z.string(),
  name: z.string(),
  body: z.string().nullish(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
})

type Category = z.infer<typeof CategorySchema>
type Tag = z.infer<typeof TagSchema>

export const useCategoryTagStore = defineStore('categoryTagStore', () => {
  const logger = useLogger('categoryTagStore')
  const categories = ref<Category[]>([])
  const tags = ref<Tag[]>([])
  const localStorage = useBaseLocalStorage()
  const errors = useBaseError()

  const client = useSupabaseClient()

  async function getCategories() {
    try {
      categories.value = await localStorage.getCachedOrFetch('astronera-categories', async () => {
        const { data, error } = await client.from('categories').select('id, name')
        if (error) throw error
        return z.array(CategorySchema).parse(data)
      })
    } catch (error: any) {
      logger.error('Error fetching categories:', error)
      errors.server({
        error,
        devOnly: true,
        devMessage: 'Error Fetching Categories from DB',
        userMessage: 'There was an error getting Categories from the database',
      })
    }
  }

  async function getTags() {
    try {
      tags.value = await localStorage.getCachedOrFetch('astronera-tags', async () => {
        const { data, error } = await client.from('tags').select('id, name')
        if (error) throw error
        return z.array(TagSchema).parse(data)
      })
    } catch (error: any) {
      logger.error('Error fetching tags:', error)
      errors.server({
        error,
        devOnly: true,
        devMessage: 'Error Fetching Tags from DB',
        userMessage: 'There was an error getting Tags from the database',
      })
    }
  }

  const getCategoryName = computed(
    () => (categoryId: string) =>
      categories.value.find((category) => category.id === categoryId)?.name,
  )

  const getTagName = computed(
    () => (tagId: string) => tags.value.find((tag) => tag.id === tagId)?.name,
  )

  return {
    categories,
    tags,
    getCategories,
    getTags,
    getCategoryName,
    getTagName,
    clearAllCaches: localStorage.clearAllCaches,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCategoryTagStore, import.meta.hot))
}
