// layers/base/plugins/logger.ts
import { createCentralizedLogger } from '@ib/logger'
import type { Service, CentralizedLogger } from '@ib/logger'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const serviceName = (config.public.serviceName ?? 'app') as Service

  const logger = createCentralizedLogger<typeof serviceName>()
  logger.setServiceName(serviceName)

  return {
    provide: {
      logger,
    },
  }
})
