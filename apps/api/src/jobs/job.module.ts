import { Module } from '@nestjs/common'
import { JobConfigController } from './controllers/job-config.controller'
import { JobConfigService } from './services/job-config.service'
import { JobMetricController } from './controllers/job-metric.controller'
import { JobMetricService } from './services/job-metric.service'

@Module({
  controllers: [JobConfigController, JobMetricController],
  providers: [JobConfigService, JobMetricService],
  exports: [JobConfigService, JobMetricService],
})
export class JobModule {}
