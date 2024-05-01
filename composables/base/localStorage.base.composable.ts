type LocalStorageKey = 'astron-categories' | 'astron-tags'

export function useBaseLocalStorage() {

  function clearLocalStorage(key: LocalStorageKey) {
    localStorage.removeItem(key)
  }

  function checkLocalStorage(key: LocalStorageKey) {
    logger.debug(`Checking local storage for: ${key}`)

    const localStorageData = localStorage.getItem(key)
    if (localStorageData) {
      const parsedData = JSON.parse(localStorageData)
      const currentTime = new Date().getTime()
      const maxAge = 2 * 24 * 60 * 60 * 1000 // 2 days in milliseconds
      if (currentTime - parsedData.timestamp <= maxAge && parsedData.data.length > 1) {
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

  return {
    store: storeInLocalStorage,
    check: checkLocalStorage,
    clear: clearLocalStorage
  }
}