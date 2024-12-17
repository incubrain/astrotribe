// base.controller.ts
import { Injectable, UnauthorizedException, NotFoundException, HttpException, InternalServerErrorException, BadRequestException, ConflictException } from "@nestjs/common";
import { Request } from "express";
import { verify } from "jsonwebtoken";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../services/prisma.service";
import { ConfigService } from "../services/config.service";
import { PaginatedResponse, PaginatedQuery } from "../types/pagination.types";
import { PaginationService } from "../services/pagination.service";
import { CustomLogger } from "../logger/custom.logger";

@Injectable()
export abstract class BaseController {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly modelName: keyof Prisma.TypeMap["model"],
    protected readonly config: ConfigService,
    protected readonly paginationService: PaginationService,
    protected readonly logger: CustomLogger
  ) {}

  protected get model(): any {
    return this.prisma[this.modelName];
  }

  async findAll(query: PaginatedQuery) {
    try {
      const { page = 1, limit = 10, include, ...filters } = query;
      const includes = include?.reduce(
        (acc, rel) => ({ ...acc, [rel]: true }),
        {}
      );

      const [data, total] = await Promise.all([
        this.model.findMany({
          where: filters,
          include: includes,
          skip: (Number(page) - 1) * Number(limit),
          take: limit,
        }),
        this.model.count({ where: filters }),
      ]);

      return this.handlePaginatedSuccess(
        data,
        this.paginationService.getPaginationMeta(total, query)
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async findOne(id: string, include?: string[]) {
    try {
      const includes = include?.reduce(
        (acc, rel) => ({ ...acc, [rel]: true }),
        {}
      );
      const data = await this.model.findUnique({
        where: { id },
        include: includes,
      });
      if (!data) {
        throw new NotFoundException(`${this.modelName} not found`);
      }
      return this.handleSuccess(data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async create(data: unknown) {
    try {
      const result = await this.model.create({ data });
      return this.handleSuccess(result);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(id: string, data: unknown) {
    try {
      const result = await this.model.update({
        where: { id },
        data,
      });
      return this.handleSuccess(result);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async remove(id: string) {
    try {
      const existing = await this.model.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException(`${this.modelName} not found`);
      }
      await this.model.delete({ where: { id } });
      return this.handleSuccess(existing);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  protected async getUserFromRequest(req: Request) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    try {
      const decoded = verify(token, this.config.get("JWT_SECRET")) as {
        userId: string;
      };

      const user = await this.prisma.user_profiles.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          role: true,
          is_active: true,
        },
      });

      if (!user || !user.is_active) {
        throw new UnauthorizedException("Invalid or inactive user");
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }
  }

  protected async validateRequest(req: Request) {
    const user = await this.getUserFromRequest(req);
    if (!user) {
      throw new UnauthorizedException("Unauthorized");
    }
    return user;
  }

  protected async checkPermission(userRole: any) {
    const permission = await this.prisma.role_permissions.findFirst({
      where: {
        role: userRole,
        table_name: this.modelName,
      },
    });

    if (!permission) {
      throw new UnauthorizedException("Insufficient permissions");
    }
  }

  protected handleSuccess<R>(data: R) {
    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  protected handlePaginatedSuccess<R>(data: R[], meta: any) {
    const paginatedResponse: PaginatedResponse<R> = {
      items: data,
      meta,
      success: true,
      timestamp: new Date().toISOString(),
    };
    return paginatedResponse;
  }

  protected handleError(error: any): never {
    this.logger.error("Error:", error);
    
    if (error instanceof HttpException) {
      throw error;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          throw new ConflictException(`Duplicate entry on ${this.modelName}`);
        case "P2003":
          throw new BadRequestException(`Referenced record not found on ${this.modelName}`);
        case "P2021":
          throw new NotFoundException(`Table not found for ${this.modelName}`);
        case "P2025":
          throw new NotFoundException(`${this.modelName} not found`);
        case "P2010":
          throw new BadRequestException(`Invalid query on ${this.modelName}`);
        default:
          throw new InternalServerErrorException(`Database error on ${this.modelName}`);
      }
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new BadRequestException(`Validation error on ${this.modelName}`);
    }

    throw new InternalServerErrorException(error.message || "An unexpected error occurred");
  }
}
