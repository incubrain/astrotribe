import { Injectable, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class DebugService {
  constructor(private readonly config: ConfigService) {}

  isDebugMode(): boolean {
    return this.config.get('app.debug') ?? false
  }

  attachPermissionDebugInfo(request: any, data: any) {
    if (!this.isDebugMode()) return
    request.permissions = {
      ...request.permissions,
      ...data,
    }
  }
}
