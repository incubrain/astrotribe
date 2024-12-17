import { describe, it, expect, beforeEach } from "vitest";
import { NewsController } from "../controllers/news.controller";
import { NewsService } from "../services/news.service";
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

const createSampleNews = (): Prisma.newsCreateInput => ({
  title: faker.helpers.arrayElement([faker.lorem.words(3), null]),
  body: faker.helpers.arrayElement([faker.lorem.words(3), null]),
  author: faker.helpers.arrayElement([faker.lorem.words(3), null]),
  description: faker.helpers.arrayElement([faker.lorem.words(3), null]),
  featured_image: faker.helpers.arrayElement([faker.lorem.words(3), null]),
  has_summary: faker.datatype.boolean(),
  published_at: faker.helpers.arrayElement([faker.date.recent(), null]),
  url: faker.internet.url(),
  hash: faker.number.bigInt(),
  failed_count: faker.helpers.arrayElement([
    faker.number.int({ min: 0, max: 10 }),
    null,
  ]),
  scrape_frequency: faker.helpers.arrayElement([
    "daily",
    "weekly",
    "monthly",
    null,
  ]),
  scraped_at: faker.helpers.arrayElement([faker.date.recent(), null]),
  content_status: faker.helpers.arrayElement([
    "draft",
    "published",
    "archived",
    null,
  ]),
  keywords: faker.helpers.arrayElement([faker.lorem.words(5).split(" "), null]),
  score: faker.helpers.arrayElement([
    faker.number.int({ min: 0, max: 100 }),
    null,
  ]),
  companies: { connect: { id: faker.string.uuid() } },
  contents: { connect: { id: faker.string.uuid() } },
});

describe("News Module", () => {
  let controller: NewsController;
  let newsService: ReturnType<typeof createBaseMockService>;
  let prismaService: PrismaService;
  let logger: CustomLogger;
  let paginationService: PaginationService;
  let mockPrismaModel: any;

  beforeEach(async () => {
    const mockService = createBaseMockService();
    const module = await createTestModule({
      controller: NewsController,
      serviceClass: NewsService,
      mockService,
      prismaModelName: "news",
    });

    controller = module.get<NewsController>(NewsController);
    newsService = module.get(NewsService);
    prismaService = module.get<PrismaService>(PrismaService);
    logger = module.get<CustomLogger>(CustomLogger);
    paginationService = module.get<PaginationService>(PaginationService);
    mockPrismaModel = prismaService["news"];

    mockControllerProperties(
      controller,
      mockPrismaModel,
      logger,
      newsService,
      paginationService,
      "newsService"
    );
  });

  describe("findAllNews", () => {
    it("should return paginated news", async () => {
      const news = [
        { id: "1", ...createSampleNews() },
        { id: "2", ...createSampleNews() },
      ];
      const query = { page: 1, limit: 10 };

      mockPrismaModel.findMany.mockResolvedValue(news);
      mockPrismaModel.count.mockResolvedValue(2);

      const result = await controller.findAllNews(query);

      expect(result).toEqual(createPaginatedResponse(news, 2));
      expect(mockPrismaModel.findMany).toHaveBeenCalled();
      expect(mockPrismaModel.count).toHaveBeenCalled();
    });

    it("should handle errors when fetching news", async () => {
      const error = new Error("Database error");
      mockPrismaModel.findMany.mockRejectedValue(error);

      const result = await controller.findAllNews({ page: 1, limit: 10 });
      expect(result).toEqual(createErrorResponse("Database error"));
    });

    it("should handle filters and sorting", async () => {
      const news = [
        { id: "1", ...createSampleNews() },
        { id: "2", ...createSampleNews() },
      ];
      const query = {
        page: 1,
        limit: 10,
        sortBy: "created_at",
        sortOrder: "desc" as const,
        content_status: "published",
      };

      mockPrismaModel.findMany.mockResolvedValue(news);
      mockPrismaModel.count.mockResolvedValue(2);

      const result = await controller.findAllNews(query);

      expect(result).toEqual(createPaginatedResponse(news, 2));
      expect(mockPrismaModel.findMany).toHaveBeenCalled();
      expect(mockPrismaModel.count).toHaveBeenCalled();
    });
  });

  describe("findOneNews", () => {
    it("should return a single news item", async () => {
      const news = { id: "1", ...createSampleNews() };
      mockPrismaModel.findUnique.mockResolvedValue(news);

      const result = await controller.findOneNews("1");

      expect(result).toEqual(createSuccessResponse(news));
      expect(mockPrismaModel.findUnique).toHaveBeenCalledWith({
        where: { id: "1" },
      });
    });

    it("should handle not found error", async () => {
      mockPrismaModel.findUnique.mockResolvedValue(null);

      const result = await controller.findOneNews("1");
      expect(result).toEqual(createErrorResponse("news not found"));
    });
  });

  describe("createNews", () => {
    it("should create a news item", async () => {
      const createData = createSampleNews();
      const createdNews = {
        id: "1",
        ...createData,
        company_id: createData.companies.connect!.id,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockPrismaModel.create.mockResolvedValue(createdNews);

      const result = await controller.createNews(createData);

      expect(result).toEqual(createSuccessResponse(createdNews));
      expect(mockPrismaModel.create).toHaveBeenCalledWith({
        data: createData,
      });
    });

    it("should handle creation errors", async () => {
      const createData = createSampleNews();
      const error = new Error("Creation failed");
      mockPrismaModel.create.mockRejectedValue(error);

      const result = await controller.createNews(createData);
      expect(result).toEqual(createErrorResponse("Creation failed"));
    });
  });

  describe("updateNews", () => {
    it("should update a news item", async () => {
      const id = "1";
      const updateData: Prisma.newsUpdateInput = {
        title: faker.lorem.words(3),
        content_status: "published",
        score: faker.number.int({ min: 0, max: 100 }),
        companies: { connect: { id: faker.string.uuid() } },
      };
      const updatedNews = {
        id,
        ...updateData,
        company_id: updateData.companies?.connect?.id,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockPrismaModel.update.mockResolvedValue(updatedNews);

      const result = await controller.updateNews(id, updateData);

      expect(result).toEqual(createSuccessResponse(updatedNews));
      expect(mockPrismaModel.update).toHaveBeenCalledWith({
        where: { id },
        data: updateData,
      });
    });

    it("should handle update errors", async () => {
      const id = "1";
      const updateData: Prisma.newsUpdateInput = {
        title: faker.lorem.words(3),
      };
      const error = new Error("Update failed");
      mockPrismaModel.update.mockRejectedValue(error);

      const result = await controller.updateNews(id, updateData);
      expect(result).toEqual(createErrorResponse("Update failed"));
    });
  });

  describe("removeNews", () => {
    it("should remove a news item", async () => {
      const id = "1";
      const deletedNews = {
        id,
        title: faker.lorem.words(3),
        company_id: faker.string.uuid(),
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockPrismaModel.findUnique.mockResolvedValue(deletedNews);
      mockPrismaModel.delete.mockResolvedValue(deletedNews);

      const result = await controller.removeNews(id);

      expect(result).toEqual(createSuccessResponse(deletedNews));
      expect(mockPrismaModel.delete).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it("should handle removal errors", async () => {
      const id = "1";
      mockPrismaModel.findUnique.mockResolvedValue(null);

      const result = await controller.removeNews(id);
      expect(result).toEqual(createErrorResponse("news not found"));
    });
  });
});
