// cache.mock.ts
export class MockCacheService {
  private store = new Map<string, { value: string; expiry?: number }>()

  async get<T>(key: string): Promise<T | null> {
    const item = this.store.get(key)
    if (!item) return null

    if (item.expiry && item.expiry < Date.now()) {
      this.store.delete(key)
      return null
    }

    return JSON.parse(item.value) as T
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const expiry = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined
    this.store.set(key, {
      value: JSON.stringify(value),
      expiry,
    })
  }

  async del(key: string): Promise<void> {
    this.store.delete(key)
  }

  async flushPrefix(prefix: string): Promise<void> {
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key)
      }
    }
  }

  async getAllKeys(prefix: string): Promise<Array<{ key: string; value: any }>> {
    const result = []
    for (const [key, item] of this.store.entries()) {
      if (key.startsWith(prefix)) {
        result.push({
          key,
          value: JSON.parse(item.value),
        })
      }
    }
    return result
  }
}
