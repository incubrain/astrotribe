// src/jobs/config/job.config.ts
import type { JobClass } from '@types'
import { NewsLinksJob } from './config/news/news-links.config'

export interface JobConfig {
  name: string
  Class: JobClass
  schedule?: string
  priority: 'low' | 'normal' | 'high' | 'critical'
  timeout: number
  retryLimit: number
  circuitBreaker: {
    enabled: boolean
    failureThreshold: number
    resetTimeout: number
  }
  tags?: string[]
}

export const jobConfigs: JobConfig[] = [
  {
    name: 'news_links',
    Class: NewsLinksJob,
    schedule: '0 */1 * * *', // Every hour
    priority: 'high',
    timeout: 600000, // 10 minutes
    retryLimit: 3,
    circuitBreaker: {
      enabled: true,
      failureThreshold: 3,
      resetTimeout: 300000, // 5 minutes
    },
    tags: ['news', 'content'],
  },
  // ... other job configs
]

// Helper functions to work with job configs
export function getJobConfig(name: string): JobConfig | undefined {
  return jobConfigs.find((config) => config.name === name)
}

export function getJobConfigs(): JobConfig[] {
  return jobConfigs
}

// Types
export type JobPriority = JobConfig['priority']
export type JobCircuitBreakerConfig = JobConfig['circuitBreaker']
