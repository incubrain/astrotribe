// core/decorators/api.decorators.ts
import { applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger'

export function ApiPaginatedResponse(type: any) {
  return applyDecorators(
    ApiOperation({ summary: 'Get paginated list' }),
    ApiQuery({ name: 'page', required: false, type: Number }),
    ApiQuery({ name: 'limit', required: false, type: Number }),
    ApiResponse({
      status: 200,
      description: 'Successful operation',
      type: type,
      isArray: true,
    }),
  )
}

export function ApiGetByIdResponse(type: any) {
  return applyDecorators(
    ApiOperation({ summary: 'Get by ID' }),
    ApiResponse({
      status: 200,
      description: 'Found',
      type: type,
    }),
    ApiResponse({ status: 404, description: 'Not found' }),
  )
}
