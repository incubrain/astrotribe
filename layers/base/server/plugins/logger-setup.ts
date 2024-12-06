// server/plugins/logger.ts
import { createCentralizedLogger } from '@ib/logger'
import type { Service, CentralizedLogger } from '@ib/logger'

export default defineNitroPlugin((nitroApp) => {
  const config = useRuntimeConfig()
  const serviceName = (config.serviceName ?? config.public.serviceName ?? 'api-gateway') as Service

  const logger = createCentralizedLogger<typeof serviceName>()
  logger.setServiceName(serviceName)

  // Add type information to the event context
  type EventContext = {
    logger: CentralizedLogger<typeof serviceName>
  }

  nitroApp.hooks.hook('request', (event) => {
    // Type-safe assignment to event context
    ;(event.context as EventContext).logger = logger
  })
})
