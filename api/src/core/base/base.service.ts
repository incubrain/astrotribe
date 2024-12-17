// core/services/base.service.ts
import { Injectable } from "@nestjs/common";
import { PrismaClient, Prisma } from "@prisma/client";
import { PaginationService } from "../services/pagination.service";

@Injectable()
export abstract class BaseService<ModelName extends Prisma.ModelName> {
  constructor(
    protected readonly paginationService: PaginationService,
    protected readonly modelName: ModelName
  ) {}

  protected handleError(error: any): never {
    console.error("Database operation failed:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          throw new Error(
            `Duplicate entry on ${this.modelName}: ${error.message}`
          );
        case "P2003":
          throw new Error(
            `Referenced record not found on ${this.modelName}: ${error.message}`
          );
        case "P2021":
          throw new Error(
            `Table not found for ${this.modelName}: ${error.message}`
          );
        case "P2025":
          throw new Error(
            `Record not found on ${this.modelName}: ${error.message}`
          );
        case "P2010":
          throw new Error(
            `Invalid query on ${this.modelName}: ${error.message}`
          );
        default:
          throw new Error(
            `Database error on ${this.modelName}: ${error.message}`
          );
      }
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new Error(
        `Validation error on ${this.modelName}: ${error.message}`
      );
    }

    if (error.code) {
      switch (error.code) {
        case "23505":
          throw new Error(
            `Duplicate entry on ${this.modelName}: ${error.message}`
          );
        case "23503":
          throw new Error(
            `Referenced record not found on ${this.modelName}: ${error.message}`
          );
        case "42P01":
          throw new Error(
            `Table not found for ${this.modelName}: ${error.message}`
          );
        case "42703":
          throw new Error(
            `Column not found on ${this.modelName}: ${error.message}`
          );
      }
    }

    throw new Error(
      `An unexpected error occurred on ${this.modelName}: ${error.message}`
    );
  }

  protected async executeQuery<R>(
    operation: () => Promise<R | { data: R | null; error: any }>
  ): Promise<R> {
    try {
      const result = await operation();
      return result as R;
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected async executePrismaQuery<R>(
    operation: () => Promise<R>
  ): Promise<R> {
    try {
      return await operation();
    } catch (error) {
      return this.handleError(error);
    }
  }
}
