// src/infrastructure/logger/logger.service.ts
import { createCentralizedLogger, Service, DomainsForService, LogContext } from '@ib/logger';

export class CustomLogger {
  private centralLogger;
  private context?: string;
  private domain?: DomainsForService<Service.JOBS>;

  constructor(context?: string) {
    this.context = context;
    this.centralLogger = createCentralizedLogger<Service>();
    this.centralLogger.setServiceName(Service.JOBS);
  }

  setDomain(domain: DomainsForService<Service.JOBS>) {
    this.domain = domain;
    this.centralLogger.setDomain(domain);
  }

  private formatMessage(message: string, context?: LogContext): string {
    const jobInfo = context?.jobId ? `[${context.jobName}:${context.jobId}] ` : '';
    return `${jobInfo}${message}`;
  }

  private getLogContext(context?: LogContext) {
    return {
      context: this.context,
      domain: this.domain,
      ...context
    };
  }

  error(message: string, error?: Error | string, context?: LogContext) {
    const formattedMessage = this.formatMessage(message, context);
    if (error instanceof Error) {
      void this.centralLogger.error(formattedMessage, {
        error: { message: error.message, stack: error.stack },
        ...this.getLogContext(context)
      });
    } else {
      void this.centralLogger.error(formattedMessage, {
        error,
        ...this.getLogContext(context)
      });
    }
  }

  warn(message: string, context?: LogContext) {
    void this.centralLogger.warn(
      this.formatMessage(message, context),
      this.getLogContext(context)
    );
  }

  info(message: string, context?: LogContext) {
    void this.centralLogger.info(
      this.formatMessage(message, context),
      this.getLogContext(context)
    );
  }

  debug(message: string, context?: LogContext) {
    void this.centralLogger.debug(
      this.formatMessage(message, context),
      this.getLogContext(context)
    );
  }

  verbose(message: string, context?: LogContext) {
    void this.centralLogger.verbose(
      this.formatMessage(message, context),
      this.getLogContext(context)
    );
  }
}

