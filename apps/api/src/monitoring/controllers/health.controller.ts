// src/monitoring/controllers/health.controller.ts
import { Controller, Get, Options } from '@nestjs/common'
import { Public } from '@core/decorators/public.decorator'
import {
  HealthCheckService,
  HttpHealthIndicator,
  DiskHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus'
import { HealthCheck } from '@nestjs/terminus'

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @Public()
  @HealthCheck()
  async check() {
    return this.health.check([
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
      () => this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.9 }),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
    ])
  }
}
