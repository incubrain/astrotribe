import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const apiKey = request.headers['authorization']?.split(' ')[1] // Extract Bearer token

    console.log('Request:', request.headers)
    console.log('headers array:', request.headers['authorization']?.split)
    console.log('API Key:', apiKey, 'Expected:', process.env.API_SECRET_KEY)

    if (apiKey !== process.env.API_SECRET_KEY) {
      throw new ForbiddenException('Invalid API Key')
    }
    return true
  }
}
