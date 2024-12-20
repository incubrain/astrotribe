// core/guards/throttler.guard.ts
import type { ExecutionContext } from '@nestjs/common'
import { Injectable, SetMetadata } from '@nestjs/common'
import type { Reflector } from '@nestjs/core'
import type { ThrottlerModuleOptions, ThrottlerRequest, ThrottlerStorage } from '@nestjs/throttler'
import { ThrottlerGuard } from '@nestjs/throttler'
import { CustomLogger } from '@core/logger/custom.logger'

// Decorator to skip throttling for specific routes
export const SkipThrottle = () => SetMetadata('skipThrottle', true)

// Decorator to set custom limits for specific routes
export const Throttle = (limit: number, ttl: number) => SetMetadata('throttle', { limit, ttl })

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  private readonly logger: CustomLogger

  constructor(
    options: ThrottlerModuleOptions,
    storageService: ThrottlerStorage,
    reflector: Reflector,
  ) {
    super(options, storageService, reflector)
    this.logger = new CustomLogger('ThrottlerGuard')
  }

  protected async getTracker(req: Record<string, any>): Promise<string> {
    // You can customize the tracking key based on your needs
    // Default is IP address
    const ip = req.ip
    const userAgent = req.headers['user-agent'] || 'unknown'

    return `${ip}-${userAgent}`
  }

  protected getKeyForRoute(context: ExecutionContext): string {
    const req = context.switchToHttp().getRequest()
    return `${req.method}-${req.url}`
  }

  protected async handleRequest(input: ThrottlerRequest): Promise<boolean> {
    // Check if route should skip throttling
    const skipThrottle = this.reflector.get<boolean>('skipThrottle', input.context.getHandler())
    if (skipThrottle) {
      return true
    }

    // Get custom limits if set
    const customLimits = this.reflector.get<{ limit: number; ttl: number }>(
      'throttle',
      input.context.getHandler(),
    )

    if (customLimits) {
      input.limit = customLimits.limit
      input.ttl = customLimits.ttl
    }

    const tracker = await this.getTracker(input.context.switchToHttp().getRequest())
    const key = this.getKeyForRoute(input.context)
    const record = await this.storageService.increment(
      `${key}-${tracker}`,
      input.ttl,
      input.limit,
      input.blockDuration,
      input.throttler.name ?? 'throttler',
    )

    this.logger.debug(`Request ${key} from ${tracker}: ${record.totalHits}/${input.limit}`)

    if (record.totalHits > input.limit) {
      this.logger.warn(
        `Request ${key} from ${tracker} exceeded limit: ${record.totalHits}/${input.limit}`,
      )
      return false
    }

    return true
  }
}
