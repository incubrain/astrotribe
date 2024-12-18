import { Global, Module } from '@nestjs/common'
import { PermissionService } from '@core/services/permission.service'
import { PrismaService } from '@core/services/prisma.service'
import { ConfigService } from '@nestjs/config'
import { CustomLogger } from '@core/logger/custom.logger'

@Global()
@Module({
  providers: [
    PermissionService,
    PrismaService,
    ConfigService,
    {
      provide: CustomLogger,
      useFactory: () => {
        return new CustomLogger('PermissionModule')
      },
    },
  ],
  exports: [PermissionService],
})
export class PermissionModule {}
