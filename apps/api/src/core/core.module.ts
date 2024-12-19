import { Module, Global } from '@nestjs/common'
import { LoggerModule } from './logger/logger.module'
import { PrismaService } from './services/prisma.service'
import { PaginationService } from './services/pagination.service'
import { PermissionModule } from './permission.module'

@Global()
@Module({
  providers: [LoggerModule, PrismaService, PaginationService, PermissionModule],
  exports: [LoggerModule, PrismaService, PaginationService, PermissionModule],
})
export class CoreModule {}
