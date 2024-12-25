// src/infrastructure/logger/logger.types.ts
import { Service, DomainsForService } from '@ib/logger'

export type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'verbose' | 'silly'

export interface LogContext {
  jobId?: string
  jobName?: string
  domain?: DomainsForService<Service.JOBS>
  [key: string]: any
}
