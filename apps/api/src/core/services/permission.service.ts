// services/permission.service.ts
import { Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { app_role_enum } from '@prisma/client'
import { PrismaService } from './prisma.service'
import { CustomLogger } from '@core/logger/custom.logger'
import { DatabaseAction, TokenPayload, PermissionCondition } from '@types'
import * as jwt from 'jsonwebtoken'

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
  private supabase: SupabaseClient
  private jwtSecret: string
  private roleHierarchyCache: Map<string, string[]>;


  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly logger: CustomLogger,
  ) {
    this.supabase = createClient(
      this.config.get('app.supabase.url'),
      this.config.get('app.supabase.anon_key'),
    )
    // Get this from your Supabase dashboard > Project Settings > API
    this.jwtSecret = this.config.get('app.supabase.jwt_secret')
    this.roleHierarchyCache = new Map(); 
  }

  async onModuleInit() {
    this.logger.setContext('PermissionService')
    await this.loadRoleHierarchy()
    this.logger.log('Permission service initialized with role hierarchy')
  }

  private async loadRoleHierarchy() {
    try {
      const hierarchyData = await this.prisma.role_hierarchy.findMany()

      hierarchyData.forEach(({ parent_role, child_role }) => {
        const parentRoles = this.roleHierarchyCache.get(child_role) || []
        parentRoles.push(parent_role)
        this.roleHierarchyCache.set(child_role, parentRoles)
      })

      this.logger.debug(`Loaded role hierarchy for ${this.roleHierarchyCache.size} roles`)
    } catch (error) {
      this.logger.error('Failed to load role hierarchy', error.stack)
      throw error
    }
  }

  async validateToken(token: string): Promise<SupabaseJwtPayload> {
    try {
      // First verify the JWT signature
      const decoded = jwt.verify(token, this.jwtSecret) as SupabaseJwtPayload

      // Optional: Additional validation
      if (Date.now() >= decoded.exp * 1000) {
        throw new UnauthorizedException('Token expired')
      }

      return decoded
    } catch (error) {
      throw new UnauthorizedException('Invalid token')
    }
  }
}
