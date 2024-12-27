import { describe, it, expect, beforeEach } from 'vitest'
import { PrismaService } from '@core/services/prisma.service'
import { PaginationService } from '@core/services/pagination.service'
import { CustomLogger } from '@core/logger/custom.logger'
import { faker } from '@faker-js/faker'
import type { Prisma } from '@prisma/client'
import { TagsService } from '../services/tags.service'
import { TagController } from '../controllers/tags.controller'
import {
  createTestModule,
  createBaseMockService,
  createSuccessResponse,
  createErrorResponse,
  createPaginatedResponse,
  mockControllerProperties,
} from './utils/test.utils'

const createSampleTag = (): Prisma.tagsCreateInput => ({
  id: faker.number.int(),
  body: faker.helpers.arrayElement([faker.lorem.words(3), null]),
  name: faker.lorem.words(3),
  document_id: faker.helpers.arrayElement([faker.string.uuid(), null]),
  locale: faker.helpers.arrayElement(['en', 'es', 'fr', null]),
  published_at: faker.helpers.arrayElement([faker.date.recent().toString(), null]),
})

describe('Tag Module', () => {
  let controller: TagController
  let tagsService: ReturnType<typeof createBaseMockService>
  let prismaService: PrismaService
  let logger: CustomLogger
  let paginationService: PaginationService
  let mockPrismaModel: any

  beforeEach(async () => {
    const mockService = createBaseMockService()
    const module = await createTestModule({
      controller: TagController,
      serviceClass: TagsService,
      mockService,
      prismaModelName: 'tags',
    })

    controller = module.get<TagController>(TagController)
    tagsService = module.get(TagsService)
    prismaService = module.get<PrismaService>(PrismaService)
    logger = module.get<CustomLogger>(CustomLogger)
    paginationService = module.get<PaginationService>(PaginationService)
    mockPrismaModel = prismaService['tags']

    mockControllerProperties(
      controller,
      mockPrismaModel,
      logger,
      tagsService,
      paginationService,
      'tagsService',
    )
  })

  describe('findAllTags', () => {
    it('should return paginated tags', async () => {
      const tags = [
        { id: '1', ...createSampleTag() },
        { id: '2', ...createSampleTag() },
      ]
      const query = { page: 1, limit: 10 }

      mockPrismaModel.findMany.mockResolvedValue(tags)
      mockPrismaModel.count.mockResolvedValue(2)

      const result = await controller.findAllTags(query)

      expect(result).toEqual(createPaginatedResponse(tags, 2))
      expect(mockPrismaModel.findMany).toHaveBeenCalled()
      expect(mockPrismaModel.count).toHaveBeenCalled()
    })

    it('should handle errors when fetching tags', async () => {
      const error = new Error('Database error')
      mockPrismaModel.findMany.mockRejectedValue(error)

      const result = await controller.findAllTags({ page: 1, limit: 10 })
      expect(result).toEqual(createErrorResponse('Database error'))
    })

    it('should handle filters and sorting', async () => {
      const tags = [
        { id: '1', ...createSampleTag() },
        { id: '2', ...createSampleTag() },
      ]
      const query = {
        page: 1,
        limit: 10,
        sortBy: 'created_at',
        sortOrder: 'desc' as const,
        locale: 'en',
      }

      mockPrismaModel.findMany.mockResolvedValue(tags)
      mockPrismaModel.count.mockResolvedValue(2)

      const result = await controller.findAllTags(query)

      expect(result).toEqual(createPaginatedResponse(tags, 2))
      expect(mockPrismaModel.findMany).toHaveBeenCalled()
      expect(mockPrismaModel.count).toHaveBeenCalled()
    })
  })

  describe('findOneTags', () => {
    it('should return a single tag', async () => {
      const tag = { id: '1', ...createSampleTag() }
      mockPrismaModel.findUnique.mockResolvedValue(tag)

      const result = await controller.findOneTags('1')

      expect(result).toEqual(createSuccessResponse(tag))
      expect(mockPrismaModel.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      })
    })

    it('should handle not found error', async () => {
      mockPrismaModel.findUnique.mockResolvedValue(null)

      const result = await controller.findOneTags('1')
      expect(result).toEqual(createErrorResponse('tags not found'))
    })
  })

  describe('createTags', () => {
    it('should create a tag', async () => {
      const createData = createSampleTag()
      const createdTag = {
        id: '1',
        ...createData,
        created_at: new Date(),
        updated_at: new Date(),
      }

      mockPrismaModel.create.mockResolvedValue(createdTag)

      const result = await controller.createTags(createData)

      expect(result).toEqual(createSuccessResponse(createdTag))
      expect(mockPrismaModel.create).toHaveBeenCalledWith({
        data: createData,
      })
    })

    it('should handle creation errors', async () => {
      const createData = createSampleTag()
      const error = new Error('Creation failed')
      mockPrismaModel.create.mockRejectedValue(error)

      const result = await controller.createTags(createData)
      expect(result).toEqual(createErrorResponse('Creation failed'))
    })
  })

  describe('updateTags', () => {
    it('should update a tag', async () => {
      const id = '1'
      const updateData: Prisma.tagsUpdateInput = {
        name: faker.lorem.words(3),
        body: faker.lorem.words(3),
        locale: 'en',
        published_at: faker.date.recent().toString(),
      }
      const updatedTag = {
        id,
        ...updateData,
        user_id: faker.string.uuid(),
        created_at: new Date(),
        updated_at: new Date(),
      }

      mockPrismaModel.update.mockResolvedValue(updatedTag)

      const result = await controller.updateTags(id, updateData)

      expect(result).toEqual(createSuccessResponse(updatedTag))
      expect(mockPrismaModel.update).toHaveBeenCalledWith({
        where: { id },
        data: updateData,
      })
    })

    it('should handle update errors', async () => {
      const id = '1'
      const updateData: Prisma.tagsUpdateInput = {
        name: faker.lorem.words(3),
      }
      const error = new Error('Update failed')
      mockPrismaModel.update.mockRejectedValue(error)

      const result = await controller.updateTags(id, updateData)
      expect(result).toEqual(createErrorResponse('Update failed'))
    })
  })

  describe('removeTags', () => {
    it('should remove a tag', async () => {
      const id = '1'
      const deletedTag = {
        id,
        name: faker.lorem.words(3),
        user_id: faker.string.uuid(),
        created_at: new Date(),
        updated_at: new Date(),
      }

      mockPrismaModel.findUnique.mockResolvedValue(deletedTag)
      mockPrismaModel.delete.mockResolvedValue(deletedTag)

      const result = await controller.removeTags(id)

      expect(result).toEqual(createSuccessResponse(deletedTag))
      expect(mockPrismaModel.delete).toHaveBeenCalledWith({
        where: { id },
      })
    })

    it('should handle removal errors', async () => {
      const id = '1'
      mockPrismaModel.findUnique.mockResolvedValue(null)

      const result = await controller.removeTags(id)
      expect(result).toEqual(createErrorResponse('tags not found'))
    })
  })
})
