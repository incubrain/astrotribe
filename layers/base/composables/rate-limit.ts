interface RateLimitOptions {
  limitMs: number
}

export function useRateLimit() {
  const lastActionTimes = ref<Map<string, number>>(new Map())

  const checkRateLimit = async (action: string, options: RateLimitOptions): Promise<void> => {
    const now = Date.now()
    const lastActionTime = lastActionTimes.value.get(action) || 0
    const timeElapsed = now - lastActionTime

    if (timeElapsed < options.limitMs) {
      const waitTime = options.limitMs - timeElapsed
      await new Promise((resolve) => setTimeout(resolve, waitTime))
    }

    lastActionTimes.value.set(action, Date.now())
  }

  return {
    checkRateLimit,
  }
}
