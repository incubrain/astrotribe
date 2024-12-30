// src/infrastructure/workflow/workflow.service.ts
import { QueueService, CustomLogger } from '@core'
import { JobConfig, WorkflowJob } from '@types'

export class WorkflowService {
  constructor(
    private readonly queueService: QueueService,
    private readonly logger: CustomLogger,
  ) {}

  async createWorkflow(options: {
    name: string
    jobs: JobConfig<any, any, any>[]
    onComplete?: (result: any) => Promise<void>
    onFail?: (error: Error) => Promise<void>
  }) {
    const { name, jobs, onComplete, onFail } = options

    try {
      // Create parent job
      const workflowId = await this.queueService.addJob(name, {
        jobs: jobs.map((j) => j.name),
      })

      // Schedule child jobs with dependencies
      for (const job of jobs) {
        await this.queueService.addJob(
          job.name,
          {
            ...job,
            workflowId,
          },
          {
            startAfter: `$completed:${workflowId}`, // pg-boss dependency syntax
          },
        )
      }

      // Handle completion/failure
      if (onComplete) {
        await this.queueService.processJob(`${name}:complete`, async (job: any) => {
          await onComplete(job.data)
        })
      }

      if (onFail) {
        await this.queueService.processJob(`${name}:fail`, async (job: any) => {
          await onFail(job.data.error)
        })
      }

      return workflowId
    } catch (error: any) {
      this.logger.error(`Failed to create workflow ${name}`, error)
      throw error
    }
  }

  async getWorkflowStatus(workflowId: string, name: string) {
    try {
      const job = (await this.queueService.getWorkflowJob(name, workflowId)) as WorkflowJob

      return {
        id: workflowId,
        status: job.state ?? 'pending',
        progress: job.data?.progress ?? 0,
        childJobs: job.data?.jobs ?? [],
      }
    } catch (error: any) {
      this.logger.error(`Failed to get workflow status`, {
        ...error,
        workflowId,
        name,
      })
      throw error
    }
  }
}
