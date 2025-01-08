// core/config/domain-config.ts
import { createCentralizedLogger, Service, DomainsForService } from '@ib/logger'
import { DynamicModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { CustomLogger } from '@core/logger/custom.logger'

// Define the options interface
export interface DomainModuleOptions {
  requiresAuth?: boolean
  requiresCompany?: boolean
  // Add other options as needed
}

export function createDomainModule(
  domainName: DomainsForService<Service.API>,
  options: DomainModuleOptions,
): DynamicModule {
  @Module({})
  class DomainModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
      consumer.apply().forRoutes(`/api/${domainName}/*`) // Add a prefix dynamically
    }
  }

  return {
    module: DomainModule,
    providers: [
      {
        provide: CustomLogger,
        useFactory: () => {
          const logger = new CustomLogger()
          logger.setDomain(domainName)
          return logger
        },
      },
    ],
    exports: [CustomLogger],
    global: false,
  }
}
