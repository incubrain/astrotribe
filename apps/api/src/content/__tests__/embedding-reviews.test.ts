import { describe, it, expect, beforeEach } from "vitest";
import { EmbeddingReviewController } from "../controllers/embedding-reviews.controller";
import { EmbeddingReviewsService } from "../services/embedding-reviews.service";
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

const createSampleEmbeddingReview =
  (): Prisma.embedding_reviewsCreateInput => ({
    agent_review: faker.helpers.arrayElement([true, false, null]),
    human_review: faker.helpers.arrayElement([true, false, null]),
    notes: faker.helpers.arrayElement([faker.lorem.words(3), null]),
  });

describe("EmbeddingReview Module", () => {
  let controller: EmbeddingReviewController;
  let embeddingReviewsService: ReturnType<typeof createBaseMockService>;
  let prismaService: PrismaService;
  let logger: CustomLogger;
  let paginationService: PaginationService;
  let mockPrismaModel: any;

  beforeEach(async () => {
    const mockService = createBaseMockService();
    const module = await createTestModule({
      controller: EmbeddingReviewController,
      serviceClass: EmbeddingReviewsService,
      mockService,
      prismaModelName: "embedding_reviews",
    });

    controller = module.get<EmbeddingReviewController>(
      EmbeddingReviewController
    );
    embeddingReviewsService = module.get(EmbeddingReviewsService);
    prismaService = module.get<PrismaService>(PrismaService);
    logger = module.get<CustomLogger>(CustomLogger);
    paginationService = module.get<PaginationService>(PaginationService);
    mockPrismaModel = prismaService["embedding_reviews"];

    mockControllerProperties(
      controller,
      mockPrismaModel,
      logger,
      embeddingReviewsService,
      paginationService,
      "embeddingReviewsService"
    );
  });

  describe("findAllEmbeddingReviews", () => {
    it("should return paginated embedding reviews", async () => {
      const embeddingReviews = [
        { id: "1", ...createSampleEmbeddingReview() },
        { id: "2", ...createSampleEmbeddingReview() },
      ];
      const query = { page: 1, limit: 10 };

      mockPrismaModel.findMany.mockResolvedValue(embeddingReviews);
      mockPrismaModel.count.mockResolvedValue(2);

      const result = await controller.findAllEmbeddingReviews(query);

      expect(result).toEqual(createPaginatedResponse(embeddingReviews, 2));
      expect(mockPrismaModel.findMany).toHaveBeenCalled();
      expect(mockPrismaModel.count).toHaveBeenCalled();
    });

    it("should handle errors when fetching embedding reviews", async () => {
      const error = new Error("Database error");
      mockPrismaModel.findMany.mockRejectedValue(error);

      const result = await controller.findAllEmbeddingReviews({
        page: 1,
        limit: 10,
      });
      expect(result).toEqual(createErrorResponse("Database error"));
    });
  });

  describe("findOneEmbeddingReviews", () => {
    it("should return a single embedding review", async () => {
      const embeddingReview = { id: "1", ...createSampleEmbeddingReview() };
      mockPrismaModel.findUnique.mockResolvedValue(embeddingReview);

      const result = await controller.findOneEmbeddingReviews("1");

      expect(result).toEqual(createSuccessResponse(embeddingReview));
      expect(mockPrismaModel.findUnique).toHaveBeenCalledWith({
        where: { id: "1" },
      });
    });

    it("should handle not found error", async () => {
      mockPrismaModel.findUnique.mockResolvedValue(null);

      const result = await controller.findOneEmbeddingReviews("1");
      expect(result).toEqual(
        createErrorResponse("embedding_reviews not found")
      );
    });
  });

  describe("createEmbeddingReviews", () => {
    it("should create an embedding review", async () => {
      const createData = createSampleEmbeddingReview();
      const createdReview = {
        id: "1",
        ...createData,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockPrismaModel.create.mockResolvedValue(createdReview);

      const result = await controller.createEmbeddingReviews(createData);

      expect(result).toEqual(createSuccessResponse(createdReview));
      expect(mockPrismaModel.create).toHaveBeenCalledWith({
        data: createData,
      });
    });

    it("should handle creation errors", async () => {
      const createData = createSampleEmbeddingReview();
      const error = new Error("Creation failed");
      mockPrismaModel.create.mockRejectedValue(error);

      const result = await controller.createEmbeddingReviews(createData);
      expect(result).toEqual(createErrorResponse("Creation failed"));
    });
  });

  describe("updateEmbeddingReviews", () => {
    it("should update an embedding review", async () => {
      const id = "1";
      const updateData: Prisma.embedding_reviewsUpdateInput = {
        agent_review: true,
        notes: "Updated notes",
      };
      const updatedReview = {
        id,
        ...updateData,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockPrismaModel.update.mockResolvedValue(updatedReview);

      const result = await controller.updateEmbeddingReviews(id, updateData);

      expect(result).toEqual(createSuccessResponse(updatedReview));
      expect(mockPrismaModel.update).toHaveBeenCalledWith({
        where: { id },
        data: updateData,
      });
    });

    it("should handle update errors", async () => {
      const id = "1";
      const updateData: Prisma.embedding_reviewsUpdateInput = {
        agent_review: true,
      };
      const error = new Error("Update failed");
      mockPrismaModel.update.mockRejectedValue(error);

      const result = await controller.updateEmbeddingReviews(id, updateData);
      expect(result).toEqual(createErrorResponse("Update failed"));
    });
  });

  describe("removeEmbeddingReviews", () => {
    it("should remove an embedding review", async () => {
      const id = "1";
      const deletedReview = { id, ...createSampleEmbeddingReview() };

      mockPrismaModel.findUnique.mockResolvedValue(deletedReview);
      mockPrismaModel.delete.mockResolvedValue(deletedReview);

      const result = await controller.removeEmbeddingReviews(id);

      expect(result).toEqual(createSuccessResponse(deletedReview));
      expect(mockPrismaModel.delete).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it("should handle removal errors", async () => {
      const id = "1";
      mockPrismaModel.findUnique.mockResolvedValue(null);

      const result = await controller.removeEmbeddingReviews(id);
      expect(result).toEqual(
        createErrorResponse("embedding_reviews not found")
      );
    });
  });
});
