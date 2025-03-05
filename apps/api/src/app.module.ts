// app.module.ts
import * as path from 'path'
import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'

import configuration from '@core/config/configuration'
import { CustomLogger } from '@core/logger/custom.logger'
// GUARDS
import { PermissionGuard } from '@core/guards/permission.guard'
// CORE modules
import { LoggerModule } from '@core/modules/logger.module'
import { PrismaModule } from '@core/modules/prisma.module'
import { CoreModule } from '@core/core.module'
// Feature modules
import { ContentModule } from '@content/content.module'
import { MonitoringModule } from '@monitoring/monitoring.module'
// New modules (for caching & jobs)
import { RedisModule } from '@core/cache/cache.module'
import { PaymentsModule } from '@payments/payment.module'
//import { JobModule } from '@jobs/job.module'
import { EventsModule } from './observables/events.module'

@Module({
  imports: [
    // 1) Global config
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: path.resolve(__dirname, '../../../.env'),
      cache: true,
    }),

    // 2) Core modules & services
    PrismaModule,
    EventsModule,
    CoreModule,
    LoggerModule,

    // 3) Feature modules
    ContentModule,
    MonitoringModule,
    //JobModule,
    PaymentsModule,

    // 4) Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
      },
    ]),

    // 5) Our new caching & jobs modules
    RedisModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
    {
      provide: CustomLogger,
      useValue: new CustomLogger(''),
    },
  ],
})
export class AppModule {}
