import { Injectable } from '@nestjs/common'
import { Prisma } from '@astronera/db'
import { BaseService } from '@core/base/base.service'
import { PrismaService } from '@core/services/prisma.service'
import { PaginationService } from '@core/services/pagination.service'

@Injectable()
export class JobMetricService extends BaseService<'job_metrics'> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly paginationService: PaginationService,
  ) {
    // Pass in the Prisma model name to the super constructor
    super('job_metrics')
  }

  // Example custom method (e.g., filter by job_name or date range)
  async findMetricsByJobName(jobName: string) {
    return this.executePrismaQuery(() =>
      this.prisma.job_metrics.findMany({
        where: { job_name: jobName },
        orderBy: { created_at: 'desc' },
      }),
    )
  }
}
