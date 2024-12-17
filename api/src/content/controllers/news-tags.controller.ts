// controller.ejs template
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { BaseController } from "../../core/base/base.controller";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../core/services/prisma.service";
import { ConfigService } from "../../core/services/config.service";
import { PaginationService } from "../../core/services/pagination.service";
import {
  PaginatedResponse,
  PaginatedQuery,
} from "../../core/types/pagination.types";
import { NewsTagsService } from "../services/news-tags.service";
import { CustomLogger } from "../../core/logger/custom.logger";

@Controller("news-tags")
@ApiTags("NewsTags")
export class NewsTagController extends BaseController {
  constructor(
    protected readonly newsTagsService: NewsTagsService,
    prisma: PrismaService,
    config: ConfigService,
    paginationService: PaginationService,
    logger: CustomLogger
  ) {
    super(prisma, "news_tags", config, paginationService, logger);
  }

  @Get()
  @ApiOperation({ summary: "Get all NewsTags" })
  async findAllNewsTags(
    @Query() query: PaginatedQuery
  ): Promise<
    | PaginatedResponse<unknown>
    | { success: boolean; error: any; timestamp: string; code: any }
  > {
    try {
      return await super.findAll(query);
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Get(":id")
  @ApiOperation({ summary: "Get NewsTags by id" })
  async findOneNewsTags(
    @Param("id", ParseUUIDPipe) id: string,
    @Query("include") include?: string[]
  ) {
    try {
      return await super.findOne(id, include);
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Post()
  @ApiOperation({ summary: "Create NewsTags" })
  async createNewsTags(@Body() data: Prisma.news_tagsCreateInput) {
    try {
      return await super.create(data);
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Put(":id")
  @ApiOperation({ summary: "Update NewsTags" })
  async updateNewsTags(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() data: Prisma.news_tagsUpdateInput
  ) {
    try {
      return await super.update(id, data);
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete NewsTags" })
  async removeNewsTags(@Param("id", ParseUUIDPipe) id: string) {
    try {
      return await super.remove(id);
    } catch (error) {
      return this.handleError(error);
    }
  }
}
