// src/monitoring/services/monitoring.service.ts
import { Injectable } from '@nestjs/common'

@Injectable()
export class MonitoringService {
  async getSystemMetrics() {
    return {
      timestamp: new Date(),
      // Add more system metrics here
    }
  }
}
