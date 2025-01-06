// permission.module.ts
import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD, Reflector } from '@nestjs/core'
import { CustomLogger } from '@core/logger/custom.logger'
import { PermissionService } from '../services/permission.service'
import { PermissionGuard } from '../guards/permission.guard'
import { PrismaModule } from '../modules/prisma.module'
import { DebugService } from '../services/debug.service'

@Global()
@Module({
  imports: [ConfigModule, PrismaModule],
  providers: [
    PermissionService,
    Reflector,
    {
      provide: CustomLogger,
      useFactory: () => new CustomLogger('Permission'),
    },
    {
      provide: APP_GUARD,
      useFactory: (
        permissionService: PermissionService,
        logger: CustomLogger,
        reflector: Reflector,
        debugService: DebugService,
      ) => {
        return new PermissionGuard(permissionService, logger, reflector, debugService)
      },
      inject: [PermissionService, CustomLogger, Reflector, DebugService],
    },
  ],
  exports: [PermissionService],
})
export class PermissionModule {}
