// core/config/domain-config.ts
import { DynamicModule } from '@nestjs/common'
import { createCentralizedLogger, Service, DomainsForService } from '@ib/logger'

import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { CustomLogger } from '@core/logger/custom.logger'
import { CoreModule } from '../core.module'
import { PrismaModule } from '../modules/prisma.module'
import { PermissionModule } from '../modules/permission.module'

// Define the options interface
export interface DomainModuleOptions {
  requiresAuth?: boolean
  requiresCompany?: boolean
  // Add other options as needed
}

// Define a base module class
@Module({})
class DomainModule {}

// core/config/domain-config.ts
export function createDomainModule(
  domainName: DomainsForService<Service.API>,
  options: DomainModuleOptions,
): DynamicModule {
  return {
    module: DomainModule,
    providers: [
      {
        provide: CustomLogger,
        useFactory: () => {
          // Create a CustomLogger instance and set the domain once here.
          const logger = new CustomLogger()
          logger.setDomain(domainName) // or whatever domain naming you prefer
          return logger
        },
      },
    ],
    exports: [CustomLogger],
    global: false,
  }
}
