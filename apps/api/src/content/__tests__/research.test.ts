import { describe, it, expect, beforeEach } from 'vitest'
import { PrismaService } from '@core/services/prisma.service'
import { PaginationService } from '@core/services/pagination.service'
import { CustomLogger } from '@core/logger/custom.logger'
import { faker } from '@faker-js/faker'
import type { Prisma } from '@prisma/client'
import { ResearchService } from '../services/research.service'
import { ResearchController } from '../controllers/research.controller'
import {
  createTestModule,
  createBaseMockService,
  createSuccessResponse,
  createErrorResponse,
  createPaginatedResponse,
  mockControllerProperties,
} from './utils/test.utils'

const createSampleResearch = (): Prisma.researchCreateInput => ({
  published_at: faker.helpers.arrayElement([faker.date.recent(), null]),
  title: faker.helpers.arrayElement([faker.lorem.words(3), null]),
  version: faker.helpers.arrayElement([1, null]),
  abstract: faker.helpers.arrayElement([faker.lorem.words(3), null]),
  keywords: faker.lorem.words(5),
  month: faker.helpers.arrayElement([faker.date.month(), null]),
  year: faker.date.past().getFullYear().toString(),
  abstract_url: faker.internet.url(),
  category: faker.helpers.arrayElement([faker.lorem.words(3), null]),
  doi_url: faker.helpers.arrayElement([faker.internet.url(), null]),
  figure_count: faker.helpers.arrayElement([
    faker.number.int({ min: 0, max: 10 }),
    null,
  ]),
  has_embedding: faker.helpers.arrayElement([faker.datatype.boolean(), null]),
  page_count: faker.helpers.arrayElement([
    faker.number.int({ min: 1, max: 100 }),
    null,
  ]),
  pdf_url: faker.helpers.arrayElement([faker.internet.url(), null]),
  published_in: faker.helpers.arrayElement([faker.lorem.words(3), null]),
  table_count: faker.helpers.arrayElement([
    faker.number.int({ min: 0, max: 10 }),
    null,
  ]),
  comments: faker.helpers.arrayElement([faker.lorem.words(3), null]),
  is_flagged: faker.datatype.boolean(),
  authors: faker.helpers.arrayElement([faker.lorem.words(5).split(' '), null]),
  summary: faker.helpers.arrayElement([faker.lorem.words(3), null]),
  content_status: faker.helpers.arrayElement([
    'draft',
    'published',
    'archived',
    null,
  ]),
  affiliations: faker.helpers.arrayElement([
    faker.lorem.words(5).split(' '),
    null,
  ]),
})

describe('Research Module', () => {
  let controller: ResearchController
  let researchService: ReturnType<typeof createBaseMockService>
  let prismaService: PrismaService
  let logger: CustomLogger
  let paginationService: PaginationService
  let mockPrismaModel: any

  beforeEach(async () => {
    const mockService = createBaseMockService()
    const module = await createTestModule({
      controller: ResearchController,
      serviceClass: ResearchService,
      mockService,
      prismaModelName: 'research',
    })

    controller = module.get<ResearchController>(ResearchController)
    researchService = module.get(ResearchService)
    prismaService = module.get<PrismaService>(PrismaService)
    logger = module.get<CustomLogger>(CustomLogger)
    paginationService = module.get<PaginationService>(PaginationService)
    mockPrismaModel = prismaService['research']

    mockControllerProperties(
      controller,
      mockPrismaModel,
      logger,
      researchService,
      paginationService,
      'researchService',
    )
  })

  describe('findAllResearch', () => {
    it('should return paginated research', async () => {
      const research = [
        { id: '1', ...createSampleResearch() },
        { id: '2', ...createSampleResearch() },
      ]
      const query = { page: 1, limit: 10 }

      mockPrismaModel.findMany.mockResolvedValue(research)
      mockPrismaModel.count.mockResolvedValue(2)

      const result = await controller.findAllResearch(query)

      expect(result).toEqual(createPaginatedResponse(research, 2))
      expect(mockPrismaModel.findMany).toHaveBeenCalled()
      expect(mockPrismaModel.count).toHaveBeenCalled()
    })

    it('should handle errors when fetching research', async () => {
      const error = new Error('Database error')
      mockPrismaModel.findMany.mockRejectedValue(error: any)

      const result = await controller.findAllResearch({ page: 1, limit: 10 })
      expect(result).toEqual(createErrorResponse('Database error'))
    })

    it('should handle filters and sorting', async () => {
      const research = [
        { id: '1', ...createSampleResearch() },
        { id: '2', ...createSampleResearch() },
      ]
      const query = {
        page: 1,
        limit: 10,
        sortBy: 'created_at',
        sortOrder: 'desc' as const,
        content_status: 'published',
        has_embedding: true,
      }

      mockPrismaModel.findMany.mockResolvedValue(research)
      mockPrismaModel.count.mockResolvedValue(2)

      const result = await controller.findAllResearch(query)

      expect(result).toEqual(createPaginatedResponse(research, 2))
      expect(mockPrismaModel.findMany).toHaveBeenCalled()
      expect(mockPrismaModel.count).toHaveBeenCalled()
    })
  })

  describe('findOneResearch', () => {
    it('should return a single research', async () => {
      const research = { id: '1', ...createSampleResearch() }
      mockPrismaModel.findUnique.mockResolvedValue(research)

      const result = await controller.findOneResearch('1')

      expect(result).toEqual(createSuccessResponse(research))
      expect(mockPrismaModel.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      })
    })

    it('should handle not found error', async () => {
      mockPrismaModel.findUnique.mockResolvedValue(null)

      const result = await controller.findOneResearch('1')
      expect(result).toEqual(createErrorResponse('research not found'))
    })
  })

  describe('createResearch', () => {
    it('should create a research', async () => {
      const createData = createSampleResearch()
      const createdResearch = {
        id: '1',
        ...createData,
        created_at: new Date(),
        updated_at: new Date(),
      }

      mockPrismaModel.create.mockResolvedValue(createdResearch)

      const result = await controller.createResearch(createData)

      expect(result).toEqual(createSuccessResponse(createdResearch))
      expect(mockPrismaModel.create).toHaveBeenCalledWith({
        data: createData,
      })
    })

    it('should handle creation errors', async () => {
      const createData = createSampleResearch()
      const error = new Error('Creation failed')
      mockPrismaModel.create.mockRejectedValue(error: any)

      const result = await controller.createResearch(createData)
      expect(result).toEqual(createErrorResponse('Creation failed'))
    })
  })

  describe('updateResearch', () => {
    it('should update a research', async () => {
      const id = '1'
      const updateData: Prisma.researchUpdateInput = {
        title: faker.lorem.words(3),
        content_status: 'published',
        has_embedding: true,
        summary: faker.lorem.words(3),
      }
      const updatedResearch = {
        id,
        ...updateData,
        user_id: faker.string.uuid(),
        created_at: new Date(),
        updated_at: new Date(),
      }

      mockPrismaModel.update.mockResolvedValue(updatedResearch)

      const result = await controller.updateResearch(id, updateData)

      expect(result).toEqual(createSuccessResponse(updatedResearch))
      expect(mockPrismaModel.update).toHaveBeenCalledWith({
        where: { id },
        data: updateData,
      })
    })

    it('should handle update errors', async () => {
      const id = '1'
      const updateData: Prisma.researchUpdateInput = {
        title: faker.lorem.words(3),
      }
      const error = new Error('Update failed')
      mockPrismaModel.update.mockRejectedValue(error: any)

      const result = await controller.updateResearch(id, updateData)
      expect(result).toEqual(createErrorResponse('Update failed'))
    })
  })

  describe('removeResearch', () => {
    it('should remove a research', async () => {
      const id = '1'
      const deletedResearch = {
        id,
        title: faker.lorem.words(3),
        user_id: faker.string.uuid(),
        created_at: new Date(),
        updated_at: new Date(),
      }

      mockPrismaModel.findUnique.mockResolvedValue(deletedResearch)
      mockPrismaModel.delete.mockResolvedValue(deletedResearch)

      const result = await controller.removeResearch(id)

      expect(result).toEqual(createSuccessResponse(deletedResearch))
      expect(mockPrismaModel.delete).toHaveBeenCalledWith({
        where: { id },
      })
    })

    it('should handle removal errors', async () => {
      const id = '1'
      mockPrismaModel.findUnique.mockResolvedValue(null)

      const result = await controller.removeResearch(id)
      expect(result).toEqual(createErrorResponse('research not found'))
    })
  })
})
