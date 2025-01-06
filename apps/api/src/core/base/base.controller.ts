// base.controller.ts

import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  HttpException,
  InternalServerErrorException,
  BadRequestException,
  ConflictException,
  Inject,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request, Response } from 'express'
import { verify } from 'jsonwebtoken'
import { ConfigService } from '@nestjs/config'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../services/prisma.service'
import { PaginationService } from '../services/pagination.service'
import { CustomLogger } from '../logger/custom.logger'
import { DebugService } from '../services/debug.service'
import type { PaginatedResponse, PaginatedQuery } from '@types'

@Injectable()
export abstract class BaseController {
  @Inject()
  private readonly debugService: DebugService

  constructor(protected readonly modelName: keyof Prisma.TypeMap['model']) {}

  protected abstract get prisma(): PrismaService
  protected abstract get config(): ConfigService
  protected abstract get paginationService(): PaginationService
  protected abstract get logger(): CustomLogger

  protected get model(): any {
    return this.prisma[this.modelName]
  }

  async findAll(query: PaginatedQuery) {
    try {
      const { page = 1, limit = 10, include, ...filters } = query
      const includes = include?.reduce((acc, rel) => ({ ...acc, [rel]: true }), {})

      const [items, total] = await Promise.all([
        this.model.findMany({
          where: filters,
          include: includes,
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
        }),
        this.model.count({ where: filters }),
      ])

      return this.handlePaginatedSuccess(
        items,
        this.paginationService.getPaginationMeta(total, query),
      )
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  async findOne(id: string, include?: string[]) {
    try {
      const includes = include?.reduce((acc, rel) => ({ ...acc, [rel]: true }), {})
      const data = await this.model.findUnique({
        where: { id },
        include: includes,
      })
      if (!data) {
        throw new NotFoundException(`${String(this.modelName)} not found`)
      }
      return this.handleSuccess(data)
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  async create(data: unknown) {
    try {
      const result = await this.model.create({ data })
      return this.handleSuccess(result)
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  async update(id: string, data: unknown) {
    try {
      const result = await this.model.update({
        where: { id },
        data,
      })
      return this.handleSuccess(result)
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  async remove(id: string) {
    try {
      const existing = await this.model.findUnique({ where: { id } })
      if (!existing) {
        throw new NotFoundException(`${String(this.modelName)} not found`)
      }
      await this.model.delete({ where: { id } })
      return this.handleSuccess(existing)
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  protected handleSuccess<T>(data: T): Partial<Response<T>> {
    const req = this.getRequest()
    const debug = this.config.get('app.debug')

    const response: any = { data }

    if (debug && req?.permissions) {
      response.debug = {
        permissions: req.permissions,
        timestamp: new Date().toISOString(),
      }
    }

    return response
  }

  protected handlePaginatedSuccess<T>(data: T[], meta: any): PaginatedResponse<T> {
    const req = this.getRequest()
    const debug = this.config.get('app.debug')

    const response: PaginatedResponse<T> = {
      data,
      meta,
      timestamp: new Date().toISOString(),
      success: true,
    }

    if (debug && req.permissions) {
      response.debug = {
        permissions: req.permissions,
        timestamp: new Date().toISOString(),
      }
    }

    return response
  }

  private getRequest() {
    // get httpContext from the current request scope
    const httpContext = require('@nestjs/core').HttpAdapterHost
    const req = httpContext.HttpAdapterHost.getRequestScope()
    return req
  }

  protected handleError(error: any): never {
    this.logger.error('Error:', error)

    if (error instanceof HttpException) {
      throw error
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          throw new ConflictException(`Duplicate entry on ${String(this.modelName)}`)
        case 'P2003':
          throw new BadRequestException(`Referenced record not found on ${String(this.modelName)}`)
        case 'P2021':
          throw new NotFoundException(`Table not found for ${String(this.modelName)}`)
        case 'P2025':
          throw new NotFoundException(`${String(this.modelName)} not found`)
        case 'P2010':
          throw new BadRequestException(`Invalid query on ${String(this.modelName)}`)
        default:
          throw new InternalServerErrorException(`Database error on ${String(this.modelName)}`)
      }
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new BadRequestException(`Validation error on ${String(this.modelName)}`)
    }

    throw new InternalServerErrorException(error.message || 'An unexpected error occurred')
  }
}
