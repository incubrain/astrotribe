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
import { PrismaService } from "@core/services/prisma.service";
import { ConfigService } from "@core/services/config.service";
import { PaginationService } from "@core/services/pagination.service";
import {
  PaginatedResponse,
  PaginatedQuery,
} from "@core/types/pagination.types";
import { ContentStatusesService } from "../services/content-statuses.service";
import { CustomLogger } from "@core/logger/custom.logger";

@Controller("content-statuses")
@ApiTags("ContentStatuses")
export class ContentStatusController extends BaseController {
  constructor(
    protected readonly contentStatusesService: ContentStatusesService,
    prisma: PrismaService,
    config: ConfigService,
    paginationService: PaginationService,
    logger: CustomLogger
  ) {
    super(prisma, "content_statuses", config, paginationService, logger);
  }

  @Get()
  @ApiOperation({ summary: "Get all ContentStatuses" })
  async findAllContentStatuses(
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
  @ApiOperation({ summary: "Get ContentStatuses by id" })
  async findOneContentStatuses(
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
  @ApiOperation({ summary: "Create ContentStatuses" })
  async createContentStatuses(
    @Body() data: Prisma.content_statusesCreateInput
  ) {
    try {
      return await super.create(data);
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Put(":id")
  @ApiOperation({ summary: "Update ContentStatuses" })
  async updateContentStatuses(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() data: Prisma.content_statusesUpdateInput
  ) {
    try {
      return await super.update(id, data);
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete ContentStatuses" })
  async removeContentStatuses(@Param("id", ParseUUIDPipe) id: string) {
    try {
      return await super.remove(id);
    } catch (error) {
      return this.handleError(error);
    }
  }
}
