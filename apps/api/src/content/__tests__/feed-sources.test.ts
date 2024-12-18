import { describe, it, expect, beforeEach } from "vitest";
import { FeedSourceController } from "../controllers/feed-sources.controller";
import { FeedSourceService } from "../services/feed-sources.service";
import { PrismaService } from "@core/services/prisma.service";
import { PaginationService } from "@core/services/pagination.service";
import { CustomLogger } from "@core/logger/custom.logger";
import { faker } from "@faker-js/faker";
import { Prisma } from "@prisma/client";
import {
  createTestModule,
  createBaseMockService,
  createSuccessResponse,
  createErrorResponse,
  createPaginatedResponse,
  mockControllerProperties,
  MockType,
} from "./utils/test.utils";
import { NotFoundException, InternalServerErrorException } from "@nestjs/common";

const createSampleFeedSource = (): Prisma.feed_sourcesCreateInput => ({
  feeds: { connect: { id: faker.string.uuid() } },
  content_sources: { connect: { id: faker.number.int() } },
});

describe("FeedSourceController", () => {
  let controller: FeedSourceController;
  let feedSourceService: MockType<FeedSourceService>;
  let prismaService: PrismaService;
  let logger: CustomLogger;
  let paginationService: PaginationService;
  let mockPrismaModel: any;

  beforeEach(async () => {
    const mockService = createBaseMockService();
    const module = await createTestModule({
      controller: FeedSourceController,
      serviceClass: FeedSourceService,
      mockService,
      prismaModelName: "feed_sources",
    });

    controller = module.get<FeedSourceController>(FeedSourceController);
    feedSourceService = module.get(FeedSourceService);
    prismaService = module.get<PrismaService>(PrismaService);
    logger = module.get<CustomLogger>(CustomLogger);
    paginationService = module.get<PaginationService>(PaginationService);
    mockPrismaModel = prismaService["feed_sources"];

    mockControllerProperties(
      controller,
      mockPrismaModel,
      logger,
      feedSourceService,
      paginationService,
      "feedSourceService"
    );
  });

  describe("findAllFeedSources", () => {
    it("should return paginated feed sources", async () => {
      const feedSources = [createSampleFeedSource(), createSampleFeedSource()];
      const query = { page: 1, limit: 10 };

      mockPrismaModel.findMany.mockResolvedValue(feedSources);
      mockPrismaModel.count.mockResolvedValue(2);

      const result = await controller.findAllFeedSources(query);

      expect(result).toEqual(createPaginatedResponse(feedSources, 2));
    });

    it("should handle errors", async () => {
      mockPrismaModel.findMany.mockRejectedValue(new Error("Database error"));

      await expect(controller.findAllFeedSources({ page: 1, limit: 10 })).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });

  describe("findOneFeedSources", () => {
    it("should return a single feed source", async () => {
      const feedSource = createSampleFeedSource();
      const id = faker.string.uuid();

      mockPrismaModel.findUnique.mockResolvedValue(feedSource);

      const result = await controller.findOneFeedSources(id);

      expect(result).toEqual(createSuccessResponse(feedSource));
    });

    it("should handle errors", async () => {
      const id = faker.string.uuid();
      mockPrismaModel.findUnique.mockResolvedValue(null);

      await expect(controller.findOneFeedSources(id)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe("createFeedSources", () => {
    it("should create a feed source", async () => {
      const createData = createSampleFeedSource();
      const createdFeedSource = { id: faker.string.uuid(), ...createData };

      mockPrismaModel.create.mockResolvedValue(createdFeedSource);

      const result = await controller.createFeedSources(createData);

      expect(result).toEqual(createSuccessResponse(createdFeedSource));
    });

    it("should handle errors", async () => {
      const createData = createSampleFeedSource();
      mockPrismaModel.create.mockRejectedValue(new Error("Creation failed"));

      await expect(controller.createFeedSources(createData)).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });

  describe("updateFeedSources", () => {
    it("should update a feed source", async () => {
      const id = faker.string.uuid();
      const updateData = createSampleFeedSource();
      const updatedFeedSource = { id, ...updateData };

      mockPrismaModel.update.mockResolvedValue(updatedFeedSource);

      const result = await controller.updateFeedSources(id, updateData);

      expect(result).toEqual(createSuccessResponse(updatedFeedSource));
    });

    it("should handle errors", async () => {
      const id = faker.string.uuid();
      const updateData = createSampleFeedSource();
      mockPrismaModel.update.mockRejectedValue(new Error("Update failed"));

      await expect(controller.updateFeedSources(id, updateData)).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });

  describe("removeFeedSources", () => {
    it("should remove a feed source", async () => {
      const id = faker.string.uuid();
      const deletedFeedSource = { id };

      mockPrismaModel.findUnique.mockResolvedValue(deletedFeedSource);
      mockPrismaModel.delete.mockResolvedValue(deletedFeedSource);

      const result = await controller.removeFeedSources(id);

      expect(result).toEqual(createSuccessResponse(deletedFeedSource));
    });

    it("should handle errors", async () => {
      const id = faker.string.uuid();
      mockPrismaModel.findUnique.mockResolvedValue(null);

      await expect(controller.removeFeedSources(id)).rejects.toThrow(
        NotFoundException
      );
    });
  });
});
