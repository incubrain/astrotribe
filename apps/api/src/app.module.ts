// app.module.ejs
import * as path from 'path'
import { fileURLToPath } from 'url'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { PrismaModule } from '@core/prisma.module'
import { CoreModule } from '@core/core.module'
import configuration from '@core/config/configuration'

import { APP_GUARD } from '@nestjs/core'
import { PermissionGuard } from '@core/guards/permission.guard'
import { PermissionService } from '@core/services/permission.service'

import { ContentModule } from '@content/content.module'
import { MonitoringModule } from '@monitoring/monitoring.module'
import { LoggerModule } from '@core/logger/logger.module'
import { CustomLogger } from '@core/logger/custom.logger'

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
    PermissionService,
    {
      provide: CustomLogger,
      useValue: new CustomLogger('App'),
    },
  ],
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: path.resolve(__dirname, '../../../.env'),
      cache: true,
    }),
    PrismaModule,
    CoreModule,
    ContentModule,
    MonitoringModule,
    LoggerModule,
  ],
})
export class AppModule {}
