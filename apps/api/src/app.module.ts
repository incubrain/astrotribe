// app.module.ejs
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { PrismaModule } from '@core/prisma.module'
import { CoreModule } from '@core/core.module'
import configuration from '@core/config/configuration'

import { ContentModule } from '@content/content.module'
import { MonitoringModule } from '@monitoring/monitoring.module'
import { LoggerModule } from './core/logger/logger.module'

@Module({
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
