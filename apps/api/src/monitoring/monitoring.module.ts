// src/monitoring/monitoring.module.ts
import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'
import { HttpModule } from '@nestjs/axios'
import { HealthController } from './controllers/health.controller'
import { MonitoringService } from './services/monitoring.service'

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthController],
  providers: [MonitoringService],
  exports: [MonitoringService],
})
export class MonitoringModule {}
