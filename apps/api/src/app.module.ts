// app.module.ejs
import * as path from 'path'
import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'

import configuration from '@core/config/configuration'
import { CustomLogger } from '@core/logger/custom.logger'

// GUARDS
import { PermissionGuard } from '@core/guards/permission.guard'


// MODULES CANNOT BE EXPORTED / IMPORTED FROM A BARREL FILE
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { ContentModule } from '@content/content.module'
import { MonitoringModule } from '@monitoring/monitoring.module'
import { LoggerModule } from '@/core/modules/logger.module'
import { PrismaModule } from '@core/modules/prisma.module'
import { CoreModule } from '@core/core.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: path.resolve(__dirname, '../../../.env'),
      cache: true,
    }),
    PrismaModule,
    CoreModule,
    ContentModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
      },
    ]),
    MonitoringModule,
    LoggerModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
    {
      provide: CustomLogger,
      useValue: new CustomLogger('App'),
    },
  ],
})
export class AppModule {}
