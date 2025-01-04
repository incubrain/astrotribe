// src/infrastructure/circuit-breaker/circuit-breaker.service.ts
import { CustomLogger, PrismaService, EventService } from '@core'
import { CircuitState, CircuitStatus } from '@types'

export class CircuitBreakerService {
  private readonly states = new Map<string, CircuitStatus>()
  private readonly failureThreshold = 5
  private readonly resetTimeout = 60000 // 1 minute

  constructor(
    private readonly logger: CustomLogger,
    private readonly prisma: PrismaService,
    private readonly events: EventService,
  ) {
    this.logger.setDomain('circuit_breaker')
  }

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
        failures: state.failure_count ?? 0,
        lastFailure: state.last_failure ?? new Date(0),
      }
    } catch (error: any) {
      this.logger.error(`Failed to load circuit state for ${jobName}`, {
        error,
        context: { jobName },
      })
      return {
        state: 'closed',
        failures: 0,
        lastFailure: new Date(0),
      }
    }
  }

  private async saveCircuitState(
    jobName: string,
    status: CircuitStatus,
    previousState?: CircuitState,
  ): Promise<void> {
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

      if (previousState && previousState !== status.state) {
        this.events.emit('circuit-breaker.state-changed', {
          jobName,
          previousState,
          newState: status.state,
          failures: status.failures,
        })

        this.logger.info(`Circuit state changed for ${jobName}`, {
          context: {
            jobName,
            previousState,
            newState: status.state,
            failures: status.failures,
          },
        })
      }
    } catch (error: any) {
      this.logger.error(`Failed to save circuit state for ${jobName}`, {
        error,
        context: { jobName, status },
      })
    }
  }

  async getCircuitState(jobName: string): Promise<CircuitStatus> {
    let status = this.states.get(jobName)

    if (!status) {
      status = await this.loadCircuitState(jobName)
      this.states.set(jobName, status)
    }

    if (status.state === 'open') {
      const now = new Date().getTime()
      const failureTime = status.lastFailure.getTime()

      if (now - failureTime > this.resetTimeout) {
        const previousState = status.state
        status.state = 'half-open'
        await this.saveCircuitState(jobName, status, previousState)
      }
    }

    return status
  }

  async recordSuccess(jobName: string): Promise<void> {
    const status = await this.getCircuitState(jobName)
    const previousState = status.state

    if (status.state === 'half-open') {
      status.state = 'closed'
      status.failures = 0
      await this.saveCircuitState(jobName, status, previousState)

      this.events.emit('circuit-breaker.success', {
        jobName,
        previousState,
      })
    }

    this.states.set(jobName, status)
  }

  async recordFailure(jobName: string, error: Error): Promise<void> {
    const status = await this.getCircuitState(jobName)
    const previousState = status.state

    status.failures++
    status.lastFailure = new Date()

    if (status.failures >= this.failureThreshold) {
      status.state = 'open'

      this.events.emit('circuit-breaker.failure', {
        jobName,
        error,
        failures: status.failures,
        threshold: this.failureThreshold,
      })

      this.logger.warn(`Circuit opened after ${status.failures} failures`, {
        context: {
          jobName,
          failures: status.failures,
          error: error.message,
        },
      })
    }

    await this.saveCircuitState(jobName, status, previousState)
    this.states.set(jobName, status)
  }

  async executeWithBreaker<T>(
    jobName: string,
    operation: () => Promise<T>,
    timeout: number = 30000,
  ): Promise<T> {
    const status = await this.getCircuitState(jobName)

    if (status.state === 'open') {
      this.logger.warn(`Circuit breaker is open`, {
        context: {
          jobName,
          failures: status.failures,
          lastFailure: status.lastFailure,
        },
      })
      throw new Error('Circuit breaker is open')
    }

    try {
      const result = (await Promise.race([
        operation(),
        new Promise((_, reject) => {
          setTimeout(() => {
            const timeoutError = new Error('Operation timed out')
            this.events.emit('circuit-breaker.timeout', {
              jobName,
              timeoutMs: timeout,
            })
            reject(timeoutError)
          }, timeout)
        }),
      ])) as T

      await this.recordSuccess(jobName)
      return result
    } catch (error: any) {
      await this.recordFailure(jobName, error)
      throw error
    }
  }

  async resetCircuit(jobName: string): Promise<void> {
    const currentStatus = await this.getCircuitState(jobName)
    const previousState = currentStatus.state

    const status = {
      state: 'closed' as CircuitState,
      failures: 0,
      lastFailure: new Date(0),
    }

    await this.saveCircuitState(jobName, status, previousState)
    this.states.set(jobName, status)

    this.logger.info(`Circuit manually reset`, {
      context: {
        jobName,
        previousState: currentStatus.state,
      },
    })
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
