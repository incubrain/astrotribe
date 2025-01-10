// src/monitoring/monitoring.module.ts
import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'
import { HttpModule } from '@nestjs/axios'
import { CoreModule } from '@core/core.module'
import { PrismaModule } from '@core/modules/prisma.module'
import { createDomainModule } from '@core/config/domain-config'
import { HealthController } from './controllers/health.controller'
import { MonitoringService } from './services/monitoring.service'
import { ErrorMetricService } from './services/error-metrics.service'
import { LogService } from './services/log.service'
import { LogController } from './controllers/log.controller'
import { ErrorMetricController } from './controllers/error-metrics.controller'
import { LogGateway } from './gateways/log.gateway'

@Module({
  imports: [
    PrismaModule,
    CoreModule,
    TerminusModule,
    HttpModule,
    createDomainModule('monitoring', {
      requiresAuth: false,
      requiresCompany: false,
    }),
  ],
  controllers: [HealthController, LogController, ErrorMetricController],
  providers: [MonitoringService, LogService, ErrorMetricService, LogGateway],
  exports: [MonitoringService, LogService, ErrorMetricService],
})
export class MonitoringModule {}
