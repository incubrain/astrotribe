import { Module } from '@nestjs/common'
import { JobConfigController } from './controllers/job-config.controller'
import { JobConfigService } from './services/job-config.service'
import { JobMetricController } from './controllers/job-metric.controller'
import { JobMetricService } from './services/job-metric.service'
import { AgentController } from './controllers/agent.controller'
import { AgentService } from './services/agent.service'

@Module({
  controllers: [JobConfigController, JobMetricController, AgentController],
  providers: [JobConfigService, JobMetricService, AgentService],
  exports: [JobConfigService, JobMetricService, AgentService],
})
export class JobModule {}
