// custom.logger.ts
import { ConsoleLogger, LoggerService } from '@nestjs/common'
import { createCentralizedLogger, Service, DomainsForService } from '@incubrain/logger'

export class CustomLogger extends ConsoleLogger implements LoggerService {
  private centralLogger = createCentralizedLogger<Service>()

  constructor(context?: string) {
    super(context)
    // Optionally set the service & domain here or in your Modules
    this.centralLogger.setServiceName(Service.API)
    this.centralLogger.setDomain('logging')
  }

  // Override log calls
  log(message: string, context?: any) {
    super.log(message, context)
    void this.centralLogger.info(message, context)
  }

  error(message: string, context?: any) {
    super.error(message, context)
    void this.centralLogger.error(message, context)
  }

  warn(message: string, context?: any) {
    super.warn(message, context)
    void this.centralLogger.warn(message, context)
  }

  debug(message: string, context?: any) {
    super.debug(message, context)
    void this.centralLogger.debug(message, context)
  }

  verbose(message: string, context?: any) {
    super.verbose(message, context)
    void this.centralLogger.verbose(message, context)
  }

  setDomain(domain: DomainsForService<Service.API>) {
    this.centralLogger.setDomain(domain)
  }
}
