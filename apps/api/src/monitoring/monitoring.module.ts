// src/monitoring/monitoring.module.ts
import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'
import { HttpModule } from '@nestjs/axios'
import { CoreModule } from '@core/core.module'
import { PrismaModule } from '@core/modules/prisma.module'
import { createDomainModule } from '@core/config/domain-config'
import { HealthController } from './controllers/health.controller'
import { MonitoringService } from './services/monitoring.service'

@Module({
  imports: [
    PrismaModule,
    CoreModule,
    TerminusModule,
    HttpModule,
    createDomainModule('monitoring', {
      requiresAuth: true,
      requiresCompany: false,
    }),
  ],
  controllers: [HealthController],
  providers: [MonitoringService],
  exports: [MonitoringService],
})
export class MonitoringModule {}
