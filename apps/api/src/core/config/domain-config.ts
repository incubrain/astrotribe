// templates/core/config/domain-config.ejs
import { DynamicModule, Provider, MiddlewareConsumer } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'

import { AuthMiddleware } from '@core/middleware/auth.middleware'
import { PermissionGuard } from '@core/guards/permission.guard'
import { PlanGuard } from '@core/guards/plan.guard'
import { DomainConfig, CrossDomainConfig } from '@core/types'
import { CustomLogger } from '@core/logger/custom.logger'
import { PermissionService } from '@core/services/permission.service'
import { PrismaService } from '@core/services/prisma.service'
import { PermissionModule } from '@core/modules/permission.module'

export function createDomainModule(
  domainName: string,
  config: DomainConfig & CrossDomainConfig,
): DynamicModule {
  const providers: Provider[] = [
    // Logger provider with domain context
    {
      provide: CustomLogger,
      useFactory: () => {
        return new CustomLogger(domainName)
      },
    },
  ]

  if (config.requiresAuth) {
    providers.push({
      provide: APP_GUARD,
      useClass: PermissionGuard,
    })
  }

  return {
    module: class DynamicDomainModule {
      configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).forRoutes('*')
      }
    },
    imports: [PermissionModule],
    providers,
    exports: [CustomLogger],
    global: true,
  }
}
