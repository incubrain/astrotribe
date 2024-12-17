import { describe, it, expect, beforeEach } from "vitest";
import { CategoryController } from "../controllers/categories.controller";
import { CategoriesService } from "../services/categories.service";
import { PrismaService } from "../../core/services/prisma.service";
import { PaginationService } from "../../core/services/pagination.service";
import { CustomLogger } from "../../core/logger/custom.logger";
import { faker } from "@faker-js/faker";
import {
  createTestModule,
  createBaseMockService,
  createSuccessResponse,
  createErrorResponse,
  createPaginatedResponse,
  mockControllerProperties,
  MockType,
} from "./utils/test.utils";
import { createSampleCategory } from "./utils/sample-data.utils";

describe("CategoryController", () => {
  let controller: CategoryController;
  let categoriesService: MockType<CategoriesService>;
  let prismaService: PrismaService;
  let logger: CustomLogger;
  let paginationService: PaginationService;
  let mockPrismaModel: any;

  beforeEach(async () => {
    const mockService = createBaseMockService();
    const module = await createTestModule({
      controller: CategoryController,
      serviceClass: CategoriesService,
      mockService,
      prismaModelName: "categories",
    });

    controller = module.get<CategoryController>(CategoryController);
    categoriesService = module.get(CategoriesService);
    prismaService = module.get<PrismaService>(PrismaService);
    logger = module.get<CustomLogger>(CustomLogger);
    paginationService = module.get<PaginationService>(PaginationService);
    mockPrismaModel = prismaService["categories"];

    mockControllerProperties(
      controller,
      mockPrismaModel,
      logger,
      categoriesService,
      paginationService,
      "categoriesService"
    );
  });

  describe("findAllCategories", () => {
    it("should return paginated categories", async () => {
      const categories = [createSampleCategory(), createSampleCategory()];
      const query = { page: 1, limit: 10 };

      mockPrismaModel.findMany.mockResolvedValue(categories);
      mockPrismaModel.count.mockResolvedValue(2);
      categoriesService.findAllCategories.mockResolvedValue(
        createPaginatedResponse(categories, 2)
      );

      const result = await controller.findAllCategories(query);

      expect(result).toEqual(createPaginatedResponse(categories, 2));
      expect(logger.log).toHaveBeenCalledWith("Fetching all categories");
      expect(logger.debug).toHaveBeenCalledWith("Found 2 categories");
    });

    it("should handle errors", async () => {
      const error = new Error("Database error");
      categoriesService.findAllCategories.mockRejectedValue(error);

      const result = await controller.findAllCategories({ page: 1, limit: 10 });
      expect(result).toEqual(createErrorResponse("Database error"));
      expect(logger.error).toHaveBeenCalledWith(
        "Failed to fetch categories",
        error.stack
      );
    });
  });

  describe("findOneCategories", () => {
    it("should return a single category", async () => {
      const category = createSampleCategory();
      const id = faker.string.uuid();

      mockPrismaModel.findUnique.mockResolvedValue(category);

      const result = await controller.findOneCategories(id);

      expect(result).toEqual(createSuccessResponse(category));
    });

    it("should handle errors", async () => {
      const id = faker.string.uuid();
      const error = new Error("Not found");
      mockPrismaModel.findUnique.mockRejectedValue(error);

      const result = await controller.findOneCategories(id);
      expect(result).toEqual(createErrorResponse("Not found"));
    });
  });

  describe("createCategories", () => {
    it("should create a category", async () => {
      const createData = createSampleCategory();
      const createdCategory = { id: faker.string.uuid(), ...createData };

      mockPrismaModel.create.mockResolvedValue(createdCategory);

      const result = await controller.createCategories(createData);

      expect(result).toEqual(createSuccessResponse(createdCategory));
    });

    it("should handle errors", async () => {
      const createData = createSampleCategory();
      const error = new Error("Creation failed");
      mockPrismaModel.create.mockRejectedValue(error);

      const result = await controller.createCategories(createData);
      expect(result).toEqual(createErrorResponse("Creation failed"));
    });
  });

  describe("updateCategories", () => {
    it("should update a category", async () => {
      const id = faker.string.uuid();
      const updateData = {
        name: faker.commerce.department(),
        updated_at: new Date(),
      };
      const updatedCategory = { id, ...updateData };

      mockPrismaModel.update.mockResolvedValue(updatedCategory);

      const result = await controller.updateCategories(id, updateData);

      expect(result).toEqual(createSuccessResponse(updatedCategory));
    });

    it("should handle errors", async () => {
      const id = faker.string.uuid();
      const updateData = {
        name: faker.commerce.department(),
      };
      const error = new Error("Update failed");
      mockPrismaModel.update.mockRejectedValue(error);

      const result = await controller.updateCategories(id, updateData);
      expect(result).toEqual(createErrorResponse("Update failed"));
    });
  });

  describe("removeCategories", () => {
    it("should remove a category", async () => {
      const id = faker.string.uuid();
      const deletedCategory = { id };

      mockPrismaModel.delete.mockResolvedValue(deletedCategory);

      const result = await controller.removeCategories(id);

      expect(result).toEqual(createSuccessResponse(deletedCategory));
    });

    it("should handle errors", async () => {
      const id = faker.string.uuid();
      const error = new Error("Delete failed");
      mockPrismaModel.delete.mockRejectedValue(error);

      const result = await controller.removeCategories(id);
      expect(result).toEqual(createErrorResponse("Delete failed"));
    });
  });
});
