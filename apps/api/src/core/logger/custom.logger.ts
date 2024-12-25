// custom.logger.ts
import { ConsoleLogger, LoggerService } from '@nestjs/common'
import { createCentralizedLogger, Service, DomainsForService } from '@ib/logger'

export class CustomLogger extends ConsoleLogger implements LoggerService {
  private centralLogger = createCentralizedLogger<Service>()

  constructor(context?: string) {
    super(context)
    // Optionally set the service & domain here or in your Modules
    this.centralLogger.setServiceName(Service.AUTH_SERVICE)
    this.centralLogger.setDomain('auth')
  }

  // Override log calls
  log(message: string, context?: string) {
    super.log(message, context)
    void this.centralLogger.info(message, { context })
  }

  error(message: string, trace?: string, context?: string) {
    super.error(message, trace, context)
    void this.centralLogger.error(message, { error: { stack: trace }, context })
  }

  warn(message: string, context?: string) {
    super.warn(message, context)
    void this.centralLogger.warn(message, { context })
  }

  debug(message: string, context?: string) {
    super.debug(message, context)
    void this.centralLogger.debug(message, { context })
  }

  verbose(message: string, context?: string) {
    super.verbose(message, context)
    void this.centralLogger.verbose(message, { context })
  }

  setDomain(domain: DomainsForService<Service.API>) {
    this.centralLogger.setDomain(domain)
  }
}
