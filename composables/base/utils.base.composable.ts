import type { DomainKey } from './pagination.base.store'
import { createBaseStore } from './main.base.store'

const storeCache: Partial<Record<DomainKey, ReturnType<typeof createBaseStore>>> = {}

export function getOrCreateStore<T>(domainKey: DomainKey) {
  if (!storeCache[domainKey]) {
    storeCache[domainKey] = createBaseStore<T>(domainKey)
  }
  return storeCache[domainKey] as ReturnType<typeof createBaseStore<T>>
}
