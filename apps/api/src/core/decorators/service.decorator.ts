// src/core/decorators/service.decorator.ts
import { SetMetadata, applyDecorators, UseGuards } from '@nestjs/common'
import { ApiKeyGuard } from '@core/guards/api-key.guard'

export const IS_SERVICE_KEY = 'isService'
export const Service = () =>
  applyDecorators(SetMetadata(IS_SERVICE_KEY, true), UseGuards(ApiKeyGuard))
