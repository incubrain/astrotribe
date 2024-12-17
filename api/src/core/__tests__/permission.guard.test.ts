// test/permission.guard.spec.ts
import { Test } from '@nestjs/testing'
import { ExecutionContext } from '@nestjs/common'
import { PermissionGuard } from '../guards/permission.guard'
import { PermissionService } from '../services/permission.service'
import { ConfigService } from '../services/config.service'
import { CustomLogger } from '../logger/custom.logger'
import { Reflector } from '@nestjs/core'
import { vi, describe, it, expect, beforeEach } from 'vitest'

describe('PermissionGuard', () => {
  let guard: PermissionGuard
  let permissionService: PermissionService
  let configService: ConfigService
  let logger: CustomLogger
  let reflector: Reflector

  beforeEach(async () => {
    const mockPermissionService = {
      validateToken: vi.fn(),
      validatePermission: vi.fn(),
    }

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

    const mockReflector = {
      get: vi.fn(),
      getAllAndOverride: vi.fn(),
      getAllAndMerge: vi.fn(),
    }

    const module = await Test.createTestingModule({
      providers: [
        PermissionGuard,
        {
          provide: PermissionService,
          useValue: mockPermissionService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: CustomLogger,
          useValue: mockLogger,
        },
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile()

    guard = module.get<PermissionGuard>(PermissionGuard)
    permissionService = module.get<PermissionService>(PermissionService)
    configService = module.get<ConfigService>(ConfigService)
    logger = module.get<CustomLogger>(CustomLogger)
    reflector = module.get<Reflector>(Reflector)
  })

  describe('Route Access Control', () => {
    it('should allow access when no permissions are required', async () => {
      const context = createMockExecutionContext()
      reflector.get.mockReturnValue(null)

      const result = await guard.canActivate(context)
      expect(result).toBe(true)
    })

    it('should allow access for valid token and permissions', async () => {
      const context = createMockExecutionContext({
        headers: { authorization: 'Bearer valid-token' },
      })

      reflector.get.mockImplementation((key: string) => {
        switch (key) {
          case 'table':
            return 'contents'
          case 'action':
            return 'select'
          default:
            return null
        }
      })

      vi.spyOn(permissionService, 'validateToken').mockResolvedValue({
        user: { id: 'user-123' },
        role: 'user',
      })

      vi.spyOn(permissionService, 'validatePermission').mockResolvedValue(true)

      const result = await guard.canActivate(context)
      expect(result).toBe(true)
    })

    it('should deny access when permission is not granted', async () => {
      const context = createMockExecutionContext({
        headers: { authorization: 'Bearer valid-token' },
      })

      reflector.get.mockImplementation((key: string) => {
        switch (key) {
          case 'table':
            return 'contents'
          case 'action':
            return 'write'
          default:
            return null
        }
      })

      vi.spyOn(permissionService, 'validateToken').mockResolvedValue({
        user: { id: 'user-123' },
        role: 'user',
      })

      vi.spyOn(permissionService, 'validatePermission').mockResolvedValue(false)

      const result = await guard.canActivate(context)
      expect(result).toBe(false)
    })

    it('should handle missing authorization header', async () => {
      const context = createMockExecutionContext()

      reflector.get.mockImplementation((key: string) => {
        switch (key) {
          case 'table':
            return 'contents'
          case 'action':
            return 'select'
          default:
            return null
        }
      })

      const result = await guard.canActivate(context)
      expect(result).toBe(false)
    })

    it('should handle invalid authorization format', async () => {
      const context = createMockExecutionContext({
        headers: { authorization: 'InvalidFormat' },
      })

      reflector.get.mockImplementation((key: string) => {
        switch (key) {
          case 'table':
            return 'contents'
          case 'action':
            return 'select'
          default:
            return null
        }
      })

      const result = await guard.canActivate(context)
      expect(result).toBe(false)
    })

    it('should handle token validation errors', async () => {
      const context = createMockExecutionContext({
        headers: { authorization: 'Bearer invalid-token' },
      })

      reflector.get.mockImplementation((key: string) => {
        switch (key) {
          case 'table':
            return 'contents'
          case 'action':
            return 'select'
          default:
            return null
        }
      })

      vi.spyOn(permissionService, 'validateToken').mockRejectedValue(new Error('Invalid token'))

      const result = await guard.canActivate(context)
      expect(result).toBe(false)
    })
  })
})

function createMockExecutionContext(
  options: {
    headers?: Record<string, string>
  } = {},
) {
  const context: ExecutionContext = {
    switchToHttp: () => ({
      getRequest: () => ({
        headers: options.headers || {},
      }),
    }),
    getHandler: () => ({}),
    getClass: () => ({}),
    getType: () => 'http',
    getArgs: () => [],
    getArgByIndex: () => ({}),
  }

  return context
}
