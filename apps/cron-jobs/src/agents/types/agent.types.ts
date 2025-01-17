import { DomainsForService } from '@types'
import { Service } from '@ib/logger'

export interface AgentConfig {
  name: string
  domain: DomainsForService<Service.JOBS>
  openAIModel: string
  maxRetries?: number
  timeout?: number
  handlers: {
    beforeProcess?: () => Promise<any>
    processFunction: (data: any, input: any) => Promise<any>
    afterProcess?: (data: any) => Promise<any>
  }
}

export interface AgentInput {
  data: any
  metadata?: Record<string, any>
}

export interface AgentOutput {
  result: any
  metadata?: Record<string, any>
}

export interface AgentMetrics {
  agent_name: string
  execution_date: Date
  duration_ms: number
  status: 'success' | 'failure'
  error_message?: string
  error_stack?: string
  metadata?: Record<string, any>
}
