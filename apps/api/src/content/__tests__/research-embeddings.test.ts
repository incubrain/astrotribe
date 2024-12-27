import { describe, it, expect, beforeEach } from 'vitest'
import { PrismaService } from '@core/services/prisma.service'
import { PaginationService } from '@core/services/pagination.service'
import { CustomLogger } from '@core/logger/custom.logger'
import { faker } from '@faker-js/faker'
import type { Prisma } from '@prisma/client'
import { ResearchEmbeddingsService } from '../services/research-embeddings.service'
import { ResearchEmbeddingController } from '../controllers/research-embeddings.controller'
import {
  createTestModule,
  createBaseMockService,
  createSuccessResponse,
  createErrorResponse,
  createPaginatedResponse,
  mockControllerProperties,
} from './utils/test.utils'

const createSampleResearchEmbedding = (): Prisma.research_embeddingsCreateInput => ({
  research: { connect: { id: faker.string.uuid() } },
  chunk: faker.lorem.words(3),
  url: faker.helpers.arrayElement([faker.internet.url(), null]),
  // embedding: faker.helpers.arrayElement([faker.lorem.words(10).split(' '), null]),
  is_flagged: faker.helpers.arrayElement([faker.datatype.boolean(), null]),
  // embedding_reviews: faker.helpers.arrayElement([
  //   { connect: { id: faker.string.uuid() } },
  //   undefined
  // ])
})

describe('ResearchEmbedding Module', () => {
  let controller: ResearchEmbeddingController
  let researchEmbeddingsService: ReturnType<typeof createBaseMockService>
  let prismaService: PrismaService
  let logger: CustomLogger
  let paginationService: PaginationService
  let mockPrismaModel: any

  beforeEach(async () => {
    const mockService = createBaseMockService()
    const module = await createTestModule({
      controller: ResearchEmbeddingController,
      serviceClass: ResearchEmbeddingsService,
      mockService,
      prismaModelName: 'research_embeddings',
    })

    controller = module.get<ResearchEmbeddingController>(ResearchEmbeddingController)
    researchEmbeddingsService = module.get(ResearchEmbeddingsService)
    prismaService = module.get<PrismaService>(PrismaService)
    logger = module.get<CustomLogger>(CustomLogger)
    paginationService = module.get<PaginationService>(PaginationService)
    mockPrismaModel = prismaService['research_embeddings']

    mockControllerProperties(
      controller,
      mockPrismaModel,
      logger,
      researchEmbeddingsService,
      paginationService,
      'researchEmbeddingsService',
    )
  })

  describe('findAllResearchEmbeddings', () => {
    it('should return paginated research embeddings', async () => {
      const researchEmbeddings = [
        { id: '1', ...createSampleResearchEmbedding() },
        { id: '2', ...createSampleResearchEmbedding() },
      ]
      const query = { page: 1, limit: 10 }

      mockPrismaModel.findMany.mockResolvedValue(researchEmbeddings)
      mockPrismaModel.count.mockResolvedValue(2)

      const result = await controller.findAllResearchEmbeddings(query)

      expect(result).toEqual(createPaginatedResponse(researchEmbeddings, 2))
      expect(mockPrismaModel.findMany).toHaveBeenCalled()
      expect(mockPrismaModel.count).toHaveBeenCalled()
    })

    it('should handle errors when fetching research embeddings', async () => {
      const error = new Error('Database error')
      mockPrismaModel.findMany.mockRejectedValue(error)

      const result = await controller.findAllResearchEmbeddings({
        page: 1,
        limit: 10,
      })
      expect(result).toEqual(createErrorResponse('Database error'))
    })

    it('should handle filters and sorting', async () => {
      const researchEmbeddings = [
        { id: '1', ...createSampleResearchEmbedding() },
        { id: '2', ...createSampleResearchEmbedding() },
      ]
      const query = {
        page: 1,
        limit: 10,
        sortBy: 'created_at',
        sortOrder: 'desc' as const,
        is_flagged: true,
      }

      mockPrismaModel.findMany.mockResolvedValue(researchEmbeddings)
      mockPrismaModel.count.mockResolvedValue(2)

      const result = await controller.findAllResearchEmbeddings(query)

      expect(result).toEqual(createPaginatedResponse(researchEmbeddings, 2))
      expect(mockPrismaModel.findMany).toHaveBeenCalled()
      expect(mockPrismaModel.count).toHaveBeenCalled()
    })
  })

  describe('findOneResearchEmbeddings', () => {
    it('should return a single research embedding', async () => {
      const researchEmbedding = { id: '1', ...createSampleResearchEmbedding() }
      mockPrismaModel.findUnique.mockResolvedValue(researchEmbedding)

      const result = await controller.findOneResearchEmbeddings('1')

      expect(result).toEqual(createSuccessResponse(researchEmbedding))
      expect(mockPrismaModel.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      })
    })

    it('should handle not found error', async () => {
      mockPrismaModel.findUnique.mockResolvedValue(null)

      const result = await controller.findOneResearchEmbeddings('1')
      expect(result).toEqual(createErrorResponse('research_embeddings not found'))
    })
  })

  describe('createResearchEmbeddings', () => {
    it('should create a research embedding', async () => {
      const createData = createSampleResearchEmbedding()
      const createdEmbedding = {
        id: '1',
        ...createData,
        research_id: createData.research.connect!.id,
        // embedding_review_id: createData.embedding_review?.connect?.id,
        created_at: new Date(),
        updated_at: new Date(),
      }

      mockPrismaModel.create.mockResolvedValue(createdEmbedding)

      const result = await controller.createResearchEmbeddings(createData)

      expect(result).toEqual(createSuccessResponse(createdEmbedding))
      expect(mockPrismaModel.create).toHaveBeenCalledWith({
        data: createData,
      })
    })

    it('should handle creation errors', async () => {
      const createData = createSampleResearchEmbedding()
      const error = new Error('Creation failed')
      mockPrismaModel.create.mockRejectedValue(error)

      const result = await controller.createResearchEmbeddings(createData)
      expect(result).toEqual(createErrorResponse('Creation failed'))
    })
  })

  describe('updateResearchEmbeddings', () => {
    it('should update a research embedding', async () => {
      const id = '1'
      const updateData: Prisma.research_embeddingsUpdateInput = {
        chunk: faker.lorem.words(3),
        is_flagged: true,
        // embedding_review: { connect: { id: faker.string.uuid() } }
      }
      const updatedEmbedding = {
        id,
        ...updateData,
        research_id: faker.string.uuid(),
        // embedding_review_id: updateData.embedding_review?.connect?.id,
        created_at: new Date(),
        updated_at: new Date(),
      }

      mockPrismaModel.update.mockResolvedValue(updatedEmbedding)

      const result = await controller.updateResearchEmbeddings(id, updateData)

      expect(result).toEqual(createSuccessResponse(updatedEmbedding))
      expect(mockPrismaModel.update).toHaveBeenCalledWith({
        where: { id },
        data: updateData,
      })
    })

    it('should handle update errors', async () => {
      const id = '1'
      const updateData: Prisma.research_embeddingsUpdateInput = {
        chunk: faker.lorem.words(3),
      }
      const error = new Error('Update failed')
      mockPrismaModel.update.mockRejectedValue(error)

      const result = await controller.updateResearchEmbeddings(id, updateData)
      expect(result).toEqual(createErrorResponse('Update failed'))
    })
  })

  describe('removeResearchEmbeddings', () => {
    it('should remove a research embedding', async () => {
      const id = '1'
      const deletedEmbedding = {
        id,
        chunk: faker.lorem.words(3),
        research_id: faker.string.uuid(),
        created_at: new Date(),
        updated_at: new Date(),
      }

      mockPrismaModel.findUnique.mockResolvedValue(deletedEmbedding)
      mockPrismaModel.delete.mockResolvedValue(deletedEmbedding)

      const result = await controller.removeResearchEmbeddings(id)

      expect(result).toEqual(createSuccessResponse(deletedEmbedding))
      expect(mockPrismaModel.delete).toHaveBeenCalledWith({
        where: { id },
      })
    })

    it('should handle removal errors', async () => {
      const id = '1'
      mockPrismaModel.findUnique.mockResolvedValue(null)

      const result = await controller.removeResearchEmbeddings(id)
      expect(result).toEqual(createErrorResponse('research_embeddings not found'))
    })
  })
})
