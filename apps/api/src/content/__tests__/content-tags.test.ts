import { describe, it, expect, beforeEach } from 'vitest'
import { PrismaService } from '@core/services/prisma.service'
import { PaginationService } from '@core/services/pagination.service'
import { CustomLogger } from '@core/logger/custom.logger'
import { faker } from '@faker-js/faker'
import type { Prisma } from '@prisma/client'
import { NotFoundException, InternalServerErrorException } from '@nestjs/common'
import { ContentTagsService } from '../services/content-tags.service'
import { ContentTagController } from '../controllers/content-tags.controller'
import type { MockType } from './utils/test.utils'
import {
  createTestModule,
  createBaseMockService,
  createSuccessResponse,
  createErrorResponse,
  createPaginatedResponse,
  mockControllerProperties,
} from './utils/test.utils'

const createSampleContentTag = (): Prisma.content_tagsCreateInput => ({
  contents: { connect: { id: faker.string.uuid() } },
  tags: { connect: { id: faker.number.int() } },
})

describe('ContentTagController', () => {
  let controller: ContentTagController
  let contentTagsService: MockType<ContentTagsService>
  let prismaService: PrismaService
  let logger: CustomLogger
  let paginationService: PaginationService
  let mockPrismaModel: any

  beforeEach(async () => {
    const mockService = createBaseMockService()
    const module = await createTestModule({
      controller: ContentTagController,
      serviceClass: ContentTagsService,
      mockService,
      prismaModelName: 'content_tags',
    })

    controller = module.get<ContentTagController>(ContentTagController)
    contentTagsService = module.get(ContentTagsService)
    prismaService = module.get<PrismaService>(PrismaService)
    logger = module.get<CustomLogger>(CustomLogger)
    paginationService = module.get<PaginationService>(PaginationService)
    mockPrismaModel = prismaService['content_tags']

    mockControllerProperties(
      controller,
      mockPrismaModel,
      logger,
      contentTagsService,
      paginationService,
      'contentTagsService',
    )
  })

  describe('findAllContentTags', () => {
    it('should return paginated content tags', async () => {
      const contentTags = [createSampleContentTag(), createSampleContentTag()]
      const query = { page: 1, limit: 10 }

      mockPrismaModel.findMany.mockResolvedValue(contentTags)
      mockPrismaModel.count.mockResolvedValue(2)

      const result = await controller.findAllContentTags(query)

      expect(result).toEqual(createPaginatedResponse(contentTags, 2))
    })

    it('should handle errors', async () => {
      mockPrismaModel.findMany.mockRejectedValue(new InternalServerErrorException('Database error'))

      await expect(controller.findAllContentTags({ page: 1, limit: 10 })).rejects.toThrow(
        InternalServerErrorException,
      )
    })
  })

  describe('findOneContentTags', () => {
    it('should return a single content tag', async () => {
      const contentTag = createSampleContentTag()
      const id = faker.string.uuid()

      mockPrismaModel.findUnique.mockResolvedValue(contentTag)

      const result = await controller.findOneContentTags(id)

      expect(result).toEqual(createSuccessResponse(contentTag))
    })

    it('should handle errors', async () => {
      const id = faker.string.uuid()
      mockPrismaModel.findUnique.mockResolvedValue(null)

      await expect(controller.findOneContentTags(id)).rejects.toThrow(NotFoundException)
    })
  })

  describe('createContentTags', () => {
    it('should create a content tag', async () => {
      const createData = createSampleContentTag()
      const createdContentTag = { id: faker.string.uuid(), ...createData }

      mockPrismaModel.create.mockResolvedValue(createdContentTag)

      const result = await controller.createContentTags(createData)

      expect(result).toEqual(createSuccessResponse(createdContentTag))
    })

    it('should handle errors', async () => {
      const createData = createSampleContentTag()
      mockPrismaModel.create.mockRejectedValue(new InternalServerErrorException('Creation failed'))

      await expect(controller.createContentTags(createData)).rejects.toThrow(
        InternalServerErrorException,
      )
    })
  })

  describe('updateContentTags', () => {
    it('should update a content tag', async () => {
      const id = faker.string.uuid()
      const updateData = createSampleContentTag()
      const updatedContentTag = { id, ...updateData }

      mockPrismaModel.update.mockResolvedValue(updatedContentTag)

      const result = await controller.updateContentTags(id, updateData)

      expect(result).toEqual(createSuccessResponse(updatedContentTag))
    })

    it('should handle errors', async () => {
      const id = faker.string.uuid()
      const updateData = createSampleContentTag()
      mockPrismaModel.update.mockRejectedValue(new InternalServerErrorException('Update failed'))

      await expect(controller.updateContentTags(id, updateData)).rejects.toThrow(
        InternalServerErrorException,
      )
    })
  })

  describe('removeContentTags', () => {
    it('should remove a content tag', async () => {
      const id = faker.string.uuid()
      const deletedContentTag = { id }

      mockPrismaModel.findUnique.mockResolvedValue(deletedContentTag)
      mockPrismaModel.delete.mockResolvedValue(deletedContentTag)

      const result = await controller.removeContentTags(id)

      expect(result).toEqual(createSuccessResponse(deletedContentTag))
    })

    it('should handle errors', async () => {
      const id = faker.string.uuid()
      mockPrismaModel.findUnique.mockResolvedValue(null)

      await expect(controller.removeContentTags(id)).rejects.toThrow(NotFoundException)
    })
  })
})
