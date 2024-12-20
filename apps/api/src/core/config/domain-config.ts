// core/config/domain-config.ts
import { DynamicModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { CustomLogger } from '@core'
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
export function createDomainModule(name: string, options: DomainModuleOptions): DynamicModule {
  return {
    module: DomainModule,
    providers: [
      {
        provide: CustomLogger,
        useFactory: () => new CustomLogger(name),
      },
    ],
    exports: [],
    global: false,
  }
}
