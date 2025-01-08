import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { JobMetrics, QueueStats, CircuitBreakerMetrics } from '@/types'

interface JobStats {
  name: string
  totalRuns: number
  successCount: number
  failureCount: number
  avgDuration: number
  lastRun?: Date
  status: 'active' | 'completed' | 'failed'
  successRate: number
  circuitBreaker?: CircuitBreakerMetrics
  performance?: {
    itemsPerSecond: number
    avgProcessingTime: number
    peakMemoryUsage: number
  }
}

export const useCronMetricsStore = defineStore('cronMetrics', () => {
  const { testEndpoint, addLog } = useApi()
  const pgBossJobs = ref<any[]>([])
  const pgBossSchedules = ref<any[]>([])
  const pgBossQueues = ref<any[]>([])
  const customJobMetrics = ref<JobMetrics[]>([])
  const circuitBreakerStates = ref<CircuitBreakerMetrics[]>([])
  const loading = ref(false)

  const jobStats = computed<JobStats[]>(() => {
    const stats: Record<string, JobStats> = {}

    pgBossJobs.value.forEach((job) => {
      const name = job.name
      if (!stats[name]) {
        stats[name] = {
          name,
          totalRuns: 0,
          successCount: 0,
          failureCount: 0,
          avgDuration: 0,
          status: job.state,
          successRate: 0,
        }
      }
      stats[name].totalRuns++
      if (job.state === 'completed') stats[name].successCount++
      if (job.state === 'failed') stats[name].failureCount++
    })

    customJobMetrics.value.forEach((metric) => {
      const name = metric.job_name
      if (!stats[name]) {
        stats[name] = {
          name,
          totalRuns: 0,
          successCount: 0,
          failureCount: 0,
          avgDuration: 0,
          status: metric.status,
          successRate: 0,
        }
      }

      stats[name].lastRun = new Date(metric.started_at)
      stats[name].avgDuration = metric.duration_ms || 0

      if (metric.metadata?.performance) {
        stats[name].performance = metric.metadata.performance
      }
    })

    circuitBreakerStates.value.forEach((cb) => {
      if (stats[cb.jobName]) {
        stats[cb.jobName].circuitBreaker = cb
      }
    })

    Object.values(stats).forEach((stat) => {
      stat.successRate = stat.totalRuns > 0 ? (stat.successCount / stat.totalRuns) * 100 : 0
    })

    return Object.values(stats)
  })

  const overallStats = computed(() => ({
    totalJobs: jobStats.value.length,
    totalRuns: jobStats.value.reduce((acc, job) => acc + job.totalRuns, 0),
    successRate: calculateOverallSuccessRate(),
    activeJobs: jobStats.value.filter((j) => j.status === 'active').length,
    failedJobs: jobStats.value.filter((j) => j.circuitBreaker?.state === 'open').length,
  }))

  function calculateOverallSuccessRate() {
    const total = jobStats.value.reduce((acc, job) => acc + job.totalRuns, 0)
    const successful = jobStats.value.reduce((acc, job) => acc + job.successCount, 0)
    return total ? (successful / total) * 100 : 0
  }

  async function fetchMetrics() {
    loading.value = true

    try {
      addLog('Fetching metrics from /api/v1/job-metrics')

      const metricsResult = await testEndpoint('/api/v1/job-metrics', { method: 'GET' })

      customJobMetrics.value = Array.isArray(metricsResult?.data) ? metricsResult.data : []
    } catch (error) {
      console.error('Error fetching metrics:', error)
    } finally {
      loading.value = false
    }
  }

  async function triggerSchedule(name: string, data?: any) {
    try {
      const response = await testEndpoint('POST', '/jobs/trigger', {
        name,
        priority: 5,
        data,
        state: 'created',
        retry_limit: 3,
        retry_delay: 1000,
        retry_backoff: true,
        start_after: new Date(),
        expire_in: '00:30:00',
      })

      addLog(`Job ${name} triggered successfully.`)
      return response
    } catch (error) {
      console.error(`Error triggering job ${name}:`, error)
      throw error
    }
  }

  return {
    jobStats,
    pgBossSchedules,
    pgBossQueues,
    loading,
    overallStats,
    fetchMetrics,
    triggerSchedule,
  }
})
