import { describe, it, expect, beforeEach } from 'vitest'
import { PrismaService } from '@core/services/prisma.service'
import { PaginationService } from '@core/services/pagination.service'
import { CustomLogger } from '@core/logger/custom.logger'
import { faker } from '@faker-js/faker'
import type { Prisma } from '@prisma/client'
import { content_status } from '@prisma/client'
import { NotFoundException, InternalServerErrorException } from '@nestjs/common'
import { ContentStatusesService } from '../services/content-statuses.service'
import { ContentStatusController } from '../controllers/content-statuses.controller'
import type { MockType } from './utils/test.utils'
import {
  createTestModule,
  createBaseMockService,
  createSuccessResponse,
  createErrorResponse,
  createPaginatedResponse,
  mockControllerProperties,
} from './utils/test.utils'

const createSampleContentStatus = (): Prisma.content_statusesCreateInput => ({
  contents: { connect: { id: faker.string.uuid() } },
  content_status: faker.helpers.arrayElement([...Object.values(content_status)]),
  created_at: faker.date.recent(),
  notes: faker.lorem.sentence(),
})

describe('ContentStatusController', () => {
  let controller: ContentStatusController
  let contentStatusesService: MockType<ContentStatusesService>
  let prismaService: PrismaService
  let logger: CustomLogger
  let paginationService: PaginationService
  let mockPrismaModel: any

  beforeEach(async () => {
    const mockService = createBaseMockService()
    const module = await createTestModule({
      controller: ContentStatusController,
      serviceClass: ContentStatusesService,
      mockService,
      prismaModelName: 'content_statuses',
    })

    controller = module.get<ContentStatusController>(ContentStatusController)
    contentStatusesService = module.get(ContentStatusesService)
    prismaService = module.get<PrismaService>(PrismaService)
    logger = module.get<CustomLogger>(CustomLogger)
    paginationService = module.get<PaginationService>(PaginationService)
    mockPrismaModel = prismaService['content_statuses']

    mockControllerProperties(
      controller,
      mockPrismaModel,
      logger,
      contentStatusesService,
      paginationService,
      'contentStatusesService',
    )
  })

  describe('findAllContentStatuses', () => {
    it('should return paginated content statuses', async () => {
      const contentStatuses = [createSampleContentStatus(), createSampleContentStatus()]
      const query = { page: 1, limit: 10 }

      mockPrismaModel.findMany.mockResolvedValue(contentStatuses)
      mockPrismaModel.count.mockResolvedValue(2)

      const result = await controller.findAllContentStatuses(query)

      expect(result).toEqual(createPaginatedResponse(contentStatuses, 2))
    })

    it('should handle errors', async () => {
      mockPrismaModel.findMany.mockRejectedValue(new Error('Database error'))

      await expect(controller.findAllContentStatuses({ page: 1, limit: 10 })).rejects.toThrow(
        InternalServerErrorException,
      )
    })
  })

  describe('findOneContentStatuses', () => {
    it('should return a single content status', async () => {
      const contentStatus = createSampleContentStatus()
      const id = faker.string.uuid()

      mockPrismaModel.findUnique.mockResolvedValue(contentStatus)

      const result = await controller.findOneContentStatuses(id)

      expect(result).toEqual(createSuccessResponse(contentStatus))
    })

    it('should handle errors', async () => {
      const id = faker.string.uuid()
      mockPrismaModel.findUnique.mockResolvedValue(null)

      await expect(controller.findOneContentStatuses(id)).rejects.toThrow(NotFoundException)
    })
  })

  describe('createContentStatuses', () => {
    it('should create a content status', async () => {
      const createData = createSampleContentStatus()
      const createdContentStatus = { id: faker.string.uuid(), ...createData }

      mockPrismaModel.create.mockResolvedValue(createdContentStatus)

      const result = await controller.createContentStatuses(createData)

      expect(result).toEqual(createSuccessResponse(createdContentStatus))
    })

    it('should handle errors', async () => {
      const createData = createSampleContentStatus()
      mockPrismaModel.create.mockRejectedValue(new Error('Creation failed'))

      await expect(controller.createContentStatuses(createData)).rejects.toThrow(
        InternalServerErrorException,
      )
    })
  })

  describe('updateContentStatuses', () => {
    it('should update a content status', async () => {
      const id = faker.string.uuid()
      const updateData = createSampleContentStatus()
      const updatedContentStatus = { id, ...updateData }

      mockPrismaModel.update.mockResolvedValue(updatedContentStatus)

      const result = await controller.updateContentStatuses(id, updateData)

      expect(result).toEqual(createSuccessResponse(updatedContentStatus))
    })

    it('should handle errors', async () => {
      const id = faker.string.uuid()
      const updateData = createSampleContentStatus()
      mockPrismaModel.update.mockRejectedValue(new Error('Update failed'))

      await expect(controller.updateContentStatuses(id, updateData)).rejects.toThrow(
        InternalServerErrorException,
      )
    })
  })

  describe('removeContentStatuses', () => {
    it('should remove a content status', async () => {
      const id = faker.string.uuid()
      const deletedContentStatus = { id }

      mockPrismaModel.findUnique.mockResolvedValue(deletedContentStatus)
      mockPrismaModel.delete.mockResolvedValue(deletedContentStatus)

      const result = await controller.removeContentStatuses(id)

      expect(result).toEqual(createSuccessResponse(deletedContentStatus))
    })

    it('should handle errors', async () => {
      const id = faker.string.uuid()
      mockPrismaModel.findUnique.mockResolvedValue(null)

      await expect(controller.removeContentStatuses(id)).rejects.toThrow(NotFoundException)
    })
  })
})
