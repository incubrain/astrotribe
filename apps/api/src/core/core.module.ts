// core.module.ts
import { Module, Global } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { LoggerModule } from './modules/logger.module'
import { PaginationService } from './services/pagination.service'
import { PermissionModule } from './modules/permission.module'
import { PrismaModule } from './modules/prisma.module'
import { DebugService } from './services/debug.service'

@Global()
@Module({
  imports: [ConfigModule, PrismaModule, LoggerModule, PermissionModule],
  providers: [PaginationService, DebugService, Reflector],
  exports: [PaginationService, LoggerModule, PermissionModule, DebugService, Reflector],
})
export class CoreModule {}
