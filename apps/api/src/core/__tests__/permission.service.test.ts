// test/permission.service.spec.ts
import { Test } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { PermissionService } from '../services/permission.service'
import { CustomLogger } from '../logger/custom.logger'

// Mock Supabase client
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(),
    })),
  })),
}))

describe('PermissionService', () => {
  let service: PermissionService
  let configService: ConfigService
  let logger: CustomLogger

  beforeEach(async () => {
    const mockConfigService = {
      get: vi.fn((key: string) => {
        switch (key) {
          case 'SUPABASE_URL':
            return 'https://example.supabase.co'
          case 'SUPABASE_ANON_KEY':
            return 'test-key'
          case 'JWT_SECRET':
            return 'test-secret'
          default:
            return undefined
        }
      }),
    }

    const mockLogger = {
      setContext: vi.fn(),
      log: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      debug: vi.fn(),
    }

    const module = await Test.createTestingModule({
      providers: [
        PermissionService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: CustomLogger,
          useValue: mockLogger,
        },
      ],
    }).compile()

    service = module.get<PermissionService>(PermissionService)
    configService = module.get<ConfigService>(ConfigService)
    logger = module.get<CustomLogger>(CustomLogger)
  })

  describe('Module Initialization', () => {
    it('should successfully load role hierarchy on initialization', async () => {
      const mockRoleHierarchy = {
        admin: ['user'],
        user: [],
      }

      vi.spyOn(service['supabase'].from('role_hierarchy'), 'select').mockResolvedValue({
        data: mockRoleHierarchy,
        error: null,
      })

      await service.onModuleInit()

      expect(service['roleHierarchy']).toEqual(mockRoleHierarchy)
    })

    it('should handle empty role hierarchy gracefully', async () => {
      vi.spyOn(service['supabase'].from('role_hierarchy'), 'select').mockResolvedValue({
        data: null,
        error: null,
        count: 0,
        status: 200,
        statusText: 'OK',
      })

      await service.onModuleInit()

      expect(service['roleHierarchy']).toEqual({})
    })
  })

  describe('Token Validation', () => {
    it('should successfully validate and return token payload for valid token', async () => {
      const mockPayload = {
        user: { id: 'user-123' },
        role: 'user',
      }

      vi.spyOn(service['supabase'].auth, 'getUser').mockResolvedValue({
        data: { user: mockPayload.user },
        error: null,
      })

      const result = await service.validateToken('valid-token')

      expect(result).toEqual(mockPayload)
    })

    it('should throw error for invalid token', async () => {
      vi.spyOn(service['supabase'].auth, 'getUser').mockResolvedValue({
        data: { user: null },
        error: {
          status: 400,
          code: 'invalid_token',
          message: 'Invalid token',
          name: 'Invalid',
          __isAuthError: true,
        },
      })

      await expect(service.validateToken('invalid-token')).rejects.toThrow('Invalid token')
    })

    it('should handle missing user data in valid token', async () => {
      vi.spyOn(service['supabase'].auth, 'getUser').mockResolvedValue({
        data: { user: null },
        error: null,
      })

      await expect(service.validateToken('valid-token')).rejects.toThrow('User data not found')
    })
  })

  describe('Permission Validation', () => {
    it('should validate permission successfully for allowed action', async () => {
      const mockPermissions = {
        data: [
          {
            table: 'contents',
            action: 'read',
            conditions: null,
          },
        ],
        error: null,
      }

      vi.spyOn(service['supabase'].from('role_permissions'), 'select').mockResolvedValue(
        mockPermissions,
      )

      const result = await service.validatePermission('user', 'contents', 'select', 'user-123')

      expect(result).toBe(true)
    })

    it('should deny access for unauthorized action', async () => {
      vi.spyOn(service['supabase'].from('role_permissions'), 'select').mockResolvedValue({
        data: [],
        error: null,
        count: 0,
        status: 200,
        statusText: 'OK',
      })

      const result = await service.validatePermission('user', 'contents', 'insert', 'user-123')

      expect(result).toBe(false)
    })

    it('should evaluate conditions successfully when userId matches', async () => {
      const mockPermissions = {
        data: [
          {
            table: 'contents',
            action: 'write',
            conditions: { user_id: 'user-123' },
          },
        ],
        error: null,
      }

      vi.spyOn(service['supabase'].from('role_permissions'), 'select').mockResolvedValue(
        mockPermissions,
      )

      const result = await service.validatePermission('user', 'contents', 'insert', 'user-123')

      expect(result).toBe(true)
    })

    it('should handle missing permissions data gracefully', async () => {
      vi.spyOn(service['supabase'].from('role_permissions'), 'select').mockResolvedValue({
        count: undefined,
        data: null,
        status: 200,
        statusText: 'OK',
        error: null,
      })

      const result = await service.validatePermission('user', 'contents', 'insert', 'user-123')

      expect(result).toBe(false)
    })

    it('should handle invalid table or action gracefully', async () => {
      vi.spyOn(service['supabase'].from('role_permissions'), 'select').mockResolvedValue({
        data: null,
        error: {
          code: '400',
          stack: '...',
          message: 'Invalid table or action',
          details: 'Table not found',
          hint: '',
          name: '',
        },
        count: undefined,
        status: 400,
        statusText: 'Bad Request',
      })

      const result = await service.validatePermission('user', 'invalid_table', 'select', 'user-123')

      expect(result).toBe(false)
    })
  })
})
