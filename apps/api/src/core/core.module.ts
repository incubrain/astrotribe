// core.module.ts
import { Module, Global } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { LoggerModule } from './modules/logger.module'
import { PaginationService } from './services/pagination.service'
import { PermissionModule } from './modules/permission.module'
import { PrismaModule } from './modules/prisma.module'

@Global()
@Module({
  imports: [ConfigModule, PrismaModule, LoggerModule, PermissionModule],
  providers: [PaginationService],
  exports: [PaginationService, LoggerModule, PermissionModule],
})
export class CoreModule {}
