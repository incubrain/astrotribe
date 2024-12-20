import { LoggerService } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import * as winston from 'winston'
import { LoggerColors } from './logger.colors'

@Injectable()
export class CustomLogger implements LoggerService {
  private logger: winston.Logger
  private context?: string

  constructor(ctx?: string) {
    this.context = ctx
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message, context, trace, ...meta }) => {
          const color = LoggerColors[String(context)?.toLowerCase()] || LoggerColors.default
          const contextStr = context || this.context || 'Global'
          const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : ''
          const traceStr = trace ? `\n${trace}` : ''

          return `${color}[${timestamp}] [${level.toUpperCase()}] [${contextStr}] ${message}${metaStr}${traceStr}${LoggerColors.reset}`
        }),
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
          ),
        }),
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
        }),
        new winston.transports.File({
          filename: 'logs/combined.log',
        }),
      ],
    })
  }

  setContext(context: string) {
    this.context = context
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context: context || this.context })
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context: context || this.context })
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context: context || this.context })
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context: context || this.context })
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context: context || this.context })
  }
}
