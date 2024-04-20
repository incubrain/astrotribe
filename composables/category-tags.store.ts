import { z } from 'zod'

type LocalStorageKey = 'astron-categories' | 'astron-tags'

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

export const useCategoryTagStore = defineStore('categoryTagStore', () => {
  const logger = useLogger('categoryTagStore')
  const categories = ref([{}] as Category[])
  const tags = ref([{}] as Tag[])

  const client = useSupabaseClient()

  function handleDBErrors(response: { data?: any; error?: any }) {
    if (response.error) {
      logger.error(`handleDBErrors - Supabase Error: ${response.error.message}`)
      throw createError({ message: response.error.message })
    } else if (response.data) {
      return response.data
    }
    return null
  }

  // util:low:easy:1 - extract to useLocalStorage composable

  function clearLocalStorage(key: LocalStorageKey) {
    localStorage.removeItem(key)
  }

  function checkLocalStorage(key: LocalStorageKey) {
    logger.debug(`Checking local storage for: ${key}`)

    const localStorageData = localStorage.getItem(key)
    if (localStorageData) {
      const parsedData = JSON.parse(localStorageData)
      const currentTime = new Date().getTime()
      const maxAge = 30 * 24 * 60 * 60 * 1000 // 1 month in milliseconds
      if (currentTime - parsedData.timestamp <= maxAge) {
        logger.debug(`Local storage is valid: ${key}`)
        return parsedData.data
      }
      logger.debug(`Local storage is too old: ${key}`)
      clearLocalStorage(key)
    }
    return false
  }

  function storeInLocalStorage(key: string, data: any) {
    logger.debug(`Storing data in local storage: ${key}`)

    const dataToStore = {
      timestamp: new Date().getTime(),
      data
    }
    localStorage.setItem(key, JSON.stringify(dataToStore))
  }

  //

  async function getCategories() {
    const localStorageData = await checkLocalStorage('astron-categories')

    if (localStorageData) {
      logger.debug('Retrieved categories from local storage', localStorageData)
      categories.value.push(...localStorageData.categories)
      return
    }

    const response = await client.from('categories').select('id, name, body')
    const cat = handleDBErrors(response)
    categories.value.push(...cat)
    storeInLocalStorage('astron-categories', { categories: cat })
  }

  async function getTags() {
    const localStorageData = await checkLocalStorage('astron-tags')

    if (localStorageData) {
      logger.debug('Retrieved tags from local storage', localStorageData)
      tags.value.push(...localStorageData.tags)
      return
    }

    const response = await client.from('tags').select('id, name, body')
    const cat = handleDBErrors(response)
    tags.value.push(...cat)
    storeInLocalStorage('astron-tags', { tags: cat })
  }

  const getCategoryName = (cateogryId: number) => {
    return categories.value.find((category) => category.id === cateogryId)
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
