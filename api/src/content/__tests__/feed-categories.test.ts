import { describe, it, expect, beforeEach } from "vitest";
import { FeedCategoryController } from "../controllers/feed-categories.controller";
import { FeedCategoriesService } from "../services/feed-categories.service";
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

const createSampleFeedCategory = (): Prisma.feed_categoriesCreateInput => ({
  feeds: { connect: { id: faker.string.uuid() } },
  categories: { connect: { id: faker.number.int() } },
});

describe("FeedCategory Module", () => {
  let controller: FeedCategoryController;
  let feedCategoriesService: ReturnType<typeof createBaseMockService>;
  let prismaService: PrismaService;
  let logger: CustomLogger;
  let paginationService: PaginationService;
  let mockPrismaModel: any;

  beforeEach(async () => {
    const mockService = createBaseMockService();
    const module = await createTestModule({
      controller: FeedCategoryController,
      serviceClass: FeedCategoriesService,
      mockService,
      prismaModelName: "feed_categories",
    });

    controller = module.get<FeedCategoryController>(FeedCategoryController);
    feedCategoriesService = module.get(FeedCategoriesService);
    prismaService = module.get<PrismaService>(PrismaService);
    logger = module.get<CustomLogger>(CustomLogger);
    paginationService = module.get<PaginationService>(PaginationService);
    mockPrismaModel = prismaService["feed_categories"];

    mockControllerProperties(
      controller,
      mockPrismaModel,
      logger,
      feedCategoriesService,
      paginationService,
      "feedCategoriesService"
    );
  });

  describe("findAllFeedCategories", () => {
    it("should return paginated feed categories", async () => {
      const feedCategories = [
        { id: "1", ...createSampleFeedCategory() },
        { id: "2", ...createSampleFeedCategory() },
      ];
      const query = { page: 1, limit: 10 };

      mockPrismaModel.findMany.mockResolvedValue(feedCategories);
      mockPrismaModel.count.mockResolvedValue(2);

      const result = await controller.findAllFeedCategories(query);

      expect(result).toEqual(createPaginatedResponse(feedCategories, 2));
      expect(mockPrismaModel.findMany).toHaveBeenCalled();
      expect(mockPrismaModel.count).toHaveBeenCalled();
    });

    it("should handle errors when fetching feed categories", async () => {
      const error = new Error("Database error");
      mockPrismaModel.findMany.mockRejectedValue(error);

      const result = await controller.findAllFeedCategories({
        page: 1,
        limit: 10,
      });
      expect(result).toEqual(createErrorResponse("Database error"));
    });
  });

  describe("findOneFeedCategories", () => {
    it("should return a single feed category", async () => {
      const feedCategory = { id: "1", ...createSampleFeedCategory() };
      mockPrismaModel.findUnique.mockResolvedValue(feedCategory);

      const result = await controller.findOneFeedCategories("1");

      expect(result).toEqual(createSuccessResponse(feedCategory));
      expect(mockPrismaModel.findUnique).toHaveBeenCalledWith({
        where: { id: "1" },
      });
    });

    it("should handle not found error", async () => {
      mockPrismaModel.findUnique.mockResolvedValue(null);

      const result = await controller.findOneFeedCategories("1");
      expect(result).toEqual(createErrorResponse("feed_categories not found"));
    });
  });

  describe("createFeedCategories", () => {
    it("should create a feed category", async () => {
      const createData = createSampleFeedCategory();
      const createdCategory = {
        id: "1",
        feed_id: createData.feeds.connect!.id,
        category_id: createData.categories.connect!.id,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockPrismaModel.create.mockResolvedValue(createdCategory);

      const result = await controller.createFeedCategories(createData);

      expect(result).toEqual(createSuccessResponse(createdCategory));
      expect(mockPrismaModel.create).toHaveBeenCalledWith({
        data: createData,
      });
    });

    it("should handle creation errors", async () => {
      const createData = createSampleFeedCategory();
      const error = new Error("Creation failed");
      mockPrismaModel.create.mockRejectedValue(error);

      const result = await controller.createFeedCategories(createData);
      expect(result).toEqual(createErrorResponse("Creation failed"));
    });
  });

  describe("updateFeedCategories", () => {
    it("should update a feed category", async () => {
      const id = "1";
      const updateData: Prisma.feed_categoriesUpdateInput = {
        feeds: { connect: { id: faker.string.uuid() } },
      };
      const updatedCategory = {
        id,
        feed_id: updateData.feeds?.connect?.id,
        category_id: faker.string.uuid(),
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockPrismaModel.update.mockResolvedValue(updatedCategory);

      const result = await controller.updateFeedCategories(id, updateData);

      expect(result).toEqual(createSuccessResponse(updatedCategory));
      expect(mockPrismaModel.update).toHaveBeenCalledWith({
        where: { id },
        data: updateData,
      });
    });

    it("should handle update errors", async () => {
      const id = "1";
      const updateData: Prisma.feed_categoriesUpdateInput = {
        feeds: { connect: { id: faker.string.uuid() } },
      };
      const error = new Error("Update failed");
      mockPrismaModel.update.mockRejectedValue(error);

      const result = await controller.updateFeedCategories(id, updateData);
      expect(result).toEqual(createErrorResponse("Update failed"));
    });
  });

  describe("removeFeedCategories", () => {
    it("should remove a feed category", async () => {
      const id = "1";
      const deletedCategory = {
        id,
        feed_id: faker.string.uuid(),
        category_id: faker.string.uuid(),
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockPrismaModel.findUnique.mockResolvedValue(deletedCategory);
      mockPrismaModel.delete.mockResolvedValue(deletedCategory);

      const result = await controller.removeFeedCategories(id);

      expect(result).toEqual(createSuccessResponse(deletedCategory));
      expect(mockPrismaModel.delete).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it("should handle removal errors", async () => {
      const id = "1";
      mockPrismaModel.findUnique.mockResolvedValue(null);

      const result = await controller.removeFeedCategories(id);
      expect(result).toEqual(createErrorResponse("feed_categories not found"));
    });
  });
});
