// services/permission.service.ts
import { OnModuleInit } from '@nestjs/common'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'
import { CustomLogger } from '@core/logger/custom.logger'
import * as jwt from 'jsonwebtoken'
import { PrismaService } from './prisma.service'
import type { DatabaseAction, TokenPayload, PermissionCondition } from '@types'

interface SupabaseJwtPayload {
  aud: string
  exp: number
  sub: string
  email: string
  role: string
  // ... other fields from your JWT
}

@Injectable()
export class PermissionService implements OnModuleInit {
  private jwtSecret: string
  private roleHierarchyCache: Map<string, string[]>

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly logger: CustomLogger,
  ) {
    // Get this from your Supabase dashboard > Project Settings > API
    this.jwtSecret = this.config.get('app.supabase.jwt_secret')
    this.roleHierarchyCache = new Map()
  }

  async onModuleInit() {
    this.logger.setDomain('permissions')
    try {
      this.logger.log('Permission service initializing...')
      await this.loadRoleHierarchy()
      this.logger.log('Permission service initialized with role hierarchy')
    } catch (error: any) {
      this.logger.error('Failed to initialize permission service', error)
      throw error // rethrow so Nest knows to fail startup
    }
  }

  private async loadRoleHierarchy() {
    try {
      const hierarchyData = await this.prisma.roleHierarchy.findMany()

      this.logger.log(`fetching role hierarchy for ${this.roleHierarchyCache.size} roles`)
      hierarchyData.forEach(({ parent_role, child_role }) => {
        const parentRoles = this.roleHierarchyCache.get(child_role) || []
        parentRoles.push(parent_role)
        this.roleHierarchyCache.set(child_role, parentRoles)
      })

      this.logger.log(`Loaded role hierarchy for ${this.roleHierarchyCache.size} roles`)
    } catch (error: any) {
      this.logger.error('Failed to load role hierarchy', error.stack)
      throw error
    }
  }

  async getRoleHierarchy(role: string): Promise<string[]> {
    try {
      // First, get direct hierarchy from cache
      const directHierarchy = this.roleHierarchyCache.get(role) || []

      // Then get inherited permissions by recursively checking parent roles
      const allRoles = new Set<string>([role, ...directHierarchy])

      for (const parentRole of directHierarchy) {
        const parentHierarchy = await this.getRoleHierarchy(parentRole)
        parentHierarchy.forEach((r) => allRoles.add(r))
      }

      return Array.from(allRoles)
    } catch (error: any) {
      this.logger.error(`Failed to get role hierarchy for ${role}`, error)
      return [role] // Return just the current role if hierarchy lookup fails
    }
  }

  async validateToken(token: string): Promise<SupabaseJwtPayload> {
    try {
      this.logger.debug('Attempting to validate Supabase token', {
        tokenLength: token.length,
        tokenPrefix: token.substring(0, 10) + '...', // Safe logging
      })

      const decoded = jwt.verify(token, this.jwtSecret) as SupabaseJwtPayload

      this.logger.debug('Token decoded successfully', {
        sub: decoded.sub,
        role: decoded.role,
        exp: new Date(decoded.exp * 1000).toISOString(),
        aud: decoded.aud,
      })

      // Verify the token is a Supabase token
      if (decoded.aud !== 'authenticated') {
        this.logger.warn('Invalid audience in token', { aud: decoded.aud })
        throw new UnauthorizedException('Invalid token audience')
      }

      return decoded
    } catch (error: any) {
      this.logger.error('Token validation failed', {
        error: error.message,
        stack: error.stack,
      })
      throw new UnauthorizedException('Invalid token')
    }
  }
}
