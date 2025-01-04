// stores/jobMetrics.ts
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
  const pgBossJobs = ref<any[]>([])
  const pgBossSchedules = ref<any[]>([])
  const pgBossQueues = ref<any[]>([])
  const customJobMetrics = ref<JobMetrics[]>([])
  const circuitBreakerStates = ref<CircuitBreakerMetrics[]>([])
  const loading = ref(false)

  const jobStats = computed<JobStats[]>(() => {
    // Combine pg_boss and custom metrics
    const stats: Record<string, JobStats> = {}

    // Process pg_boss jobs
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

    // Merge custom metrics
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

    // Add circuit breaker info
    circuitBreakerStates.value.forEach((cb) => {
      if (stats[cb.jobName]) {
        stats[cb.jobName].circuitBreaker = cb
      }
    })

    // Calculate success rates
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
    const client = useSupabaseClient()
    loading.value = true

    try {
      const [pgBossResult, metricsResult, circuitBreakerResult, scheduleResult, queueResult] =
        await Promise.all([
          // Fetch pg_boss data
          client
            .schema('pgboss')
            .from('job')
            .select('*')
            .order('createdon', { ascending: false })
            .limit(100),
          // Fetch custom metrics
          client.from('job_metrics').select('*').order('created_at', { ascending: false }),
          // Fetch circuit breaker states
          client.from('circuit_breaker_states').select('*'),
          // Fetch schedules
          client.schema('pgboss').from('schedule').select('*'),
          // Fetch queue configs
          client.schema('pgboss').from('queue').select('*'),
        ])

      pgBossJobs.value = pgBossResult.data || []
      customJobMetrics.value = metricsResult.data || []
      circuitBreakerStates.value = circuitBreakerResult.data || []
      pgBossSchedules.value = scheduleResult.data || []
      pgBossQueues.value = queueResult.data || []
    } catch (error) {
      console.error('Error fetching metrics:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function triggerSchedule(name: string, data?: any) {
    const client = useSupabaseClient()
    try {
      // Implementation remains the same
    } finally {
      loading.value = false
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
