import { describe, it, expect, beforeEach } from 'vitest'
import { PrismaService } from '@core/services/prisma.service'
import { PaginationService } from '@core/services/pagination.service'
import { CustomLogger } from '@core/logger/custom.logger'
import { faker } from '@faker-js/faker'
import type { Prisma } from '@prisma/client'
import { NotFoundException, InternalServerErrorException } from '@nestjs/common'
import { ContentSourceVisitService } from '../services/content-source-visits.service'
import { ContentSourceVisitController } from '../controllers/content-source-visits.controller'
import type { MockType } from './utils/test.utils'
import {
  createTestModule,
  createBaseMockService,
  createSuccessResponse,
  createErrorResponse,
  createPaginatedResponse,
  mockControllerProperties,
} from './utils/test.utils'

const createSampleContentSourceVisit = (): Prisma.content_source_visitsCreateInput => ({
  contents: { connect: { id: faker.string.uuid() } },
  user_profiles: { connect: { id: faker.string.uuid() } },
})

describe('ContentSourceVisitController', () => {
  let controller: ContentSourceVisitController
  let contentSourceVisitService: MockType<ContentSourceVisitService>
  let prismaService: PrismaService
  let logger: CustomLogger
  let paginationService: PaginationService
  let mockPrismaModel: any

  beforeEach(async () => {
    const mockService = createBaseMockService()
    const module = await createTestModule({
      controller: ContentSourceVisitController,
      serviceClass: ContentSourceVisitService,
      mockService,
      prismaModelName: 'content_source_visits',
    })

    controller = module.get<ContentSourceVisitController>(ContentSourceVisitController)
    contentSourceVisitService = module.get(ContentSourceVisitService)
    prismaService = module.get<PrismaService>(PrismaService)
    logger = module.get<CustomLogger>(CustomLogger)
    paginationService = module.get<PaginationService>(PaginationService)
    mockPrismaModel = prismaService['content_source_visits']

    mockControllerProperties(
      controller,
      mockPrismaModel,
      logger,
      contentSourceVisitService,
      paginationService,
      'contentSourceVisitService',
    )
  })

  describe('findAllContentSourceVisits', () => {
    it('should return paginated content source visits', async () => {
      const visits = [createSampleContentSourceVisit(), createSampleContentSourceVisit()]
      const query = { page: 1, limit: 10 }

      mockPrismaModel.findMany.mockResolvedValue(visits)
      mockPrismaModel.count.mockResolvedValue(2)

      const result = await controller.findAllContentSourceVisits(query)

      expect(result).toEqual(createPaginatedResponse(visits, 2))
    })

    it('should handle errors', async () => {
      mockPrismaModel.findMany.mockRejectedValue(new Error('Database error'))

      await expect(controller.findAllContentSourceVisits({ page: 1, limit: 10 })).rejects.toThrow(
        InternalServerErrorException,
      )
    })
  })

  describe('findOneContentSourceVisits', () => {
    it('should return a single content source visit', async () => {
      const visit = createSampleContentSourceVisit()
      const id = faker.string.uuid()

      mockPrismaModel.findUnique.mockResolvedValue(visit)

      const result = await controller.findOneContentSourceVisits(id)

      expect(result).toEqual(createSuccessResponse(visit))
    })

    it('should handle errors', async () => {
      const id = faker.string.uuid()
      mockPrismaModel.findUnique.mockResolvedValue(null)

      await expect(controller.findOneContentSourceVisits(id)).rejects.toThrow(NotFoundException)
    })
  })

  describe('createContentSourceVisits', () => {
    it('should create a content source visit', async () => {
      const createData = createSampleContentSourceVisit()
      const createdVisit = { id: faker.string.uuid(), ...createData }

      mockPrismaModel.create.mockResolvedValue(createdVisit)

      const result = await controller.createContentSourceVisits(createData)

      expect(result).toEqual(createSuccessResponse(createdVisit))
    })

    it('should handle errors', async () => {
      const createData = createSampleContentSourceVisit()
      mockPrismaModel.create.mockRejectedValue(new Error('Creation failed'))

      await expect(controller.createContentSourceVisits(createData)).rejects.toThrow(
        InternalServerErrorException,
      )
    })
  })

  describe('updateContentSourceVisits', () => {
    it('should update a content source visit', async () => {
      const id = faker.string.uuid()
      const updateData = createSampleContentSourceVisit()
      const updatedVisit = { id, ...updateData }

      mockPrismaModel.update.mockResolvedValue(updatedVisit)

      const result = await controller.updateContentSourceVisits(id, updateData)

      expect(result).toEqual(createSuccessResponse(updatedVisit))
    })

    it('should handle errors', async () => {
      const id = faker.string.uuid()
      const updateData = createSampleContentSourceVisit()
      mockPrismaModel.update.mockRejectedValue(new Error('Update failed'))

      await expect(controller.updateContentSourceVisits(id, updateData)).rejects.toThrow(
        InternalServerErrorException,
      )
    })
  })

  describe('removeContentSourceVisits', () => {
    it('should remove a content source visit', async () => {
      const id = faker.string.uuid()
      const deletedVisit = { id }

      mockPrismaModel.findUnique.mockResolvedValue(deletedVisit)
      mockPrismaModel.delete.mockResolvedValue(deletedVisit)

      const result = await controller.removeContentSourceVisits(id)

      expect(result).toEqual(createSuccessResponse(deletedVisit))
    })

    it('should handle errors', async () => {
      const id = faker.string.uuid()
      mockPrismaModel.findUnique.mockResolvedValue(null)

      await expect(controller.removeContentSourceVisits(id)).rejects.toThrow(NotFoundException)
    })
  })
})
