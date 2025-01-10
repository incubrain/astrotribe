// src/monitoring/controllers/health.controller.ts
import { Controller, Get, OnModuleInit, OnModuleDestroy, Req } from '@nestjs/common'
import { Request } from 'express'
import { Public } from '@core/decorators/public.decorator'
import { CustomLogger } from '@core/logger/custom.logger'
import {
  HealthCheckService,
  HttpHealthIndicator,
  DiskHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus'
import { HealthCheck } from '@nestjs/terminus'

@Controller('monitoring')
export class HealthController implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new CustomLogger('Health')
  private healthCheckInterval: NodeJS.Timeout | null = null

  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator,
  ) {}

  onModuleInit() {
    this.healthCheckInterval = setInterval(
      () => {
        this.performHealthCheck()
      },
      60 * 1000 * 30,
    )
  }

  private async performHealthCheck() {
    return this.health.check([
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
      () => this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.9 }),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
    ])
  }

  onModuleDestroy() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval)
    }
  }

  @Get('health')
  @Public()
  @HealthCheck()
  async check(@Req() req: Request) {
    this.logger.log('Health check endpoint called', {
      timestamp: new Date().toISOString(),
      headers: req.headers,
      ip: req.ip,
      method: req.method,
      path: req.path,
    })
    return this.performHealthCheck()
  }
}
