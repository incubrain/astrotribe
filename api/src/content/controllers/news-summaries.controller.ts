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
import { NewsSummariesService } from "../services/news-summaries.service";
import { CustomLogger } from "../../core/logger/custom.logger";

@Controller("news-summaries")
@ApiTags("NewsSummaries")
export class NewsSummaryController extends BaseController {
  constructor(
    protected readonly newsSummariesService: NewsSummariesService,
    prisma: PrismaService,
    config: ConfigService,
    paginationService: PaginationService,
    logger: CustomLogger
  ) {
    super(prisma, "news_summaries", config, paginationService, logger);
  }

  @Get()
  @ApiOperation({ summary: "Get all NewsSummaries" })
  async findAllNewsSummaries(
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
  @ApiOperation({ summary: "Get NewsSummaries by id" })
  async findOneNewsSummaries(
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
  @ApiOperation({ summary: "Create NewsSummaries" })
  async createNewsSummaries(@Body() data: Prisma.news_summariesCreateInput) {
    try {
      return await super.create(data);
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Put(":id")
  @ApiOperation({ summary: "Update NewsSummaries" })
  async updateNewsSummaries(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() data: Prisma.news_summariesUpdateInput
  ) {
    try {
      return await super.update(id, data);
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete NewsSummaries" })
  async removeNewsSummaries(@Param("id", ParseUUIDPipe) id: string) {
    try {
      return await super.remove(id);
    } catch (error) {
      return this.handleError(error);
    }
  }
}
