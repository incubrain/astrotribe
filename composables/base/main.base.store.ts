import { defineStore } from 'pinia'
import type { DomainKey } from './pagination.base.store'
import { type Ref, ref } from 'vue'

export function createBaseStore<T extends object>(domainKey: DomainKey) {
  return defineStore(`${domainKey}Store`, () => {
    const items = ref<T[]>([]) as Ref<T[]>
    const itemsMap = computed(() => new Map(items.value.map((item) => [item.id, item])))

    function setItems(newItems: T[]) {
      items.value = newItems
    }

    function addItems(newItems: T[]) {
      const newItemsMap = new Map(newItems.map((item) => [item.id, item]))
      items.value = [...items.value.filter((item) => !newItemsMap.has(item.id)), ...newItems]
    }

    function updateItem(updatedItem: T) {
      const index = items.value.findIndex((item) => item.id === updatedItem.id)
      if (index !== -1) {
        items.value[index] = { ...items.value[index], ...updatedItem }
      } else {
        items.value.push(updatedItem)
      }
    }

    function removeItem(id: string | number) {
      items.value = items.value.filter((item) => item.id !== id)
    }

    function clearItems() {
      items.value = []
    }

    function getItemById(id: string | number) {
      return itemsMap.value.get(id)
    }

    return {
      items,
      itemsMap,
      setItems,
      addItems,
      updateItem,
      removeItem,
      clearItems,
      getItemById
    }
  })
}
