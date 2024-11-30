// composables/useOptimisticUpdate.ts
import { ref } from 'vue'

interface OptimisticUpdateOptions<T, R> {
  // The API call to make
  apiCall: () => Promise<R>
  // Function to update local state optimistically
  optimisticUpdate: () => void
  // Function to rollback changes if API fails
  rollback: () => void
  // Optional key to prevent duplicate calls
  key?: string
}

export function useOptimisticUpdate() {
  const pendingUpdates = ref<Set<string>>(new Set())

  const execute = async <T, R>({
    apiCall,
    optimisticUpdate,
    rollback,
    key,
  }: OptimisticUpdateOptions<T, R>) => {
    // Prevent duplicate calls if key provided
    if (key && pendingUpdates.value.has(key)) {
      return
    }

    try {
      // Add to pending if key provided
      if (key) pendingUpdates.value.add(key)

      // Perform optimistic update
      optimisticUpdate()

      // Make API call
      const result = await apiCall()

      return result
    } catch (error) {
      // Rollback on error
      rollback()
      throw error
    } finally {
      // Clean up pending
      if (key) pendingUpdates.value.delete(key)
    }
  }

  return {
    execute,
    isPending: (key: string) => pendingUpdates.value.has(key),
  }
}
