import { defineStore } from 'pinia'
import type { DomainKey } from './pagination.base.store'
import { type Ref, ref } from 'vue'

export function createBaseStore<T extends object>(domainKey: DomainKey) {
  return defineStore(`${domainKey}Store`, () => {
    const items = ref<T[]>([]) as Ref<T[]>

    function setItems(newItems: T[]) {
      items.value = newItems
    }

    function addItems(newItems: T[]) {
      items.value.push(...newItems)
    }

    function clearItems() {
      items.value = []
    }

    return {
      items,
      setItems,
      addItems,
      clearItems
    }
  })
}
