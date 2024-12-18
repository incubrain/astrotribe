import { describe, it, expect, beforeEach } from "vitest";
import { NewsSummaryController } from "../controllers/news-summaries.controller";
import { NewsSummariesService } from "../services/news-summaries.service";
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
} from "./utils/test.utils";

const createSampleNewsSummary = (): Prisma.news_summariesCreateInput => ({
  news: { connect: { id: faker.string.uuid() } },
  summary: faker.helpers.arrayElement([faker.lorem.words(3), null]),
  complexity_level: faker.helpers.arrayElement([faker.lorem.words(3), null]),
  version: faker.number.int(),
  is_current: faker.helpers.arrayElement([true, false, null]),
});

describe("NewsSummary Module", () => {
  let controller: NewsSummaryController;
  let newsSummariesService: ReturnType<typeof createBaseMockService>;
  let prismaService: PrismaService;
  let logger: CustomLogger;
  let paginationService: PaginationService;
  let mockPrismaModel: any;

  beforeEach(async () => {
    const mockService = createBaseMockService();
    const module = await createTestModule({
      controller: NewsSummaryController,
      serviceClass: NewsSummariesService,
      mockService,
      prismaModelName: "news_summaries",
    });

    controller = module.get<NewsSummaryController>(NewsSummaryController);
    newsSummariesService = module.get(NewsSummariesService);
    prismaService = module.get<PrismaService>(PrismaService);
    logger = module.get<CustomLogger>(CustomLogger);
    paginationService = module.get<PaginationService>(PaginationService);
    mockPrismaModel = prismaService["news_summaries"];

    mockControllerProperties(
      controller,
      mockPrismaModel,
      logger,
      newsSummariesService,
      paginationService,
      "newsSummariesService"
    );
  });

  describe("findAllNewsSummaries", () => {
    it("should return paginated news summaries", async () => {
      const newsSummaries = [
        { id: "1", ...createSampleNewsSummary() },
        { id: "2", ...createSampleNewsSummary() },
      ];
      const query = { page: 1, limit: 10 };

      mockPrismaModel.findMany.mockResolvedValue(newsSummaries);
      mockPrismaModel.count.mockResolvedValue(2);

      const result = await controller.findAllNewsSummaries(query);

      expect(result).toEqual(createPaginatedResponse(newsSummaries, 2));
      expect(mockPrismaModel.findMany).toHaveBeenCalled();
      expect(mockPrismaModel.count).toHaveBeenCalled();
    });

    it("should handle errors when fetching news summaries", async () => {
      const error = new Error("Database error");
      mockPrismaModel.findMany.mockRejectedValue(error);

      const result = await controller.findAllNewsSummaries({
        page: 1,
        limit: 10,
      });
      expect(result).toEqual(createErrorResponse("Database error"));
    });

    it("should handle filters and sorting", async () => {
      const newsSummaries = [
        { id: "1", ...createSampleNewsSummary() },
        { id: "2", ...createSampleNewsSummary() },
      ];
      const query = {
        page: 1,
        limit: 10,
        sortBy: "created_at",
        sortOrder: "desc" as const,
        complexity_level: "high",
      };

      mockPrismaModel.findMany.mockResolvedValue(newsSummaries);
      mockPrismaModel.count.mockResolvedValue(2);

      const result = await controller.findAllNewsSummaries(query);

      expect(result).toEqual(createPaginatedResponse(newsSummaries, 2));
      expect(mockPrismaModel.findMany).toHaveBeenCalled();
      expect(mockPrismaModel.count).toHaveBeenCalled();
    });
  });

  describe("findOneNewsSummaries", () => {
    it("should return a single news summary", async () => {
      const newsSummary = { id: "1", ...createSampleNewsSummary() };
      mockPrismaModel.findUnique.mockResolvedValue(newsSummary);

      const result = await controller.findOneNewsSummaries("1");

      expect(result).toEqual(createSuccessResponse(newsSummary));
      expect(mockPrismaModel.findUnique).toHaveBeenCalledWith({
        where: { id: "1" },
      });
    });

    it("should handle not found error", async () => {
      mockPrismaModel.findUnique.mockResolvedValue(null);

      const result = await controller.findOneNewsSummaries("1");
      expect(result).toEqual(createErrorResponse("news_summaries not found"));
    });
  });

  describe("createNewsSummaries", () => {
    it("should create a news summary", async () => {
      const createData = createSampleNewsSummary();
      const createdSummary = {
        id: "1",
        news_id: createData.news.connect!.id,
        summary: createData.summary,
        // embedding: createData.embedding,
        complexity_level: createData.complexity_level,
        version: createData.version,
        is_current: createData.is_current,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockPrismaModel.create.mockResolvedValue(createdSummary);

      const result = await controller.createNewsSummaries(createData);

      expect(result).toEqual(createSuccessResponse(createdSummary));
      expect(mockPrismaModel.create).toHaveBeenCalledWith({
        data: createData,
      });
    });

    it("should handle creation errors", async () => {
      const createData = createSampleNewsSummary();
      const error = new Error("Creation failed");
      mockPrismaModel.create.mockRejectedValue(error);

      const result = await controller.createNewsSummaries(createData);
      expect(result).toEqual(createErrorResponse("Creation failed"));
    });
  });

  describe("updateNewsSummaries", () => {
    it("should update a news summary", async () => {
      const id = "1";
      const updateData: Prisma.news_summariesUpdateInput = {
        summary: faker.lorem.words(3),
        complexity_level: "high",
        version: faker.number.int(),
        is_current: true,
      };
      const updatedSummary = {
        id,
        ...updateData,
        news_id: faker.string.uuid(),
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockPrismaModel.update.mockResolvedValue(updatedSummary);

      const result = await controller.updateNewsSummaries(id, updateData);

      expect(result).toEqual(createSuccessResponse(updatedSummary));
      expect(mockPrismaModel.update).toHaveBeenCalledWith({
        where: { id },
        data: updateData,
      });
    });

    it("should handle update errors", async () => {
      const id = "1";
      const updateData: Prisma.news_summariesUpdateInput = {
        summary: faker.lorem.words(3),
      };
      const error = new Error("Update failed");
      mockPrismaModel.update.mockRejectedValue(error);

      const result = await controller.updateNewsSummaries(id, updateData);
      expect(result).toEqual(createErrorResponse("Update failed"));
    });
  });

  describe("removeNewsSummaries", () => {
    it("should remove a news summary", async () => {
      const id = "1";
      const deletedSummary = {
        id,
        news_id: faker.string.uuid(),
        summary: faker.lorem.words(3),
        complexity_level: "high",
        version: faker.number.int(),
        is_current: true,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockPrismaModel.findUnique.mockResolvedValue(deletedSummary);
      mockPrismaModel.delete.mockResolvedValue(deletedSummary);

      const result = await controller.removeNewsSummaries(id);

      expect(result).toEqual(createSuccessResponse(deletedSummary));
      expect(mockPrismaModel.delete).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it("should handle removal errors", async () => {
      const id = "1";
      mockPrismaModel.findUnique.mockResolvedValue(null);

      const result = await controller.removeNewsSummaries(id);
      expect(result).toEqual(createErrorResponse("news_summaries not found"));
    });
  });
});
