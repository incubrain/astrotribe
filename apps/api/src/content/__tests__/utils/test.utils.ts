import { Test } from '@nestjs/testing'
import { PrismaService } from '@core/services/prisma.service'
import { ConfigService } from '@nestjs/config'
import { PaginationService } from '@core/services/pagination.service'
import { CustomLogger } from '@core/logger/custom.logger'
import { Reflector } from '@nestjs/core'

import { vi, expect, describe, it, beforeEach, type Mock, type MockedFunction } from 'vitest'

// Mock Prisma content_type enum
export const content_type = {
  ARTICLE: 'ARTICLE',
  NEWS: 'NEWS',
  BLOG: 'BLOG',
  VIDEO: 'VIDEO',
  PODCAST: 'PODCAST',
} as const

// Mock Prisma client
vi.mock('@astronera/db', () => {
  class PrismaClientKnownRequestError extends Error {
    code: string
    constructor(message: string, { code }: { code: string }) {
      super(message)
      this.name = 'PrismaClientKnownRequestError'
      this.code = code
    }
  }

  class PrismaClientValidationError extends Error {
    constructor(message: string) {
      super(message)
      this.name = 'PrismaClientValidationError'
    }
  }

  const Prisma = {
    ModelName: {
      contents: 'contents',
      content_tags: 'content_tags',
      content_statuses: 'content_statuses',
      content_source_visits: 'content_source_visits',
      feed_sources: 'feed_sources',
      feed_categories: 'feed_categories',
      feeds: 'feeds',
      news_summaries: 'news_summaries',
      news_tags: 'news_tags',
    },
    content_type,
    PrismaClientKnownRequestError,
    PrismaClientValidationError,
  }

  return {
    PrismaClient: vi.fn(),
    Prisma,
  }
})

export type MockType<T> = {
  [P in keyof T]: T[P] extends (...args: any[]) => any ? Mock : T[P]
}

// Generic helper to create mocked service
export const createMockService = <T extends object>(): MockType<T> => {
  const mock: MockType<T> = {} as MockType<T>

  // Get all methods from the service prototype
  const prototype = Object.getPrototypeOf({} as T)
  const propertyNames = Object.getOwnPropertyNames(prototype)

  // Create mock functions for all methods
  propertyNames.forEach((key) => {
    if (key !== 'constructor') {
      ;(mock as any)[key] = vi.fn()
    }
  })

  return mock
}

export const createBaseMockService = () => ({
  findAll: vi.fn(),
  findOne: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
  executeQuery: vi.fn(),
  executePrismaQuery: vi.fn(),
  handleError: vi.fn(),
})

export const createSuccessResponse = (data: any) => ({
  success: true,
  data,
  timestamp: expect.any(String),
})

export const createErrorResponse = (error: string) => ({
  success: false,
  error,
  timestamp: expect.any(String),
  code: 'UNKNOWN_ERROR',
})

export const createPaginatedResponse = (data: any[], total: number) => ({
  success: true,
  items: data,
  meta: {
    total,
    page: 1,
    limit: 10,
    totalPages: Math.ceil(total / 10),
    hasNextPage: total > 10,
    hasPreviousPage: false,
  },
  timestamp: expect.any(String),
})

export const mockControllerProperties = (
  controller: any,
  mockPrismaModel: any,
  logger: CustomLogger,
  service: any,
  paginationService: PaginationService,
  serviceName: string,
) => {
  Object.defineProperty(controller, 'model', {
    get: () => mockPrismaModel,
  })
  Object.defineProperty(controller, 'logger', {
    get: () => logger,
  })
  Object.defineProperty(controller, serviceName, {
    get: () => service,
  })
  Object.defineProperty(controller, 'paginationService', {
    get: () => paginationService,
  })
}

interface CreateTestModuleOptions {
  controller: any
  serviceClass: any
  mockService: any
  prismaModelName: string
  providers?: any[]
}

export const createTestModule = async ({
  controller,
  serviceClass,
  mockService,
  prismaModelName,
  providers = [],
}: CreateTestModuleOptions) => {
  const mockPrismaService = {
    [prismaModelName]: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
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

  const mockPaginationService = {
    paginate: vi.fn(),
    getPaginationMeta: vi.fn((total: number, query: any) => ({
      total,
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
      totalPages: Math.ceil(total / (Number(query.limit) || 10)),
      hasNextPage: total > (Number(query.limit) || 10),
      hasPreviousPage: (Number(query.page) || 1) > 1,
    })),
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
    controllers: [controller],
    providers: [
      {
        provide: serviceClass,
        useValue: mockService,
      },
      {
        provide: PrismaService,
        useValue: mockPrismaService,
      },
      {
        provide: ConfigService,
        useValue: mockConfigService,
      },
      {
        provide: PaginationService,
        useValue: mockPaginationService,
      },
      {
        provide: CustomLogger,
        useValue: mockLogger,
      },
      {
        provide: Reflector,
        useValue: mockReflector,
      },
      ...providers,
    ],
  }).compile()

  return module
}
