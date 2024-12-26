// src/jobs/versioning/job-version.service.ts
import { JsonValue } from '@prisma/client/runtime/library'
import { CustomLogger, PrismaService } from '@core'
import { JobConfig } from '@types'

export interface JobVersion {
  version: string
  changes: string[]
  config: JsonValue
  created_at: Date
}

export class JobVersionService {
  constructor(
    private readonly logger: CustomLogger,
    private readonly prisma: PrismaService,
  ) {
    this.logger.setDomain('job_versions')
  }

  private createSerializableConfig(config: JobConfig<any, any, any>) {
    return {
      name: config.name,
      version: config.version,
      domain: config.domain,
      changes: config.changes,
      priority: config.priority,
      batchSize: config.batchSize,
      processSize: config.processSize,
      timeout: config.timeout,
      retryLimit: config.retryLimit,
      schedule: {
        type: config.schedule?.type,
        customCron: config.schedule?.customCron,
        enabled: config.schedule?.enabled,
      },
      circuitBreaker: {
        enabled: config.circuitBreaker?.enabled,
        failureThreshold: config.circuitBreaker?.failureThreshold,
        resetTimeout: config.circuitBreaker?.resetTimeout,
      },
      handlerNames: {
        hasBeforeProcess: !!config.handlers.beforeProcess,
        hasProcessFunction: !!config.handlers.processFunction,
        hasAfterProcess: !!config.handlers.afterProcess,
        hasOnError: !!config.handlers.onError,
      },
    }
  }

  async createVersion(
    jobName: string,
    version: string,
    changes: string[],
    config: JobConfig<any, any, any>,
  ) {
    try {
      this.logger.debug('Creating/updating job version', {
        jobName,
        version,
        changes,
      })

      const serializableConfig = this.createSerializableConfig(config)

      // Use upsert to handle both creation and updates
      await this.prisma.job_versions.upsert({
        where: {
          job_name_version: {
            job_name: jobName,
            version: version,
          },
        },
        create: {
          job_name: jobName,
          version,
          changes,
          config: serializableConfig,
          created_at: new Date().toISOString(),
        },
        update: {
          changes,
          config: serializableConfig,
          updated_at: new Date().toISOString(),
        },
      })

      this.logger.info(`Created/updated version ${version} for job ${jobName}`)
    } catch (error: any) {
      // Check if it's a schema issue
      if (error.code === 'P2009') {
        this.logger.error(
          'Schema validation error - check if job_versions table has correct structure',
          error,
        )
      }
      this.logger.error(`Failed to create/update version for job ${jobName}`, error)
      throw error
    }
  }

  async getJobVersions(jobName: string): Promise<JobVersion[]> {
    try {
      return await this.prisma.job_versions.findMany({
        where: { job_name: jobName },
        orderBy: { created_at: 'desc' },
      })
    } catch (error: any) {
      this.logger.error(`Failed to get versions for job ${jobName}`, error)
      throw error
    }
  }

  async getLatestVersion(jobName: string): Promise<JobVersion | null> {
    try {
      return await this.prisma.job_versions.findFirst({
        where: { job_name: jobName },
        orderBy: { created_at: 'desc' },
      })
    } catch (error: any) {
      this.logger.error(`Failed to get latest version for job ${jobName}`, error)
      throw error
    }
  }

  async rollbackVersion(jobName: string, targetVersion: string) {
    try {
      const version = await this.prisma.job_versions.findFirst({
        where: { job_name: jobName, version: targetVersion },
      })

      if (!version) {
        throw new Error(`Version ${targetVersion} not found for job ${jobName}`)
      }

      const config = version.config as any
      await this.prisma.job_configs.update({
        where: { name: jobName },
        data: {
          priority: config.priority,
          metadata: config.metadata,
          retry_limit: config.retryLimit,
          schedule: config.schedule,
          circuit_breaker_threshold: config.circuitBreaker?.failureThreshold,
          circuit_breaker_timeout_ms: config.circuitBreaker?.resetTimeout,
          updated_at: new Date().toISOString(),
        },
      })

      this.logger.info(`Rolled back ${jobName} to version ${targetVersion}`)
    } catch (error: any) {
      this.logger.error(`Failed to rollback version for job ${jobName}`, error)
      throw error
    }
  }
}
