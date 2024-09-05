import type { DomainKey } from './pagination.ib.store'

type Loaders = {
  [K in DomainKey]?: boolean
}

export const useLoadingStore = defineStore('storeLoading', () => {
  const loaders = ref({} as Loaders)

  function setLoading(key: DomainKey, isLoading: boolean) {
    loaders.value[key] = isLoading
  }

  async function setLoadingInterval(key: DomainKey, isLoading: boolean, time: number) {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        setLoading(key, isLoading)
        resolve()
      }, time)
    })
  }

  function isLoading(key: DomainKey) {
    return !!loaders.value[key]
  }

  return {
    setLoadingInterval,
    setLoading,
    isLoading,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLoadingStore, import.meta.hot))
}
