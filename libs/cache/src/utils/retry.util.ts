// src/utils/retry.ts
import type { RetryOptions } from '../types'

export async function retry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const {
    maxAttempts = 3,
    initialDelay = 100,
    maxDelay = 5000,
    backoff = 'exponential',
    onRetry,
  } = options

  let attempt = 1
  let delay = initialDelay

  while (true) {
    try {
      return await fn()
    } catch (error: any) {
      if (attempt >= maxAttempts) {
        throw error
      }

      if (onRetry) {
        await onRetry(attempt, error)
      }

      // Calculate next delay
      if (backoff === 'exponential') {
        delay = Math.min(delay * 2, maxDelay)
      } else {
        delay = Math.min(delay + initialDelay, maxDelay)
      }

      await new Promise((resolve) => setTimeout(resolve, delay))
      attempt++
    }
  }
}
