// permission.module.ts
import { Global, Module } from '@nestjs/common'
import { CustomLogger } from '@core/logger/custom.logger'
import { APP_GUARD, Reflector } from '@nestjs/core'
import { PermissionService } from './services/permission.service'
import { PermissionGuard } from './guards/permission.guard'

@Global()
@Module({
  imports: [], // Add any required imports
  providers: [
    PermissionService,
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
      ) => {
        return new PermissionGuard(permissionService, logger, reflector)
      },
      inject: [PermissionService, CustomLogger, Reflector],
    },
  ],
  exports: [PermissionService, CustomLogger],
})
export class PermissionModule {}
