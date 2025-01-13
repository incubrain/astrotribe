// src/agents/monitoring.agent.ts

import { CustomLogger, CacheService } from '@core'
import { JobServices } from '@types'
import { AgentConfig, AgentInput, AgentOutput } from './types'

// Cache key structure
const CACHE_KEYS = {
  latestRun: (agentName: string) => `agent:${agentName}:latest`,
  runData: (agentName: string, runId: string) => `agent:${agentName}:run:${runId}`,
}

interface RunMetrics {
  agent_name: string
  execution_date: Date
  status: 'success' | 'failure'
  duration_ms: number
  items_processed: number
  error_type?: string
  error_message?: string
}

interface StepExecution {
  name: string
  startTime: number
  endTime?: number
  status: 'running' | 'completed' | 'failed'
  error?: Error
  input?: any
  output?: any
}

interface RunData {
  id: string
  agent_name: string
  start_time: number
  status: 'running' | 'completed' | 'failed'
  steps: StepExecution[]
  error?: {
    type: string
    message: string
    stack?: string
  }
}

export class Agent {
  private readonly logger: CustomLogger
  private readonly cache: CacheService
  private currentRunId: string | null = null

  constructor(
    private readonly services: JobServices,
    private readonly config: AgentConfig,
  ) {
    this.logger = services.logger
    this.cache = services.cache
    this.logger.setDomain(config.domain)
  }

  public async execute(input: AgentInput): Promise<AgentOutput> {
    this.currentRunId = crypto.randomUUID()
    const startTime = Date.now()

    // Initialize run in cache
    await this.cache.cacheRunStart('agent', this.config.name, this.currentRunId)

    try {
      // Execute each step with monitoring
      const beforeProcessResult = await this.executeStep('beforeProcess', async () =>
        this.config.handlers.beforeProcess?.(),
      )

      const processResult = await this.executeStep('processFunction', async () =>
        this.config.handlers.processFunction(beforeProcessResult, input),
      )

      const afterProcessResult = await this.executeStep('afterProcess', async () =>
        this.config.handlers.afterProcess?.(processResult),
      )

      // Record successful completion
      await this.recordSuccess(startTime, processResult?.length || 0)

      return afterProcessResult
    } catch (error: any) {
      // Record failure
      await this.recordFailure(startTime, error)
      throw error
    }
  }

  private async executeStep(stepName: string, action: () => Promise<any>): Promise<any> {
    try {
      await this.cache.cacheRunStep('agent', this.config.name, this.currentRunId!, {
        name: stepName,
        status: 'running',
      })

      const result = await action()

      await this.cache.cacheRunStep('agent', this.config.name, this.currentRunId!, {
        name: stepName,
        status: 'completed',
      })

      return result
    } catch (error: any) {
      await this.cache.cacheRunStep('agent', this.config.name, this.currentRunId!, {
        name: stepName,
        status: 'failed',
        error: {
          message: error.message,
          stack: error.stack,
        },
      })
      throw error
    }
  }

  private async recordSuccess(startTime: number, itemsProcessed: number): Promise<void> {
    const duration = Date.now() - startTime

    await this.cache.cacheRunComplete('agent', this.config.name, this.currentRunId!, true)

    // Store metrics
    await this.services.prisma.AgentMetrics.create({
      data: {
        agent_name: this.config.name,
        execution_date: new Date(),
        status: 'success',
        duration_ms: duration,
        items_processed: itemsProcessed,
      },
    })

    this.logger.info(`Agent ${this.config.name} completed successfully`, {
      runId: this.currentRunId,
      duration,
      itemsProcessed,
    })
  }

  private async recordFailure(startTime: number, error: Error): Promise<void> {
    const duration = Date.now() - startTime

    await this.cache.cacheRunComplete('agent', this.config.name, this.currentRunId!, false, error)

    // Store metrics
    await this.services.prisma.AgentMetrics.create({
      data: {
        agent_name: this.config.name,
        execution_date: new Date(),
        status: 'failure',
        duration_ms: duration,
        items_processed: 0,
        error_type: error.constructor.name,
        error_message: error.message,
      },
    })

    this.logger.error(`Agent ${this.config.name} failed`, {
      runId: this.currentRunId,
      duration,
      error,
    })
  }

  public async getLatestRun() {
    return this.cache.getLatestRun('agent', this.config.name)
  }
}
