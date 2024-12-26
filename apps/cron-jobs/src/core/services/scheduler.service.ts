// src/scheduler/scheduler.service.ts
import { QueueService, CustomLogger } from '@core'
import { jobConfigs } from '../../jobs/job.config'
import { JobConfig } from '@types'

export class SchedulerService {
  private readonly scheduleCache = new Map<string, string>()

  constructor(
    private readonly queueService: QueueService,
    private readonly logger: CustomLogger,
  ) {}

  private getScheduleCron(config: JobConfig): string {
    if (typeof config.schedule === 'string') {
      return config.schedule
    }

    // If it's a ScheduleConfig object, convert it to cron string
    // You'll need to implement this based on your ScheduleConfig interface
    throw new Error('Complex schedule configurations not yet implemented')
  }

  async initializeSchedules() {
    try {
      // Clear existing schedules
      await this.cleanupExistingSchedules()

      // Schedule all jobs from config
      for (const jobConfig of jobConfigs) {
        if (jobConfig.schedule) {
          await this.scheduleJob(jobConfig as any)
        }
      }

      this.logger.info('Job schedules initialized')
    } catch (error: any) {
      this.logger.error('Failed to initialize schedules', error)
      throw error
    }
  }

  private async cleanupExistingSchedules() {
    try {
      const existingSchedules = await this.queueService.getSchedules()
      for (const schedule of existingSchedules) {
        await this.queueService.unscheduleJob(schedule.name)
      }
    } catch (error: any) {
      this.logger.error('Failed to cleanup existing schedules', { ...error })
      throw error
    }
  }

  async scheduleJob(config: JobConfig) {
    try {
      const cronSchedule = this.getScheduleCron(config)

      const jobId = await this.queueService.scheduleJob(
        config.name,
        cronSchedule,
        { config },
        {
          priority: config.priority,
          retryLimit: config.retryLimit,
          timeout: config.timeout,
        },
      )

      this.logger.info(`Scheduled job ${config.name}`, {
        jobId,
        schedule: cronSchedule,
      })

      return jobId
    } catch (error: any) {
      this.logger.error(`Failed to schedule job ${config.name}`, {
        ...error,
        config,
      })
      throw error
    }
  }

  async pauseJob(jobName: string) {
    const scheduleId = this.scheduleCache.get(jobName)
    if (scheduleId) {
      await this.queueService.unscheduleJob(jobName)
      this.scheduleCache.delete(jobName)
      this.logger.info(`Paused job: ${jobName}`)
    }
  }

  async resumeJob(jobName: string) {
    const config = jobConfigs.find((j) => j.name === jobName)
    if (config?.schedule) {
      await this.scheduleJob(config as any)
    }
  }
}
