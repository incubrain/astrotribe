import { Injectable } from '@nestjs/common'
import { BaseService } from '@core/base/base.service'
import { PrismaService } from '@core/services/prisma.service'
import { PaginationService } from '@core/services/pagination.service'

@Injectable()
export class JobConfigService extends BaseService<'JobConfigs'> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly paginationService: PaginationService,
  ) {
    super('JobConfigs')
  }

  // Example custom method
  async getAllJobConfigs(query: any) {
    // Your custom logic or direct calls to executePrismaQuery, e.g.:
    return this.executePrismaQuery(() =>
      // This could be further refined to include pagination, filtering, etc.
      this.prisma.jobConfigs.findMany({
        where: {},
        orderBy: { created_at: 'desc' },
      }),
    )
  }
}
