// src/jobs/job.events.ts
import { CustomLogger, EventService } from "@/core"


export class JobEvents {
  constructor(
    private readonly eventService: EventService,
    private readonly logger: CustomLogger,
  ) {
    this.setupEventHandlers()
    this.logger.setDomain('job_events')
  }

  private setupEventHandlers() {
    this.eventService.on('job.started', (jobName: string, jobId: string) => {
      this.logger.info(`Job started`, { jobName, jobId })
    })

    this.eventService.on('job.completed', (jobName: string, jobId: string, result: any) => {
      this.logger.info(`Job completed`, { jobName, jobId, result })
    })

    this.eventService.on('job.failed', (jobName: string, jobId: string, error: Error) => {
      this.logger.error(`Job failed`, error, { jobName, jobId })
    })

    this.eventService.on('job.progress', (jobName: string, jobId: string, progress: number) => {
      this.logger.debug(`Job progress: ${progress}%`, { jobName, jobId, progress })
    })
  }
}