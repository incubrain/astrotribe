// app.module.ejs
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { PrismaModule } from '@/core/prisma.module'
import { CoreModule } from '@core/core.module'
import configuration from '@core/config/configuration'

import { ContentModule } from '@content/content.module'
import { LoggerModule } from './core/logger/logger.module'
// app.module.ts

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
    }),
    PrismaModule,
    CoreModule,
    ContentModule,
    LoggerModule,
  ],
})
export class AppModule {}
