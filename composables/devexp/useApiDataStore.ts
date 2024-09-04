// stores/apiData.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

interface ApiDataStructure {
  [key: string]: any
}

export const useApiDataStore = defineStore('apiData', () => {
  const apiData = ref<ApiDataStructure>({})

  const setData = (url: string, data: any): void => {
    apiData.value[url] = data
  }

  const getData = (url: string): any => {
    return apiData.value[url]
  }

  const clearData = (): void => {
    apiData.value = {}
  }

  return {
    apiData,
    setData,
    getData,
    clearData
  }
})
