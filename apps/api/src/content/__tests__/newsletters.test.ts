import { describe, it, expect, beforeEach } from 'vitest'
import { PrismaService } from '@core/services/prisma.service'
import { PaginationService } from '@core/services/pagination.service'
import { CustomLogger } from '@core/logger/custom.logger'
import { faker } from '@faker-js/faker'
import type { Prisma } from '@prisma/client'
import { NewslettersService } from '../services/newsletters.service'
import { NewsletterController } from '../controllers/newsletters.controller'
import {
  createTestModule,
  createBaseMockService,
  createSuccessResponse,
  createErrorResponse,
  createPaginatedResponse,
  mockControllerProperties,
} from './utils/test.utils'

const createSampleNewsletter = (): Prisma.newslettersCreateInput => ({
  created_at: faker.date.recent(),
  title: faker.helpers.arrayElement([faker.lorem.words(3), null]),
  frequency: faker.helpers.arrayElement(['daily', 'weekly', 'monthly', null]),
  start_date: faker.date.recent(),
  end_date: faker.date.recent(),
  generated_content: faker.helpers.arrayElement([faker.lorem.words(3), null]),
  content_status: faker.helpers.arrayElement(['draft', 'published', 'archived', null]),
  contents: { connect: { id: faker.string.uuid() } },
})

describe('Newsletter Module', () => {
  let controller: NewsletterController
  let newslettersService: ReturnType<typeof createBaseMockService>
  let prismaService: PrismaService
  let logger: CustomLogger
  let paginationService: PaginationService
  let mockPrismaModel: any

  beforeEach(async () => {
    const mockService = createBaseMockService()
    const module = await createTestModule({
      controller: NewsletterController,
      serviceClass: NewslettersService,
      mockService,
      prismaModelName: 'newsletters',
    })

    controller = module.get<NewsletterController>(NewsletterController)
    newslettersService = module.get(NewslettersService)
    prismaService = module.get<PrismaService>(PrismaService)
    logger = module.get<CustomLogger>(CustomLogger)
    paginationService = module.get<PaginationService>(PaginationService)
    mockPrismaModel = prismaService['newsletters']

    mockControllerProperties(
      controller,
      mockPrismaModel,
      logger,
      newslettersService,
      paginationService,
      'newslettersService',
    )
  })

  describe('findAllNewsletters', () => {
    it('should return paginated newsletters', async () => {
      const newsletters = [
        { id: '1', ...createSampleNewsletter() },
        { id: '2', ...createSampleNewsletter() },
      ]
      const query = { page: 1, limit: 10 }

      mockPrismaModel.findMany.mockResolvedValue(newsletters)
      mockPrismaModel.count.mockResolvedValue(2)

      const result = await controller.findAllNewsletters(query)

      expect(result).toEqual(createPaginatedResponse(newsletters, 2))
      expect(mockPrismaModel.findMany).toHaveBeenCalled()
      expect(mockPrismaModel.count).toHaveBeenCalled()
    })

    it('should handle errors when fetching newsletters', async () => {
      const error = new Error('Database error')
      mockPrismaModel.findMany.mockRejectedValue(error)

      const result = await controller.findAllNewsletters({
        page: 1,
        limit: 10,
      })
      expect(result).toEqual(createErrorResponse('Database error'))
    })

    it('should handle filters and sorting', async () => {
      const newsletters = [
        { id: '1', ...createSampleNewsletter() },
        { id: '2', ...createSampleNewsletter() },
      ]
      const query = {
        page: 1,
        limit: 10,
        sortBy: 'created_at',
        sortOrder: 'desc' as const,
        content_status: 'published',
      }

      mockPrismaModel.findMany.mockResolvedValue(newsletters)
      mockPrismaModel.count.mockResolvedValue(2)

      const result = await controller.findAllNewsletters(query)

      expect(result).toEqual(createPaginatedResponse(newsletters, 2))
      expect(mockPrismaModel.findMany).toHaveBeenCalled()
      expect(mockPrismaModel.count).toHaveBeenCalled()
    })
  })

  describe('findOneNewsletters', () => {
    it('should return a single newsletter', async () => {
      const newsletter = { id: '1', ...createSampleNewsletter() }
      mockPrismaModel.findUnique.mockResolvedValue(newsletter)

      const result = await controller.findOneNewsletters('1')

      expect(result).toEqual(createSuccessResponse(newsletter))
      expect(mockPrismaModel.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      })
    })

    it('should handle not found error', async () => {
      mockPrismaModel.findUnique.mockResolvedValue(null)

      const result = await controller.findOneNewsletters('1')
      expect(result).toEqual(createErrorResponse('newsletters not found'))
    })
  })

  describe('createNewsletters', () => {
    it('should create a newsletter', async () => {
      const createData = createSampleNewsletter()
      const createdNewsletter = {
        id: '1',
        ...createData,
        created_at: new Date(),
        updated_at: new Date(),
      }

      mockPrismaModel.create.mockResolvedValue(createdNewsletter)

      const result = await controller.createNewsletters(createData)

      expect(result).toEqual(createSuccessResponse(createdNewsletter))
      expect(mockPrismaModel.create).toHaveBeenCalledWith({
        data: createData,
      })
    })

    it('should handle creation errors', async () => {
      const createData = createSampleNewsletter()
      const error = new Error('Creation failed')
      mockPrismaModel.create.mockRejectedValue(error)

      const result = await controller.createNewsletters(createData)
      expect(result).toEqual(createErrorResponse('Creation failed'))
    })
  })

  describe('updateNewsletters', () => {
    it('should update a newsletter', async () => {
      const id = '1'
      const updateData: Prisma.newslettersUpdateInput = {
        title: faker.lorem.words(3),
        content_status: 'published',
        frequency: 'weekly',
      }
      const updatedNewsletter = {
        id,
        ...updateData,
        created_at: new Date(),
        updated_at: new Date(),
      }

      mockPrismaModel.update.mockResolvedValue(updatedNewsletter)

      const result = await controller.updateNewsletters(id, updateData)

      expect(result).toEqual(createSuccessResponse(updatedNewsletter))
      expect(mockPrismaModel.update).toHaveBeenCalledWith({
        where: { id },
        data: updateData,
      })
    })

    it('should handle update errors', async () => {
      const id = '1'
      const updateData: Prisma.newslettersUpdateInput = {
        title: faker.lorem.words(3),
      }
      const error = new Error('Update failed')
      mockPrismaModel.update.mockRejectedValue(error)

      const result = await controller.updateNewsletters(id, updateData)
      expect(result).toEqual(createErrorResponse('Update failed'))
    })
  })

  describe('removeNewsletters', () => {
    it('should remove a newsletter', async () => {
      const id = '1'
      const deletedNewsletter = {
        id,
        title: faker.lorem.words(3),
        user_id: faker.string.uuid(),
        created_at: new Date(),
        updated_at: new Date(),
      }

      mockPrismaModel.findUnique.mockResolvedValue(deletedNewsletter)
      mockPrismaModel.delete.mockResolvedValue(deletedNewsletter)

      const result = await controller.removeNewsletters(id)

      expect(result).toEqual(createSuccessResponse(deletedNewsletter))
      expect(mockPrismaModel.delete).toHaveBeenCalledWith({
        where: { id },
      })
    })

    it('should handle removal errors', async () => {
      const id = '1'
      mockPrismaModel.findUnique.mockResolvedValue(null)

      const result = await controller.removeNewsletters(id)
      expect(result).toEqual(createErrorResponse('newsletters not found'))
    })
  })
})
