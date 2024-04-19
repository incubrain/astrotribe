import type { StoreKey } from './pagination.base.store'

type Loaders = {
  [K in StoreKey]?: boolean
}

export const useLoadingStore = defineStore('storeLoading', () => {
  const loaders = ref({} as Loaders)

  function setLoading(key: StoreKey, isLoading: boolean) {
    loaders.value[key] = isLoading
  }

  async function setLoadingInterval(key: StoreKey, isLoading: boolean, time: number) {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        setLoading(key, isLoading)
        resolve()
      }, time)
    })
  }

  function isLoading(key: StoreKey) {
    return !!loaders.value[key]
  }

  return {
    setLoadingInterval,
    setLoading,
    isLoading
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLoadingStore, import.meta.hot))
}
