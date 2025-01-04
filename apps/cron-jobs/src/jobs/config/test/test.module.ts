// src/jobs/modules/test/test-job.module.ts
import { JobModule } from '../../registry/types'
import { createTestJob } from './test-job.config'

export const testJobModule: JobModule = {
  name: 'test_job',
  createJob: (services) =>
    createTestJob(services, {
      name: 'test_job',
      scheduleEnabled: true,
      scheduleType: 'interval',
    }),
}
