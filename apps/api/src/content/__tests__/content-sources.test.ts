import { describe, it, expect, beforeEach } from 'vitest'
import { faker } from '@faker-js/faker'
import type { Prisma } from '@prisma/client'
import { content_type } from '@prisma/client'
import { ContentSourceController } from '../controllers/content-sources.controller'
import { ContentSourcesService } from '../services/content-sources.service'
import { PrismaService } from '../../core/services/prisma.service'
import { PaginationService } from '../../core/services/pagination.service'
import { CustomLogger } from '../../core/logger/custom.logger'
import type { MockType } from './utils/test.utils'
import {
  createTestModule,
  createBaseMockService,
  createSuccessResponse,
  createErrorResponse,
  createPaginatedResponse,
  mockControllerProperties,
} from './utils/test.utils'
import { createSampleContentSource } from './utils/sample-data.utils'

describe('ContentSourceController', () => {
  let controller: ContentSourceController
  let contentSourcesService: MockType<ContentSourcesService>
  let prismaService: PrismaService
  let logger: CustomLogger
  let paginationService: PaginationService
  let mockPrismaModel: any

  beforeEach(async () => {
    const mockService = createBaseMockService()
    const module = await createTestModule({
      controller: ContentSourceController,
      serviceClass: ContentSourcesService,
      mockService,
      prismaModelName: 'content_sources',
    })

    controller = module.get<ContentSourceController>(ContentSourceController)
    contentSourcesService = module.get(ContentSourcesService)
    prismaService = module.get<PrismaService>(PrismaService)
    logger = module.get<CustomLogger>(CustomLogger)
    paginationService = module.get<PaginationService>(PaginationService)
    mockPrismaModel = prismaService['content_sources']

    mockControllerProperties(
      controller,
      mockPrismaModel,
      logger,
      contentSourcesService,
      paginationService,
      'contentSourcesService',
    )
  })

  describe('findAllContentSources', () => {
    it('should return paginated content sources', async () => {
      const contentSources = [createSampleContentSource(), createSampleContentSource()]
      const query = { page: 1, limit: 10 }

      mockPrismaModel.findMany.mockResolvedValue(contentSources)
      mockPrismaModel.count.mockResolvedValue(2)

      const result = await controller.findAllContentSources(query)

      expect(result).toEqual(createPaginatedResponse(contentSources, 2))
    })

    it('should handle errors', async () => {
      const error = new Error('Database error')
      mockPrismaModel.findMany.mockRejectedValue(error)

      const result = await controller.findAllContentSources({
        page: 1,
        limit: 10,
      })
      expect(result).toEqual(createErrorResponse('Database error'))
    })
  })

  describe('findOneContentSources', () => {
    it('should return a single content source', async () => {
      const contentSource = createSampleContentSource()
      const id = faker.string.uuid()

      mockPrismaModel.findUnique.mockResolvedValue(contentSource)

      const result = await controller.findOneContentSources(id)

      expect(result).toEqual(createSuccessResponse(contentSource))
    })

    it('should handle errors', async () => {
      const id = faker.string.uuid()
      const error = new Error('Not found')
      mockPrismaModel.findUnique.mockRejectedValue(error)

      const result = await controller.findOneContentSources(id)
      expect(result).toEqual(createErrorResponse('Not found'))
    })
  })

  describe('createContentSources', () => {
    it('should create a content source', async () => {
      const createData = createSampleContentSource()
      const createdContentSource = { id: faker.string.uuid(), ...createData }

      mockPrismaModel.create.mockResolvedValue(createdContentSource)

      const result = await controller.createContentSources(createData)

      expect(result).toEqual(createSuccessResponse(createdContentSource))
    })

    it('should handle errors', async () => {
      const createData = createSampleContentSource()
      const error = new Error('Creation failed')
      mockPrismaModel.create.mockRejectedValue(error)

      const result = await controller.createContentSources(createData)
      expect(result).toEqual(createErrorResponse('Creation failed'))
    })
  })

  describe('updateContentSources', () => {
    it('should update a content source', async () => {
      const id = faker.string.uuid()
      const updateData: Prisma.content_sourcesUpdateInput = {
        url: faker.internet.url(),
        content_type: faker.helpers.arrayElement([...Object.values(content_type)]),
        updated_at: new Date(),
        companies: { connect: { id: faker.string.uuid() } },
      }
      const updatedContentSource = {
        id,
        ...updateData,
        company_id: updateData.companies?.connect?.id,
        created_at: new Date(),
      }

      mockPrismaModel.update.mockResolvedValue(updatedContentSource)

      const result = await controller.updateContentSources(id, updateData)

      expect(result).toEqual(createSuccessResponse(updatedContentSource))
    })

    it('should handle errors', async () => {
      const id = faker.string.uuid()
      const updateData: Prisma.content_sourcesUpdateInput = {
        url: faker.internet.url(),
        companies: { connect: { id: faker.string.uuid() } },
      }
      const error = new Error('Update failed')
      mockPrismaModel.update.mockRejectedValue(error)

      const result = await controller.updateContentSources(id, updateData)
      expect(result).toEqual(createErrorResponse('Update failed'))
    })
  })

  describe('removeContentSources', () => {
    it('should remove a content source', async () => {
      const id = faker.string.uuid()
      const deletedContentSource = { id }

      mockPrismaModel.delete.mockResolvedValue(deletedContentSource)

      const result = await controller.removeContentSources(id)

      expect(result).toEqual(createSuccessResponse(deletedContentSource))
    })

    it('should handle errors', async () => {
      const id = faker.string.uuid()
      const error = new Error('Delete failed')
      mockPrismaModel.delete.mockRejectedValue(error)

      const result = await controller.removeContentSources(id)
      expect(result).toEqual(createErrorResponse('Delete failed'))
    })
  })
})
