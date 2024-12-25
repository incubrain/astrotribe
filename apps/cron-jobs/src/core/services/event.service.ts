// src/infrastructure/events/event.service.ts
import { EventEmitter } from 'events'
import { CustomLogger } from './logger.service'

export class EventService {
  private emitter: EventEmitter

  constructor(private readonly logger: CustomLogger) {
    this.emitter = new EventEmitter()
    this.logger.setDomain('job_events')
  }

  on(event: string, listener: (...args: any[]) => void) {
    this.emitter.on(event, (...args) => {
      try {
        listener(...args)
      } catch (error: any) {
        this.logger.error(`Error handling event ${event}`, error)
      }
    })
  }

  emit(event: string, ...args: any[]) {
    this.emitter.emit(event, ...args)
    this.logger.debug(`Event emitted: ${event}`, {
      event,
      args: args.map((arg) =>
        arg instanceof Error ? { message: arg.message, stack: arg.stack } : arg,
      ),
    })
  }
}
