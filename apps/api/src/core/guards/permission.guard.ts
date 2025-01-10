// guards/permission.guard.ts
import { CanActivate, ExecutionContext } from '@nestjs/common'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { CustomLogger } from '@core/logger/custom.logger'
import { IS_PUBLIC_KEY } from '@core/decorators/public.decorator'
import { IS_SERVICE_KEY } from '@core/decorators/service.decorator'
import { PermissionService } from '../services/permission.service'
import { DebugService } from '../services/debug.service'

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly permissionService: PermissionService,
    private readonly logger: CustomLogger,
    private readonly reflector: Reflector,
    private readonly debugService: DebugService,
  ) {
    this.logger.setDomain('permissions')
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    const isService = this.reflector.getAllAndOverride<boolean>(IS_SERVICE_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    this.attachDebugInfo(request, context, isPublic, isService)

    if (isPublic) {
      return true
    }

    if (isService) {
      return true
    }

    const token = this.extractToken(request)
    if (!token) {
      this.logger.warn('No token found in request')
      throw new UnauthorizedException('No authorization token found')
    }

    try {
      const userData = await this.permissionService.validateToken(token)
      request.user = userData

      this.attachUserDebugInfo(request, userData)
      return true
    } catch (error: any) {
      this.logger.error('Permission check failed', error.stack)
      throw new UnauthorizedException('Invalid token')
    }
  }

  private attachDebugInfo(
    request: any,
    context: ExecutionContext,
    isPublic: boolean,
    isService: boolean,
  ) {
    this.debugService.attachPermissionDebugInfo(request, {
      isPublic,
      isService,
      endpoint: `${request.method} ${request.path}`,
      handler: context.getHandler().name,
      controller: context.getClass().name,
    })
  }

  private async attachUserDebugInfo(request: any, userData: any) {
    this.debugService.attachPermissionDebugInfo(request, {
      user: {
        role: userData.role,
        email: userData.email,
      },
      roleHierarchy: await this.permissionService.getRoleHierarchy(userData.role),
    })
  }

  private extractToken(request: any): string | null {
    const authHeader = request.headers.authorization
    return authHeader ? authHeader.replace('Bearer ', '') : null
  }
}
