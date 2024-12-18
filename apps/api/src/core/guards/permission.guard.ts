// guards/enhanced-permission.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  OnModuleInit,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { app_role_enum } from '@prisma/client'
import { PermissionService } from '../services/permission.service'
import { CustomLogger } from '@core/logger/custom.logger'
import { DatabaseAction } from '@types'

@Injectable()
export class PermissionGuard implements CanActivate, OnModuleInit {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionService: PermissionService,
    private readonly logger: CustomLogger,
  ) {}

  onModuleInit() {
    this.logger.setContext('PermissionGuard')
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handler = context.getHandler()
    const table = this.reflector.get<string>('table', handler)
    const action = this.reflector.get<DatabaseAction>('action', handler)

    if (!table || !action) {
      this.logger.debug('No table or action specified, skipping permission check')
      return true
    }

    const request = context.switchToHttp().getRequest()
    const token = this.extractToken(request)

    if (!token) {
      this.logger.warn('No token found in request')
      throw new UnauthorizedException('No authorization token found')
    }

    try {
      const user = await this.permissionService.validateToken(token)
      request.user = user // Attach user to request for downstream use

      const hasPermission = await this.permissionService.validatePermission(
        user.role as app_role_enum,
        table,
        action,
        user.user_id,
      )

      if (!hasPermission) {
        this.logger.warn(`Permission denied for ${user.role} on ${table}.${action}`)
        throw new UnauthorizedException(`User does not have ${action} permission for ${table}`)
      }

      return true
    } catch (error) {
      this.logger.error('Permission check failed', error.stack)
      throw error
    }
  }

  private extractToken(request: any): string | null {
    const authHeader = request.headers.authorization
    if (!authHeader) return null
    return authHeader.replace('Bearer ', '')
  }
}
