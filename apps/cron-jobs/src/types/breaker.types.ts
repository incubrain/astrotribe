export type CircuitState = 'closed' | 'open' | 'half-open'

export interface CircuitStatus {
  state: CircuitState
  failures: number
  lastFailure: Date
}

export interface CircuitBreakerEvents {
  'circuit-breaker.state-changed': {
    jobName: string
    previousState: CircuitState
    newState: CircuitState
    failures: number
  }
  'circuit-breaker.failure': {
    jobName: string
    error: Error
    failures: number
    threshold: number
  }
  'circuit-breaker.success': {
    jobName: string
    previousState: CircuitState
  }
  'circuit-breaker.timeout': {
    jobName: string
    timeoutMs: number
  }
}
