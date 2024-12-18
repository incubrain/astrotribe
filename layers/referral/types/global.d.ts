interface IPReputationCache {
  get(key: string): IPReputationRecord | undefined
  set(key: string, value: IPReputationRecord): void
  has(key: string): boolean
  delete(key: string): boolean
}

interface IPReputationRecord {
  blockedUntil: number
  failedAttempts: number
}

declare global {
  const ipReputationCache: Map<string, IPReputationRecord>
}
