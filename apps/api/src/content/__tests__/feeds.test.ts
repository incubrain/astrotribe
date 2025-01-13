import { describe, it, expect, beforeEach } from 'vitest'
import { PrismaService } from '@core/services/prisma.service'
import { PaginationService } from '@core/services/pagination.service'
import { CustomLogger } from '@core/logger/custom.logger'
import { faker } from '@faker-js/faker'
import type { Prisma } from '@astronera/db'
import { FeedsService } from '../services/feeds.service'
import { FeedController } from '../controllers/feeds.controller'
import {
  createTestModule,
  createBaseMockService,
  createSuccessResponse,
  createErrorResponse,
  createPaginatedResponse,
  mockControllerProperties,
} from './utils/test.utils'

const createSampleFeed = (): Prisma.feedsCreateInput => ({
  name: faker.helpers.arrayElement([faker.lorem.words(3), null]),
  user_profiles: { connect: { id: faker.string.uuid() } },
})

describe('Feed Module', () => {
  let controller: FeedController
  let feedsService: ReturnType<typeof createBaseMockService>
  let prismaService: PrismaService
  let logger: CustomLogger
  let paginationService: PaginationService
  let mockPrismaModel: any

  beforeEach(async () => {
    const mockService = createBaseMockService()
    const module = await createTestModule({
      controller: FeedController,
      serviceClass: FeedsService,
      mockService,
      prismaModelName: 'feeds',
    })

    controller = module.get<FeedController>(FeedController)
    feedsService = module.get(FeedsService)
    prismaService = module.get<PrismaService>(PrismaService)
    logger = module.get<CustomLogger>(CustomLogger)
    paginationService = module.get<PaginationService>(PaginationService)
    mockPrismaModel = prismaService['feeds']

    mockControllerProperties(
      controller,
      mockPrismaModel,
      logger,
      feedsService,
      paginationService,
      'feedsService',
    )
  })

  describe('findAllFeeds', () => {
    it('should return paginated feeds', async () => {
      const feeds = [
        { id: '1', ...createSampleFeed() },
        { id: '2', ...createSampleFeed() },
      ]
      const query = { page: 1, limit: 10 }

      mockPrismaModel.findMany.mockResolvedValue(feeds)
      mockPrismaModel.count.mockResolvedValue(2)

      const result = await controller.findAllFeeds(query)

      expect(result).toEqual(createPaginatedResponse(feeds, 2))
      expect(mockPrismaModel.findMany).toHaveBeenCalled()
      expect(mockPrismaModel.count).toHaveBeenCalled()
    })

    it('should handle errors when fetching feeds', async () => {
      const error = new Error('Database error')
      mockPrismaModel.findMany.mockRejectedValue(error)

      const result = await controller.findAllFeeds({ page: 1, limit: 10 })
      expect(result).toEqual(createErrorResponse('Database error'))
    })

    it('should handle filters and sorting', async () => {
      const feeds = [
        { id: '1', ...createSampleFeed() },
        { id: '2', ...createSampleFeed() },
      ]
      const query = {
        page: 1,
        limit: 10,
        sortBy: 'created_at',
        sortOrder: 'desc' as const,
        name: 'test',
      }

      mockPrismaModel.findMany.mockResolvedValue(feeds)
      mockPrismaModel.count.mockResolvedValue(2)

      const result = await controller.findAllFeeds(query)

      expect(result).toEqual(createPaginatedResponse(feeds, 2))
      expect(mockPrismaModel.findMany).toHaveBeenCalled()
      expect(mockPrismaModel.count).toHaveBeenCalled()
    })
  })

  describe('findOneFeeds', () => {
    it('should return a single feed', async () => {
      const feed = { id: '1', ...createSampleFeed() }
      mockPrismaModel.findUnique.mockResolvedValue(feed)

      const result = await controller.findOneFeeds('1')

      expect(result).toEqual(createSuccessResponse(feed))
      expect(mockPrismaModel.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      })
    })

    it('should handle not found error', async () => {
      mockPrismaModel.findUnique.mockResolvedValue(null)

      const result = await controller.findOneFeeds('1')
      expect(result).toEqual(createErrorResponse('feeds not found'))
    })
  })

  describe('createFeeds', () => {
    it('should create a feed', async () => {
      const createData = createSampleFeed()
      const createdFeed = {
        id: '1',
        name: createData.name,
        user_id: createData.user_profiles.connect!.id,
        created_at: new Date(),
        updated_at: new Date(),
      }

      mockPrismaModel.create.mockResolvedValue(createdFeed)

      const result = await controller.createFeeds(createData)

      expect(result).toEqual(createSuccessResponse(createdFeed))
      expect(mockPrismaModel.create).toHaveBeenCalledWith({
        data: createData,
      })
    })

    it('should handle creation errors', async () => {
      const createData = createSampleFeed()
      const error = new Error('Creation failed')
      mockPrismaModel.create.mockRejectedValue(error)

      const result = await controller.createFeeds(createData)
      expect(result).toEqual(createErrorResponse('Creation failed'))
    })
  })

  describe('updateFeeds', () => {
    it('should update a feed', async () => {
      const id = '1'
      const updateData: Prisma.feedsUpdateInput = {
        name: faker.lorem.words(3),
      }
      const updatedFeed = {
        id,
        ...updateData,
        user_id: faker.string.uuid(),
        created_at: new Date(),
        updated_at: new Date(),
      }

      mockPrismaModel.update.mockResolvedValue(updatedFeed)

      const result = await controller.updateFeeds(id, updateData)

      expect(result).toEqual(createSuccessResponse(updatedFeed))
      expect(mockPrismaModel.update).toHaveBeenCalledWith({
        where: { id },
        data: updateData,
      })
    })

    it('should handle update errors', async () => {
      const id = '1'
      const updateData: Prisma.feedsUpdateInput = {
        name: faker.lorem.words(3),
      }
      const error = new Error('Update failed')
      mockPrismaModel.update.mockRejectedValue(error)

      const result = await controller.updateFeeds(id, updateData)
      expect(result).toEqual(createErrorResponse('Update failed'))
    })
  })

  describe('removeFeeds', () => {
    it('should remove a feed', async () => {
      const id = '1'
      const deletedFeed = {
        id,
        name: faker.lorem.words(3),
        user_id: faker.string.uuid(),
        created_at: new Date(),
        updated_at: new Date(),
      }

      mockPrismaModel.findUnique.mockResolvedValue(deletedFeed)
      mockPrismaModel.delete.mockResolvedValue(deletedFeed)

      const result = await controller.removeFeeds(id)

      expect(result).toEqual(createSuccessResponse(deletedFeed))
      expect(mockPrismaModel.delete).toHaveBeenCalledWith({
        where: { id },
      })
    })

    it('should handle removal errors', async () => {
      const id = '1'
      mockPrismaModel.findUnique.mockResolvedValue(null)

      const result = await controller.removeFeeds(id)
      expect(result).toEqual(createErrorResponse('feeds not found'))
    })
  })
})
