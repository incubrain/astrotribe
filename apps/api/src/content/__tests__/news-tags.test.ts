import { describe, it, expect, beforeEach } from 'vitest'
import { PrismaService } from '@core/services/prisma.service'
import { PaginationService } from '@core/services/pagination.service'
import { CustomLogger } from '@core/logger/custom.logger'
import { faker } from '@faker-js/faker'
import type { Prisma } from '@astronera/db'
import { NewsTagsService } from '../services/news-tags.service'
import { NewsTagController } from '../controllers/news-tags.controller'
import {
  createTestModule,
  createBaseMockService,
  createSuccessResponse,
  createErrorResponse,
  createPaginatedResponse,
  mockControllerProperties,
} from './utils/test.utils'

const createSampleNewsTag = (): Prisma.news_tagsCreateInput => ({
  id: faker.number.int(),
  tags: { connect: { id: faker.number.int() } },
  news_id: faker.string.uuid(),
})

describe('NewsTag Module', () => {
  let controller: NewsTagController
  let newsTagsService: ReturnType<typeof createBaseMockService>
  let prismaService: PrismaService
  let logger: CustomLogger
  let paginationService: PaginationService
  let mockPrismaModel: any

  beforeEach(async () => {
    const mockService = createBaseMockService()
    const module = await createTestModule({
      controller: NewsTagController,
      serviceClass: NewsTagsService,
      mockService,
      prismaModelName: 'news_tags',
    })

    controller = module.get<NewsTagController>(NewsTagController)
    newsTagsService = module.get(NewsTagsService)
    prismaService = module.get<PrismaService>(PrismaService)
    logger = module.get<CustomLogger>(CustomLogger)
    paginationService = module.get<PaginationService>(PaginationService)
    mockPrismaModel = prismaService['news_tags']

    mockControllerProperties(
      controller,
      mockPrismaModel,
      logger,
      newsTagsService,
      paginationService,
      'newsTagsService',
    )
  })

  describe('findAllNewsTags', () => {
    it('should return paginated news tags', async () => {
      const newsTags = [
        { id: '1', ...createSampleNewsTag() },
        { id: '2', ...createSampleNewsTag() },
      ]
      const query = { page: 1, limit: 10 }

      mockPrismaModel.findMany.mockResolvedValue(newsTags)
      mockPrismaModel.count.mockResolvedValue(2)

      const result = await controller.findAllNewsTags(query)

      expect(result).toEqual(createPaginatedResponse(newsTags, 2))
      expect(mockPrismaModel.findMany).toHaveBeenCalled()
      expect(mockPrismaModel.count).toHaveBeenCalled()
    })

    it('should handle errors when fetching news tags', async () => {
      const error = new Error('Database error')
      mockPrismaModel.findMany.mockRejectedValue(error)

      const result = await controller.findAllNewsTags({ page: 1, limit: 10 })
      expect(result).toEqual(createErrorResponse('Database error'))
    })

    it('should handle filters and sorting', async () => {
      const newsTags = [
        { id: '1', ...createSampleNewsTag() },
        { id: '2', ...createSampleNewsTag() },
      ]
      const query = {
        page: 1,
        limit: 10,
        sortBy: 'created_at',
        sortOrder: 'desc' as const,
      }

      mockPrismaModel.findMany.mockResolvedValue(newsTags)
      mockPrismaModel.count.mockResolvedValue(2)

      const result = await controller.findAllNewsTags(query)

      expect(result).toEqual(createPaginatedResponse(newsTags, 2))
      expect(mockPrismaModel.findMany).toHaveBeenCalled()
      expect(mockPrismaModel.count).toHaveBeenCalled()
    })
  })

  describe('findOneNewsTags', () => {
    it('should return a single news tag', async () => {
      const newsTag = { id: '1', ...createSampleNewsTag() }
      mockPrismaModel.findUnique.mockResolvedValue(newsTag)

      const result = await controller.findOneNewsTags('1')

      expect(result).toEqual(createSuccessResponse(newsTag))
      expect(mockPrismaModel.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      })
    })

    it('should handle not found error', async () => {
      mockPrismaModel.findUnique.mockResolvedValue(null)

      const result = await controller.findOneNewsTags('1')
      expect(result).toEqual(createErrorResponse('news_tags not found'))
    })
  })

  describe('createNewsTags', () => {
    it('should create a news tag', async () => {
      const createData = createSampleNewsTag()
      const createdTag = {
        id: '1',
        tag_id: createData.tags.connect!.id,
        news_id: createData.news_id,
        created_at: new Date(),
        updated_at: new Date(),
      }

      mockPrismaModel.create.mockResolvedValue(createdTag)

      const result = await controller.createNewsTags(createData)

      expect(result).toEqual(createSuccessResponse(createdTag))
      expect(mockPrismaModel.create).toHaveBeenCalledWith({
        data: createData,
      })
    })

    it('should handle creation errors', async () => {
      const createData = createSampleNewsTag()
      const error = new Error('Creation failed')
      mockPrismaModel.create.mockRejectedValue(error)

      const result = await controller.createNewsTags(createData)
      expect(result).toEqual(createErrorResponse('Creation failed'))
    })
  })

  describe('updateNewsTags', () => {
    it('should update a news tag', async () => {
      const id = '1'
      const updateData: Prisma.news_tagsUpdateInput = {
        tags: { connect: { id: faker.number.int() } },
      }
      const updatedTag = {
        id,
        tag_id: updateData.tags?.connect?.id,
        news_id: faker.string.uuid(),
        created_at: new Date(),
        updated_at: new Date(),
      }

      mockPrismaModel.update.mockResolvedValue(updatedTag)

      const result = await controller.updateNewsTags(id, updateData)

      expect(result).toEqual(createSuccessResponse(updatedTag))
      expect(mockPrismaModel.update).toHaveBeenCalledWith({
        where: { id },
        data: updateData,
      })
    })

    it('should handle update errors', async () => {
      const id = '1'
      const updateData: Prisma.news_tagsUpdateInput = {
        tags: { connect: { id: faker.number.int() } },
      }
      const error = new Error('Update failed')
      mockPrismaModel.update.mockRejectedValue(error)

      const result = await controller.updateNewsTags(id, updateData)
      expect(result).toEqual(createErrorResponse('Update failed'))
    })
  })

  describe('removeNewsTags', () => {
    it('should remove a news tag', async () => {
      const id = '1'
      const deletedTag = {
        id,
        tag_id: faker.string.uuid(),
        news_id: faker.string.uuid(),
        created_at: new Date(),
        updated_at: new Date(),
      }

      mockPrismaModel.findUnique.mockResolvedValue(deletedTag)
      mockPrismaModel.delete.mockResolvedValue(deletedTag)

      const result = await controller.removeNewsTags(id)

      expect(result).toEqual(createSuccessResponse(deletedTag))
      expect(mockPrismaModel.delete).toHaveBeenCalledWith({
        where: { id },
      })
    })

    it('should handle removal errors', async () => {
      const id = '1'
      mockPrismaModel.findUnique.mockResolvedValue(null)

      const result = await controller.removeNewsTags(id)
      expect(result).toEqual(createErrorResponse('news_tags not found'))
    })
  })
})
