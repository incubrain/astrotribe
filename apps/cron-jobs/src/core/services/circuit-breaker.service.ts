// src/infrastructure/circuit-breaker/circuit-breaker.service.ts
import { CustomLogger, PrismaService } from '@core'

type CircuitState = 'closed' | 'open' | 'half-open'

interface CircuitStatus {
  state: CircuitState
  failures: number
  lastFailure: Date
}

export class CircuitBreakerService {
  private readonly states = new Map<string, CircuitStatus>()
  private readonly failureThreshold = 5
  private readonly resetTimeout = 60000 // 1 minute

  constructor(
    private readonly logger: CustomLogger,
    private readonly prisma: PrismaService,
  ) {}

  private async loadCircuitState(jobName: string): Promise<CircuitStatus> {
    try {
      const state = await this.prisma.circuit_breaker_states.findUnique({
        where: { job_name: jobName },
      })

      if (!state) {
        return {
          state: 'closed',
          failures: 0,
          lastFailure: new Date(0),
        }
      }

      return {
        state: state.state as CircuitState,
        failures: state.failure_count,
        lastFailure: state.last_failure,
      }
    } catch (error: any) {
      this.logger.error(`Failed to load circuit state for ${jobName}`, error)
      return {
        state: 'closed',
        failures: 0,
        lastFailure: new Date(0),
      }
    }
  }

  private async saveCircuitState(jobName: string, status: CircuitStatus): Promise<void> {
    try {
      await this.prisma.circuit_breaker_states.upsert({
        where: { job_name: jobName },
        create: {
          job_name: jobName,
          state: status.state,
          failure_count: status.failures,
          last_failure: status.lastFailure,
          updated_at: new Date(),
        },
        update: {
          state: status.state,
          failure_count: status.failures,
          last_failure: status.lastFailure,
          updated_at: new Date(),
        },
      })
    } catch (error: any) {
      this.logger.error(`Failed to save circuit state for ${jobName}`, error)
    }
  }

  async getCircuitState(jobName: string): Promise<CircuitStatus> {
    let status = this.states.get(jobName)

    if (!status) {
      status = await this.loadCircuitState(jobName)
      this.states.set(jobName, status)
    }

    // Check if circuit should be reset
    if (status.state === 'open') {
      const now = new Date().getTime()
      const failureTime = status.lastFailure.getTime()

      if (now - failureTime > this.resetTimeout) {
        status.state = 'half-open'
        await this.saveCircuitState(jobName, status)
        this.logger.info(`Circuit for ${jobName} changed to half-open`)
      }
    }

    return status
  }

  async recordSuccess(jobName: string): Promise<void> {
    const status = await this.getCircuitState(jobName)

    if (status.state === 'half-open') {
      status.state = 'closed'
      status.failures = 0
      await this.saveCircuitState(jobName, status)
      this.logger.info(`Circuit for ${jobName} closed after success`)
    }

    this.states.set(jobName, status)
  }

  async recordFailure(jobName: string): Promise<void> {
    const status = await this.getCircuitState(jobName)
    status.failures++
    status.lastFailure = new Date()

    if (status.failures >= this.failureThreshold) {
      status.state = 'open'
      this.logger.warn(`Circuit for ${jobName} opened after ${status.failures} failures`)
    }

    await this.saveCircuitState(jobName, status)
    this.states.set(jobName, status)
  }

  async executeWithBreaker<T>(
    jobName: string,
    operation: () => Promise<T>,
    timeout: number = 30000,
  ): Promise<T> {
    const status = await this.getCircuitState(jobName)

    if (status.state === 'open') {
      this.logger.warn(`Circuit breaker is open for ${jobName}`)
      throw new Error('Circuit breaker is open')
    }

    try {
      const result = (await Promise.race([
        operation(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Operation timed out')), timeout),
        ),
      ])) as T

      await this.recordSuccess(jobName)
      return result
    } catch (error: any) {
      await this.recordFailure(jobName)
      this.logger.error(`Circuit breaker caught error for ${jobName}`, error)
      throw error
    }
  }

  // Utility methods
  async resetCircuit(jobName: string): Promise<void> {
    const status = {
      state: 'closed' as CircuitState,
      failures: 0,
      lastFailure: new Date(0),
    }

    await this.saveCircuitState(jobName, status)
    this.states.set(jobName, status)
    this.logger.info(`Circuit for ${jobName} manually reset`)
  }

  async getCircuitStats(jobName: string) {
    const status = await this.getCircuitState(jobName)
    return {
      jobName,
      state: status.state,
      failures: status.failures,
      lastFailure: status.lastFailure,
      isOpen: status.state === 'open',
      timeInCurrentState: Date.now() - status.lastFailure.getTime(),
    }
  }
}
