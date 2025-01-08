export interface RedisConfig {
  host?: string
  port?: number
  username?: string
  password?: string
  db?: number
  keyPrefix?: string
  connectionName?: string
  maxRetriesPerRequest?: number
  enableReadyCheck?: boolean
  autoResubscribe?: boolean
  autoResendUnfulfilledCommands?: boolean
  retryStrategy?(times: number): number | null
}

export interface RedisClientEvents {
  connect: () => void
  ready: () => void
  error: (error: Error) => void
  close: () => void
  reconnecting: (params: { delay: number; attempt: number }) => void
}
