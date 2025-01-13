import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Test } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import type { Prisma } from '@astronera/db'
import { faker } from '@faker-js/faker'
import { ContentCategoryController } from '../controllers/content-categories.controller'
import { ContentCategoriesService } from '../services/content-categories.service'
import { PrismaService } from '../../core/services/prisma.service'
import { PaginationService } from '../../core/services/pagination.service'
import { CustomLogger } from '../../core/logger/custom.logger'

const createSampleContentCategory = (): Prisma.content_categoriesCreateInput => ({
  is_primary: faker.datatype.boolean(),
  contents: { connect: { id: faker.string.uuid() } },
  categories: { connect: { id: faker.number.int() } },
})

describe('ContentCategoryController', () => {
  let controller: ContentCategoryController
  let contentCategoriesService: ContentCategoriesService
  let prismaService: PrismaService
  let logger: CustomLogger
  let paginationService: PaginationService

  const mockPrismaService = {
    content_categories: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
  }

  const mockContentCategoriesService = {
    findAll: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  }

  const mockConfigService = {
    get: vi.fn(),
  }

  const mockPaginationService = {
    paginate: vi.fn(),
    getPaginationMeta: vi.fn((total: number, query: any) => ({
      total,
      page: query.page || 1,
      limit: query.limit || 10,
      totalPages: Math.ceil(total / (query.limit || 10)),
    })),
  }

  const mockLogger = {
    log: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
    verbose: vi.fn(),
  }

  beforeEach(async () => {
    vi.clearAllMocks()

    const module = await Test.createTestingModule({
      controllers: [ContentCategoryController],
      providers: [
        {
          provide: ContentCategoriesService,
          useValue: mockContentCategoriesService,
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
      ],
    }).compile()

    controller = module.get<ContentCategoryController>(ContentCategoryController)
    contentCategoriesService = module.get<ContentCategoriesService>(ContentCategoriesService)
    prismaService = module.get<PrismaService>(PrismaService)
    logger = module.get<CustomLogger>(CustomLogger)
    paginationService = module.get<PaginationService>(PaginationService)

    // Mock the base controller's model property
    Object.defineProperty(controller, 'model', {
      get: () => mockPrismaService.content_categories,
    })

    // Mock the logger property
    Object.defineProperty(controller, 'logger', {
      get: () => mockLogger,
    })

    // Mock the contentCategoriesService property
    Object.defineProperty(controller, 'contentCategoriesService', {
      get: () => mockContentCategoriesService,
    })

    // Mock the paginationService property
    Object.defineProperty(controller, 'paginationService', {
      get: () => mockPaginationService,
    })
  })

  describe('findAllContentCategories', () => {
    it('should return paginated content categories', async () => {
      const contentCategories = [createSampleContentCategory(), createSampleContentCategory()]
      const query = { page: 1, limit: 10 }
      const paginatedResponse = {
        data: contentCategories,
        meta: {
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
        success: true,
        timestamp: expect.any(String),
      }

      mockPrismaService.content_categories.findMany.mockResolvedValue(contentCategories)
      mockPrismaService.content_categories.count.mockResolvedValue(2)

      const result = await controller.findAllContentCategories(query)

      expect(result).toEqual(paginatedResponse)
    })

    it('should handle errors', async () => {
      const error = new Error('Database error')
      mockPrismaService.content_categories.findMany.mockRejectedValue(error)

      const result = await controller.findAllContentCategories({ page: 1, limit: 10 })
      expect(result).toEqual({
        success: false,
        error: 'Database error',
        timestamp: expect.any(String),
        code: 'UNKNOWN_ERROR',
      })
    })
  })

  describe('findOneContentCategories', () => {
    it('should return a single content category', async () => {
      const contentCategory = createSampleContentCategory()
      const id = faker.string.uuid()

      mockPrismaService.content_categories.findUnique.mockResolvedValue(contentCategory)

      const result = await controller.findOneContentCategories(id)

      expect(result).toEqual({
        success: true,
        data: contentCategory,
        timestamp: expect.any(String),
      })
    })

    it('should handle errors', async () => {
      const id = faker.string.uuid()
      const error = new Error('Not found')
      mockPrismaService.content_categories.findUnique.mockRejectedValue(error)

      const result = await controller.findOneContentCategories(id)
      expect(result).toEqual({
        success: false,
        error: 'Not found',
        timestamp: expect.any(String),
        code: 'UNKNOWN_ERROR',
      })
    })
  })

  describe('createContentCategories', () => {
    it('should create a content category', async () => {
      const createData: Prisma.content_categoriesCreateInput = createSampleContentCategory()
      const createdContentCategory = { id: faker.string.uuid(), ...createData }

      mockPrismaService.content_categories.create.mockResolvedValue(createdContentCategory)

      const result = await controller.createContentCategories(createData)

      expect(result).toEqual({
        success: true,
        data: createdContentCategory,
        timestamp: expect.any(String),
      })
    })

    it('should handle errors', async () => {
      const createData: Prisma.content_categoriesCreateInput = createSampleContentCategory()
      const error = new Error('Creation failed')
      mockPrismaService.content_categories.create.mockRejectedValue(error)

      const result = await controller.createContentCategories(createData)
      expect(result).toEqual({
        success: false,
        error: 'Creation failed',
        timestamp: expect.any(String),
        code: 'UNKNOWN_ERROR',
      })
    })
  })

  describe('updateContentCategories', () => {
    it('should update a content category', async () => {
      const id = faker.string.uuid()
      const updateData: Prisma.content_categoriesUpdateInput = {
        is_primary: faker.datatype.boolean(),
      }
      const updatedContentCategory = { id, ...updateData }

      mockPrismaService.content_categories.update.mockResolvedValue(updatedContentCategory)

      const result = await controller.updateContentCategories(id, updateData)

      expect(result).toEqual({
        success: true,
        data: updatedContentCategory,
        timestamp: expect.any(String),
      })
    })

    it('should handle errors', async () => {
      const id = faker.string.uuid()
      const updateData: Prisma.content_categoriesUpdateInput = {
        is_primary: faker.datatype.boolean(),
      }
      const error = new Error('Update failed')
      mockPrismaService.content_categories.update.mockRejectedValue(error)

      const result = await controller.updateContentCategories(id, updateData)
      expect(result).toEqual({
        success: false,
        error: 'Update failed',
        timestamp: expect.any(String),
        code: 'UNKNOWN_ERROR',
      })
    })
  })

  describe('removeContentCategories', () => {
    it('should remove a content category', async () => {
      const id = faker.string.uuid()
      const deletedContentCategory = { id }

      mockPrismaService.content_categories.delete.mockResolvedValue(deletedContentCategory)

      const result = await controller.removeContentCategories(id)

      expect(result).toEqual({
        success: true,
        data: deletedContentCategory,
        timestamp: expect.any(String),
      })
    })

    it('should handle errors', async () => {
      const id = faker.string.uuid()
      const error = new Error('Delete failed')
      mockPrismaService.content_categories.delete.mockRejectedValue(error)

      const result = await controller.removeContentCategories(id)
      expect(result).toEqual({
        success: false,
        error: 'Delete failed',
        timestamp: expect.any(String),
        code: 'UNKNOWN_ERROR',
      })
    })
  })
})
