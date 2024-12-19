// core/config/domain-config.ts
import { DynamicModule, Module } from '@nestjs/common'
import { PermissionModule } from '../permission.module'
import { CustomLogger } from '@core/logger/custom.logger'

// Define the options interface
export interface DomainModuleOptions {
  requiresAuth?: boolean
  requiresCompany?: boolean
  // Add other options as needed
}

// Define a base module class
@Module({})
class DomainModule {}

export function createDomainModule(name: string, options: DomainModuleOptions): DynamicModule {
  return {
    module: DomainModule,
    imports: [PermissionModule],
    providers: [
      {
        provide: CustomLogger,
        useFactory: () => new CustomLogger(name),
      },
    ],
    exports: [CustomLogger],
    global: true,
  }
}
