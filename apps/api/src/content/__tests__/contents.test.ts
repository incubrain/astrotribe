import { describe, it, expect, beforeEach, vi } from 'vitest'
import { faker } from '@faker-js/faker'
import type { Prisma } from '@astronera/db'
import { ContentType } from '@astronera/db'
import { ContentController } from '../controllers/contents.controller'
import { ContentService } from '../services/contents.service'
import { PrismaService } from '../../core/services/prisma.service'
import { PaginationService } from '../../core/services/pagination.service'
import { CustomLogger } from '../../core/logger/custom.logger'
import { PermissionGuard } from '../../core/guards/permission.guard'
import type { MockType } from './utils/test.utils'
import {
  createTestModule,
  createBaseMockService,
  createSuccessResponse,
  createErrorResponse,
  createPaginatedResponse,
  mockControllerProperties,
} from './utils/test.utils'

const mockPermissionGuard = {
  canActivate: () => true,
  logger: {
    setContext: vi.fn(),
    log: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}

const createSampleContent = (): Prisma.contentsCreateInput => ({
  content_type: faker.helpers.arrayElement([...Object.values(ContentType)]),
  title: faker.helpers.arrayElement([faker.lorem.words(3), null]),
  url: faker.internet.url(),
  rss_url: faker.helpers.arrayElement([faker.internet.url(), null]),
  hot_score: faker.helpers.arrayElement([faker.number.int({ min: 0, max: 100 }), null]),
})

describe('ContentController', () => {
  let controller: ContentController
  let contentService: MockType<ContentService>
  let prismaService: PrismaService
  let logger: CustomLogger
  let paginationService: PaginationService
  let mockPrismaModel: any

  beforeEach(async () => {
    const mockService = createBaseMockService()
    const module = await createTestModule({
      controller: ContentController,
      serviceClass: ContentService,
      mockService,
      prismaModelName: 'contents',
      providers: [
        {
          provide: PermissionGuard,
          useValue: mockPermissionGuard,
        },
      ],
    })

    controller = module.get<ContentController>(ContentController)
    contentService = module.get(ContentService)
    prismaService = module.get<PrismaService>(PrismaService)
    logger = module.get<CustomLogger>(CustomLogger)
    paginationService = module.get<PaginationService>(PaginationService)
    mockPrismaModel = prismaService['contents']

    mockControllerProperties(
      controller,
      mockPrismaModel,
      logger,
      contentService,
      paginationService,
      'contentService',
    )
  })

  describe('findAllContents', () => {
    it('should return paginated contents', async () => {
      const contents = [createSampleContent(), createSampleContent()]
      const query = { page: 1, limit: 10 }

      mockPrismaModel.findMany.mockResolvedValue(contents)
      mockPrismaModel.count.mockResolvedValue(2)

      const result = await controller.findAllContents(query)

      expect(result).toEqual(createPaginatedResponse(contents, 2))
    })

    it('should handle errors', async () => {
      const error = new Error('Database error')
      mockPrismaModel.findMany.mockRejectedValue(error)

      const result = await controller.findAllContents({ page: 1, limit: 10 })
      expect(result).toEqual(createErrorResponse('Database error'))
    })
  })

  describe('findOneContents', () => {
    it('should return a single content', async () => {
      const content = createSampleContent()
      const id = faker.string.uuid()

      mockPrismaModel.findUnique.mockResolvedValue(content)

      const result = await controller.findOneContents(id)

      expect(result).toEqual(createSuccessResponse(content))
    })

    it('should handle errors', async () => {
      const id = faker.string.uuid()
      const error = new Error('Not found')
      mockPrismaModel.findUnique.mockRejectedValue(error)

      const result = await controller.findOneContents(id)
      expect(result).toEqual(createErrorResponse('Not found'))
    })
  })

  describe('createContents', () => {
    it('should create a content', async () => {
      const createData = createSampleContent()
      const createdContent = {
        id: faker.string.uuid(),
        content_type: createData.content_type,
        title: createData.title,
        url: createData.url,
        rss_url: createData.rss_url,
        hot_score: createData.hot_score,
        created_at: new Date(),
        updated_at: new Date(),
      }

      mockPrismaModel.create.mockResolvedValue(createdContent)

      const result = await controller.createContents(createData)

      expect(result).toEqual(createSuccessResponse(createdContent))
    })

    it('should handle errors', async () => {
      const createData = createSampleContent()
      const error = new Error('Creation failed')
      mockPrismaModel.create.mockRejectedValue(error)

      const result = await controller.createContents(createData)
      expect(result).toEqual(createErrorResponse('Creation failed'))
    })
  })

  describe('updateContents', () => {
    it('should update a content', async () => {
      const id = faker.string.uuid()
      const updateData: Prisma.contentsUpdateInput = {
        content_type: faker.helpers.arrayElement([...Object.values(ContentType)]),
        title: faker.lorem.words(3),
        url: faker.internet.url(),
        rss_url: faker.internet.url(),
        hot_score: faker.number.int({ min: 0, max: 100 }),
        updated_at: new Date(),
      }
      const updatedContent = {
        id,
        content_type: updateData.content_type as string,
        title: updateData.title as string,
        url: updateData.url as string,
        rss_url: updateData.rss_url as string,
        hot_score: updateData.hot_score as number,
        created_at: new Date(),
        updated_at: updateData.updated_at as Date,
      }

      mockPrismaModel.update.mockResolvedValue(updatedContent)

      const result = await controller.updateContents(id, updateData)

      expect(result).toEqual(createSuccessResponse(updatedContent))
    })

    it('should handle errors', async () => {
      const id = faker.string.uuid()
      const updateData: Prisma.contentsUpdateInput = {
        content_type: faker.helpers.arrayElement([...Object.values(ContentType)]),
      }
      const error = new Error('Update failed')
      mockPrismaModel.update.mockRejectedValue(error)

      const result = await controller.updateContents(id, updateData)
      expect(result).toEqual(createErrorResponse('Update failed'))
    })
  })

  describe('removeContents', () => {
    it('should remove a content', async () => {
      const id = faker.string.uuid()
      const deletedContent = { id }

      mockPrismaModel.delete.mockResolvedValue(deletedContent)

      const result = await controller.removeContents(id)

      expect(result).toEqual(createSuccessResponse(deletedContent))
    })

    it('should handle errors', async () => {
      const id = faker.string.uuid()
      const error = new Error('Delete failed')
      mockPrismaModel.delete.mockRejectedValue(error)

      const result = await controller.removeContents(id)
      expect(result).toEqual(createErrorResponse('Delete failed'))
    })
  })
})
