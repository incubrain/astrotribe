// src/jobs/versioning/job-version.service.ts
import { JsonValue } from '@prisma/client/runtime/library'
import { CustomLogger } from '../../core/services/logger.service'
import { PrismaService } from '../../core/services/prisma.service'

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

  async createVersion(
    jobName: string,
    version: string,
    changes: string[],
    config: Record<string, any>,
  ) {
    try {
      this.logger.debug('Creating job version', {
        jobName,
        version,
        changes,
      })

      await this.prisma.job_versions.create({
        data: {
          job_name: jobName,
          version,
          changes,
          config,
          created_at: new Date().toISOString(),
        },
      })

      this.logger.info(`Created version ${version} for job ${jobName}`)
    } catch (error: any) {
      this.logger.error(`Failed to create version for job ${jobName}`, error)
      throw error
    }
  }

  async getJobVersions(jobName: string): Promise<JobVersion[]> {
    return this.prisma.job_versions.findMany({
      where: { job_name: jobName },
      orderBy: { created_at: 'desc' },
    })
  }

  async getLatestVersion(jobName: string): Promise<JobVersion | null> {
    return this.prisma.job_versions.findFirst({
      where: { job_name: jobName },
      orderBy: { created_at: 'desc' },
    })
  }

  async rollbackVersion(jobName: string, targetVersion: string) {
    const version = await this.prisma.job_versions.findFirst({
      where: { job_name: jobName, version: targetVersion },
    })

    if (!version) {
      throw new Error(`Version ${targetVersion} not found for job ${jobName}`)
    }

    // Update job config to match target version
    await this.prisma.job_configs.update({
      where: { name: jobName },
      data: { ...Object.values(version.config) },
    })

    this.logger.info(`Rolled back ${jobName} to version ${targetVersion}`)
  }
}
