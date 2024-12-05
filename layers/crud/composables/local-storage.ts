const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
const CACHE_VERSION = '1.0' // Increment this when data structure changes

const LocalStorageEnum = {
  CATEGORIES: 'astronera-categories',
  TAGS: 'astronera-tags',
} as const

type LocalStorageKey = (typeof LocalStorageEnum)[keyof typeof LocalStorageEnum]

interface CachedData<T> {
  version: string
  timestamp: number
  data: T
}

export function useBaseLocalStorage() {
  const logger = useLogger('localStorage')

  function getCacheKey(key: LocalStorageKey): string {
    return `${key}-${CACHE_VERSION}`
  }

  function clearCache(key: LocalStorageKey): void {
    localStorage.removeItem(getCacheKey(key))
    logger.debug(`Cleared cache for: ${key}`)
  }

  function clearAllCaches(): void {
    Object.values(LocalStorageEnum).forEach(clearCache)
    logger.debug('Cleared all caches')
  }

  function getFromCache<T>(key: LocalStorageKey): T | null {
    const cacheKey = getCacheKey(key)
    const cachedItem = localStorage.getItem(cacheKey)

    if (!cachedItem) {
      logger.debug(`No cached data found for: ${key}`)
      return null
    }

    try {
      const parsedData = JSON.parse(cachedItem) as CachedData<T>
      const currentTime = Date.now()

      if (
        currentTime - parsedData.timestamp <= CACHE_DURATION &&
        parsedData.version === CACHE_VERSION
      ) {
        logger.debug(`Retrieved valid cached data for: ${key}`)
        return parsedData.data
      } else {
        logger.debug(`Cached data for ${key} is outdated or version mismatch`)
        clearCache(key)
        return null
      }
    } catch (error) {
      logger.error(`Error parsing cached data for ${key}:`, error)
      clearCache(key)
      return null
    }
  }

  function setCache<T>(key: LocalStorageKey, data: T): void {
    const cacheKey = getCacheKey(key)
    const cacheData: CachedData<T> = {
      version: CACHE_VERSION,
      timestamp: Date.now(),
      data,
    }
    localStorage.setItem(cacheKey, JSON.stringify(cacheData))
    logger.debug(`Cached data for: ${key}`)
  }

  async function getCachedOrFetch<T>(key: LocalStorageKey, fetchFn: () => Promise<T>): Promise<T> {
    const cachedData = getFromCache<T>(key)
    if (cachedData) return cachedData

    try {
      const fetchedData = await fetchFn()
      setCache(key, fetchedData)
      return fetchedData
    } catch (error) {
      logger.error(`Error fetching data for ${key}:`, error)
      throw error
    }
  }

  return {
    getFromCache,
    setCache,
    clearCache,
    clearAllCaches,
    getCachedOrFetch,
  }
}
