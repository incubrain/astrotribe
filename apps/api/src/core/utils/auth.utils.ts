// utils/auth.utils.ejs
import { UnauthorizedException } from '@nestjs/common'
import { verify } from 'jsonwebtoken'

export class AuthUtils {
  static verifyToken(token: string, secret: string): any {
    try {
      return verify(token, secret)
    } catch (error) {
      throw new UnauthorizedException('Invalid token')
    }
  }

  static extractTokenFromHeader(authHeader: string): string {
    if (!authHeader) {
      throw new UnauthorizedException('No authorization header')
    }
    const [type, token] = authHeader.split(' ')
    if (type !== 'Bearer') {
      throw new UnauthorizedException('Invalid authorization type')
    }
    return token
  }
}
