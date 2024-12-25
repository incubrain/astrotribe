// guards/permission.guard.ts
import { CanActivate, ExecutionContext } from '@nestjs/common'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { CustomLogger } from '@core/logger/custom.logger'
import { PermissionService } from '../services/permission.service'

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly permissionService: PermissionService,
    private readonly logger: CustomLogger,
    private readonly reflector: Reflector,
  ) {
    this.logger.setDomain('permissions')
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = this.extractToken(request)

    if (!token) {
      this.logger.warn('No token found in request')
      throw new UnauthorizedException('No authorization token found')
    }

    try {
      const userData = await this.permissionService.validateToken(token)
      request.user = userData // Attach user data to request
      return true
    } catch (error: any) {
      this.logger.error('Permission check failed', error.stack)
      throw new UnauthorizedException('Invalid token')
    }
  }

  private extractToken(request: any): string | null {
    const authHeader = request.headers.authorization
    return authHeader ? authHeader.replace('Bearer ', '') : null
  }
}
