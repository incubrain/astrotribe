// src/generators/nestjs/generator.ts

import { mkdir, writeFile } from 'fs/promises'
import { dirname, join } from 'path'
import { Pool } from 'pg'
import { render } from 'ejs'
import type { SchemaAnalyzer, TableSchema, ColumnDefinition } from '../schema-analyzer'
import { NamingUtils, typeMapper, PropertyGenerator } from './utils'

export interface NestJSGeneratorOptions {
  outputDir: string
  baseUrl?: string
  features?: {
    swagger?: boolean
    policies?: boolean
    validation?: boolean
    tests?: boolean
    graphql?: boolean
    migrations?: boolean
  }
  style?: {
    usePrettier?: boolean
    useEslint?: boolean
  }
  database?: {
    type: 'supabase' | 'postgres'
    connectionString?: string
  }
  structure?: {
    monorepo?: boolean
    separateFiles?: boolean
  }
}

export interface NestJSGeneratorOptions {
  outputDir: string
  baseUrl?: string
  features?: {
    swagger?: boolean
    policies?: boolean
    validation?: boolean
    tests?: boolean
    graphql?: boolean
    migrations?: boolean
  }
  style?: {
    usePrettier?: boolean
    useEslint?: boolean
  }
  database?: {
    type: 'supabase' | 'postgres'
    connectionString?: string
  }
  structure?: {
    monorepo?: boolean
    separateFiles?: boolean
  }
}

export class NestJSGenerator {
  constructor(
    private analyzer: SchemaAnalyzer,
    private options: NestJSGeneratorOptions,
  ) {}

  async generate(): Promise<void> {
    const schemas = await this.analyzer.analyzeDatabase({
      includeColumns: true,
      includeRelationships: true,
      includeSecurityAnalysis: true,
      includeEnums: true,
      includeFunctions: true,
      includePolicies: true,
    })

    // Group schemas by domain
    const domainGroups = this.groupSchemasByDomain(schemas)

    // Generate domain-specific code
    for (const [domain, domainSchemas] of Object.entries(domainGroups)) {
      await this.generateDomainModule(domain, domainSchemas)

      for (const schema of domainSchemas) {
        const basePath = `modules/${domain}/${schema.name}`
        await this.generateSchemaFiles(schema, basePath)
      }
    }

    // Generate shared code
    await this.generateSharedCode()
  }

  private async generateSchemaFiles(schema: TableSchema, basePath: string): Promise<void> {
    await Promise.all([
      this.generateModule(schema, basePath),
      this.generateController(schema),
      this.generateService(schema),
      this.generateDtos(schema, basePath),
      this.generateEntity(schema, basePath),
      this.options.features?.policies && this.generatePolicies(schema, basePath),
      this.options.features?.tests && this.generateTests(schema, basePath),
    ])
  }

  private groupSchemasByDomain(schemas: TableSchema[]): Record<string, TableSchema[]> {
    return schemas.reduce(
      (groups, schema) => {
        const domain = schema.domain || 'common'
        if (!groups[domain]) {
          groups[domain] = []
        }
        groups[domain].push(schema)
        return groups
      },
      {} as Record<string, TableSchema[]>,
    )
  }

  private async generateDomainModule(domain: string, schemas: TableSchema[]): Promise<void> {
    const className = NamingUtils.toPascalCase(domain)
    const content = `
import { Module } from '@nestjs/common';
${schemas
  .map(
    (s) =>
      `import { ${NamingUtils.toPascalCase(s.name)}Module } from './${s.name}/${NamingUtils.getBaseFileName(
        s.name,
      )}.module';`,
  )
  .join('\n')}

@Module({
  imports: [
    ${schemas.map((s) => `${NamingUtils.toPascalCase(s.name)}Module`).join(',\n    ')}
  ],
  exports: [
    ${schemas.map((s) => `${NamingUtils.toPascalCase(s.name)}Module`).join(',\n    ')}
  ],
})
export class ${className}Module {}`

    await this.writeFile(`modules/${domain}/index.ts`, content)
  }

  private async generateModule(schema: TableSchema, basePath: string): Promise<void> {
    const className = NamingUtils.toPascalCase(schema.name)
    const content = `
import { Module } from '@nestjs/common';
import { ${className}Controller } from './${NamingUtils.getBaseFileName(schema.name)}.controller';
import { ${className}Service } from './${NamingUtils.getBaseFileName(schema.name)}.service';
import { PermissionsModule } from '@/common/permissions/permissions.module';
${schema.relationships
  ?.map(
    (rel) =>
      `import { ${NamingUtils.toPascalCase(rel.table)}Module } from '../${
        rel.table
      }/${NamingUtils.getBaseFileName(rel.table)}.module';`,
  )
  .join('\n')}

@Module({
  imports: [
    PermissionsModule,
    ${schema.relationships?.map((rel) => `${NamingUtils.toPascalCase(rel.table)}Module`).join(',\n    ')}
  ],
  controllers: [${className}Controller],
  providers: [${className}Service],
  exports: [${className}Service],
})
export class ${className}Module {}`

    await this.writeFile(
      `${basePath}/${NamingUtils.getBaseFileName(schema.name)}.module.ts`,
      content,
    )
  }

  private generateController(schema: TableSchema): string {
    const className = NamingUtils.toPascalCase(NamingUtils.toSingular(schema.name))
    const fileName = NamingUtils.getBaseFileName(schema.name)
    const routePath = NamingUtils.toKebabCase(schema.name)
    const singularName = NamingUtils.toSingular(schema.name)

    return `
  import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
  import { PermissionsGuard } from '@/common/guards/permissions.guard';
  import { RequirePermissions } from '@/common/decorators/permissions.decorator';
  import { CurrentUser } from '@/common/decorators/current-user.decorator';
  import { PaginationDto } from '@/common/dto/pagination.dto';
  import { ${className}Service } from './${fileName}.service';
  import { Create${className}Dto, Update${className}Dto } from './dto/${fileName}.dto';
  import { ${className}Entity } from './entities/${fileName}.entity';
  
  @ApiTags('${schema.domain} / ${routePath}')
  @Controller('${schema.domain}/${routePath}')
  @UseGuards(PermissionsGuard)
  export class ${className}Controller {
    constructor(private readonly service: ${className}Service) {}
  
    @Get()
    @ApiOperation({ summary: 'Find all ${singularName}' })
    @ApiResponse({ 
      type: [${className}Entity],
      description: 'Returns a list of ${singularName} records'
    })
    @RequirePermissions('${routePath}.read')
    async findAll(@Query() pagination: PaginationDto, @CurrentUser() user: any): Promise<${className}Entity[]> {
      return this.service.findAll(pagination, user);
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Find one ${singularName}' })
    @ApiResponse({ 
      type: ${className}Entity,
      description: 'Returns a single ${singularName} record'
    })
    @RequirePermissions('${routePath}.read')
    async findOne(@Param('id') id: string, @CurrentUser() user: any): Promise<${className}Entity> {
      return this.service.findOne(id, user);
    }
    ${this.generateControllerMethods(schema, className, routePath)}
      ${this.generateCustomEndpoints(schema)}

  }`
  }

  private generateControllerMethods(
    schema: TableSchema,
    className: string,
    routePath: string,
  ): string {
    if (schema.securityLevel === 'public') {
      return ''
    }

    return `
    @Post()
    @ApiOperation({ summary: 'Create ${NamingUtils.toSingular(schema.name)}' })
    @ApiResponse({ 
      type: ${className}Entity,
      description: 'Creates and returns a new ${NamingUtils.toSingular(schema.name)} record'
    })
    @RequirePermissions('${routePath}.create')
    async create(@Body() dto: Create${className}Dto, @CurrentUser() user: any): Promise<${className}Entity> {
      return this.service.create(dto, user.id);
    }
  
    @Put(':id')
    @ApiOperation({ summary: 'Update ${NamingUtils.toSingular(schema.name)}' })
    @ApiResponse({ 
      type: ${className}Entity,
      description: 'Updates and returns the modified ${NamingUtils.toSingular(schema.name)} record'
    })
    @RequirePermissions('${routePath}.update')
    async update(
      @Param('id') id: string,
      @Body() dto: Update${className}Dto,
      @CurrentUser() user: any
    ): Promise<${className}Entity> {
      return this.service.update(id, dto, user.id);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete ${NamingUtils.toSingular(schema.name)}' })
    @ApiResponse({ description: 'Deletes the specified ${NamingUtils.toSingular(schema.name)} record' })
    @RequirePermissions('${routePath}.delete')
    async remove(@Param('id') id: string, @CurrentUser() user: any): Promise<void> {
      return this.service.remove(id, user.id);
    }`
  }

  private generateService(schema: TableSchema): string {
    const className = NamingUtils.toPascalCase(NamingUtils.toSingular(schema.name))
    const fileName = NamingUtils.getBaseFileName(schema.name)

    return `
  import { Injectable } from '@nestjs/common';
  import { SupabaseClient } from '@supabase/supabase-js';
  import { BaseService } from '@/common/services/base.service';
  import { PermissionsService } from '@/common/services/permissions.service';
  import { Create${className}Dto, Update${className}Dto } from './dto/${fileName}.dto';
  import { ${className}Entity } from './entities/${fileName}.entity';
  import { PaginationDto } from '@/common/dto/pagination.dto';
  
  @Injectable()
  export class ${className}Service extends BaseService<${className}Entity> {
    protected readonly tableName = '${schema.name}';
  
    constructor(
      protected readonly supabase: SupabaseClient,
      protected readonly permissions: PermissionsService,
    ) {
      super(supabase, permissions);
    }
  
    async findAll(pagination?: PaginationDto, user?: any): Promise<${className}Entity[]> {
      return super.findAll(pagination, user);
    }
  
    async findOne(id: string | number, user?: any): Promise<${className}Entity> {
      return super.findOne(id, user);
    }
  
    async create(dto: Create${className}Dto, userId: string): Promise<${className}Entity> {
      const data = {
        ...dto,
        ${schema.hasUserRelation ? 'user_id: userId,' : ''}
        created_at: new Date()
      };
      return super.createOne(data);
    }
  
    async update(id: string, dto: Update${className}Dto, userId: string): Promise<${className}Entity> {
      const data = {
        ...dto,
        updated_at: new Date()
      };
      const where = ${schema.hasUserRelation ? '{ user_id: userId }' : 'undefined'};
      return super.updateOne(id, data, where);
    }
  
    async remove(id: string, userId: string): Promise<void> {
      return super.remove(id, ${schema.hasUserRelation ? 'userId' : 'undefined'});
    }
  
    protected hasUserColumn(): boolean {
      return ${!!schema.hasUserRelation};
    }
  
    ${this.generateCustomMethods(schema, className)}
  }`
  }

  private generateCustomMethods(schema: TableSchema, className: string): string {
    const methods: string[] = []

    // Add domain-specific methods
    if (schema.domain === 'content') {
      methods.push(`
  async publish(id: string): Promise<${className}Entity> {
    return this.updateOne(id, { published_at: new Date() })
  }

  async unpublish(id: string): Promise<${className}Entity> {
    return this.updateOne(id, { published_at: null })
  }`)
    }

    // Add relationship methods
    if (schema.relationships?.length) {
      for (const rel of schema.relationships) {
        const relatedClassName = NamingUtils.toPascalCase(NamingUtils.toSingular(rel.table))
        if (rel.type === 'oneToMany') {
          methods.push(`
  async get${relatedClassName}s(id: string): Promise<${relatedClassName}Entity[]> {
    const { data, error } = await this.supabase
      .from('${rel.table}')
      .select('*')
      .eq('${rel.foreignKey}', id)
    
    if (error: any) throw error
    return data
  }`)
        }
      }
    }

    return methods.join('\n')
  }

  private async generateEntity(schema: TableSchema, basePath: string): Promise<void> {
    const className = NamingUtils.toPascalCase(NamingUtils.toSingular(schema.name))
    const fileName = NamingUtils.getBaseFileName(schema.name)

    // Generate enums first if needed
    if (schema.columns?.some((col) => col.type === 'USER-DEFINED')) {
      await this.generateEnums(schema, basePath)
    }

    const content = `
import { ApiProperty } from '@nestjs/swagger'
${this.generateEnumImports(schema)}

export class ${className}Entity {
  ${this.generateEntityProperties(schema)}

  constructor(partial: Partial<${className}Entity>) {
    Object.assign(this, partial)
  }
}
`
    await this.writeFile(`${basePath}/entities/${fileName}.entity.ts`, content)
  }

  private async generateEnums(schema: TableSchema, basePath: string): Promise<void> {
    if (!schema.enums?.length) return

    for (const enumDef of schema.enums) {
      const enumName = NamingUtils.toPascalCase(enumDef.name)
      const fileName = NamingUtils.toKebabCase(enumDef.name)

      const content = `
// This enum was automatically generated from database type: ${enumDef.type}
export enum ${enumName}Enum {
  ${enumDef.values.map((value) => `${this.formatEnumKey(value)} = '${value}'`).join(',\n  ')}
}

// Type guard
export function is${enumName}(value: any): value is ${enumName}Enum {
  return Object.values(${enumName}Enum).includes(value);
}
`

      await this.writeFile(`${basePath}/enums/${fileName}.enum.ts`, content)
    }
  }

  private formatEnumKey(value: string): string {
    // Convert the enum value to a valid TypeScript enum key
    // e.g., "my value" -> "MY_VALUE"
    return value
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
  }

  private generateEnumImports(schema: TableSchema): string {
    if (!schema.enums?.length) return ''

    return schema.enums
      .map((enumDef) => {
        const enumName = NamingUtils.toPascalCase(enumDef.name)
        const fileName = NamingUtils.toKebabCase(enumDef.name)
        return `import { ${enumName}Enum, is${enumName} } from '../enums/${fileName}.enum';`
      })
      .join('\n')
  }

  private generateEntityProperties(schema: TableSchema): string {
    return (
      schema.columns
        ?.map((column) => {
          const swaggerDecorator = PropertyGenerator.generateSwaggerProperty(column, schema)
          const type = PropertyGenerator.getTypeScriptType(column, schema)

          return `
  ${swaggerDecorator}
  ${column.name}: ${type}`
        })
        .join('\n') || ''
    )
  }

  private async generateDtos(schema: TableSchema, basePath: string): Promise<void> {
    const className = NamingUtils.toPascalCase(NamingUtils.toSingular(schema.name))
    const fileName = NamingUtils.getBaseFileName(schema.name)

    const content = `
  import { ApiProperty } from '@nestjs/swagger';
  import { IsNotEmpty, IsOptional, IsUUID, IsString, IsInt, IsBoolean, IsDate, IsEnum, IsObject, Type } from 'class-validator';
  ${this.generateEnumImports(schema)}
  
  // Create DTO
  export class Create${className}Dto {
  ${schema.columns
    ?.filter((col) => !col.isPrimary && col.name !== 'created_at' && col.name !== 'updated_at')
    .map((col) => PropertyGenerator.generateDtoProperty(col, schema, false))
    .join('\n')}
  }
  
  // Update DTO
  export class Update${className}Dto {
  ${schema.columns
    ?.filter((col) => col.name !== 'created_at' && col.name !== 'updated_at')
    .map((col) => PropertyGenerator.generateDtoProperty(col, schema, true))
    .join('\n')}
  }
  
  // List Query DTO
  export class List${className}QueryDto extends PaginationDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    search?: string;
  
    ${this.generateListQueryFields(schema)}
  }
  `

    await this.writeFile(`${basePath}/dto/${fileName}.dto.ts`, content)
  }

  private generateListQueryFields(schema: TableSchema): string {
    const fields: string[] = []

    // Add common filter fields
    if (schema.hasUserRelation) {
      fields.push(`
    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    userId?: string;`)
    }

    if (schema.hasCompanyRelation) {
      fields.push(`
    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    companyId?: string;`)
    }

    // Add status field if schema has status enum
    if (schema.columns?.some((col) => col.name === 'status')) {
      fields.push(`
    @ApiProperty({ required: false, enum: StatusEnum })
    @IsOptional()
    @IsEnum(StatusEnum)
    status?: StatusEnum;`)
    }

    // Add date range filters if schema has date fields
    if (schema.columns?.some((col) => col.type === 'timestamp with time zone')) {
      fields.push(`
    @ApiProperty({ required: false })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    startDate?: Date;
  
    @ApiProperty({ required: false })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    endDate?: Date;`)
    }

    return fields.join('\n')
  }

  private async generatePolicies(schema: TableSchema, basePath: string): Promise<void> {
    const className = this.getClassName(schema.name)
    const content = `
  import { Injectable } from '@nestjs/common';
  import { BasePolicy } from '@/common/policies/base.policy';
  import { ${className}Entity } from './entities/${schema.name}.entity';
  
  @Injectable()
  export class ${className}Policy extends BasePolicy<${className}Entity> {
    protected readonly resourceName = '${schema.name}';
  
    async canRead(user: any, resource?: ${className}Entity): Promise<boolean> {
      ${this.generatePolicyLogic(schema, 'read')}
    }
  
    async canCreate(user: any): Promise<boolean> {
      ${this.generatePolicyLogic(schema, 'create')}
    }
  
    async canUpdate(user: any, resource: ${className}Entity): Promise<boolean> {
      ${this.generatePolicyLogic(schema, 'update')}
    }
  
    async canDelete(user: any, resource: ${className}Entity): Promise<boolean> {
      ${this.generatePolicyLogic(schema, 'delete')}
    }
  }`
    const baseFileName = NamingUtils.getBaseFileName(schema.name)

    await this.writeFile(`${basePath}/policies/${schema.name}.policy.ts`, content)
  }

  private async generateSharedCode(): Promise<void> {
    await Promise.all([
      this.generateBaseService(),
      this.generatePermissionsGuard(),
      this.generateBasePolicy(),
      this.generateCommonDtos(),
    ])
  }

  private async generateBasePolicy(): Promise<void> {
    const content = `
  import { Injectable } from '@nestjs/common';
  
  @Injectable()
  export abstract class BasePolicy<T> {
    protected abstract readonly resourceName: string;
  
    abstract canRead(user: any, resource?: T): Promise<boolean>;
    abstract canCreate(user: any): Promise<boolean>;
    abstract canUpdate(user: any, resource: T): Promise<boolean>;
    abstract canDelete(user: any, resource: T): Promise<boolean>;
  
    protected isAdmin(user: any): boolean {
      return user.role === 'admin';
    }
  
    protected isResourceOwner(user: any, resource: any): boolean {
      return resource.user_id === user.id;
    }
  }`

    await this.writeFile('common/policies/base.policy.ts', content)
  }

  private async generateCommonDtos(): Promise<void> {
    const content = `
  import { ApiProperty } from '@nestjs/swagger';
  import { IsOptional, IsInt, Min, Max } from 'class-validator';
  import { Type } from 'class-transformer';
  
  export class PaginationDto {
    @ApiProperty({ required: false, minimum: 1, default: 1 })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    page?: number = 1;
  
    @ApiProperty({ required: false, minimum: 1, maximum: 100, default: 10 })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    @Type(() => Number)
    limit?: number = 10;
  }`

    await this.writeFile('common/dto/pagination.dto.ts', content)
  }

  private generateCustomEndpoints(schema: TableSchema): string {
    const endpoints: string[] = []

    // Add domain-specific endpoints
    if (schema.domain === 'content') {
      const className = NamingUtils.toPascalCase(NamingUtils.toSingular(schema.name))
      endpoints.push(`
  @Put(':id/publish')
  @ApiOperation({ summary: 'Publish ${NamingUtils.toSingular(schema.name)}' })
  @ApiResponse({ type: ${className}Entity })
  @RequirePermissions('${schema.name}.publish')
  publish(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.publish(id);
  }

  @Put(':id/unpublish')
  @ApiOperation({ summary: 'Unpublish ${NamingUtils.toSingular(schema.name)}' })
  @ApiResponse({ type: ${className}Entity })
  @RequirePermissions('${schema.name}.publish')
  unpublish(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.unpublish(id);
  }`)
    }

    return endpoints.join('\n')
  }

  private generatePolicyLogic(schema: TableSchema, action: string): string {
    // Admin always has access
    if (schema.securityLevel === 'protected') {
      return 'return this.isAdmin(user);'
    }

    // Public tables are readable by all, but may have restricted writes
    if (schema.securityLevel === 'public') {
      switch (action) {
        case 'read':
          return 'return true;'
        default:
          return 'return this.isAdmin(user);'
      }
    }

    // For tables with user relations, implement ownership checks
    if (schema.hasUserRelation) {
      switch (action) {
        case 'read':
          return `
      if (this.isAdmin(user)) return true;
      if (!resource) return true; // List view
      return this.isResourceOwner(user, resource);`
        case 'create':
          return 'return true; // User ID will be set automatically'
        case 'update':
        case 'delete':
          return `
      if (this.isAdmin(user)) return true;
      return this.isResourceOwner(user, resource);`
      }
    }

    // For tables with company relations
    if (schema.hasCompanyRelation) {
      return `
      if (this.isAdmin(user)) return true;
      if (!resource) return true;
      return user.company_id === resource.company_id;`
    }

    // Default policy for private resources
    switch (action) {
      case 'read':
        return `
      if (this.isAdmin(user)) return true;
      return ${schema.securityLevel === 'private' ? 'false' : 'true'};`
      default:
        return 'return this.isAdmin(user);'
    }
  }

  private async generateBaseService(): Promise<void> {
    const content = `
  import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
  import { SupabaseClient } from '@supabase/supabase-js';
  import { PaginationDto } from '../dto/pagination.dto';
  import { PermissionsService } from './permissions.service';
  
  @Injectable()
  export abstract class BaseService<T = any> {
    protected abstract readonly tableName: string;
  
    constructor(
      protected readonly supabase: SupabaseClient,
      protected readonly permissions: PermissionsService,
    ) {}
  
    protected async checkPermission(user: any, action: string, resource?: T): Promise<void> {
      const hasPermission = await this.permissions.check(
        user,
        this.tableName,
        action,
        resource
      );
  
      if (!hasPermission) {
        throw new ForbiddenException(\`No permission to \${action} \${this.tableName}\`);
      }
    }
  
    async findAll(pagination?: PaginationDto, user?: any): Promise<T[]> {
      await this.checkPermission(user, 'read');
  
      const { page = 1, limit = 10 } = pagination || {};
      const from = (page - 1) * limit;
      const to = from + limit - 1;
  
      let query = this.supabase
        .from(this.tableName)
        .select('*')
        .range(from, to)
        .order('created_at', { ascending: false });
  
      // Apply user filtering if needed
      if (user?.role !== 'admin' && this.hasUserColumn()) {
        query = query.eq('user_id', user.id);
      }
  
      const { data, error } = await query;
  
      if (error: any) throw error;
      return data;
    }
  
    async findOne(id: string, user?: any): Promise<T> {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();
  
      if (error: any) throw error;
      if (!data) throw new NotFoundException();
  
      await this.checkPermission(user, 'read', data);
  
      return data;
    }
  
    protected async createOne(data: Partial<T>): Promise<T> {
      const { data: created, error } = await this.supabase
        .from(this.tableName)
        .insert(data)
        .select()
        .single();
  
      if (error: any) throw error;
      return created;
    }
  
    protected async updateOne(id: string, data: Partial<T>, where: Record<string, any> = {}): Promise<T> {
      const query = this.supabase
        .from(this.tableName)
        .update(data)
        .eq('id', id);
  
      // Add additional where conditions
      Object.entries(where).forEach(([key, value]) => {
        query.eq(key, value);
      });
  
      const { data: updated, error } = await query.select().single();
  
      if (error: any) throw error;
      if (!updated) throw new NotFoundException();
  
      return updated;
    }
  
    protected async deleteOne(id: string, where: Record<string, any> = {}): Promise<void> {
      const query = this.supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);
  
      // Add additional where conditions
      Object.entries(where).forEach(([key, value]) => {
        query.eq(key, value);
      });
  
      const { error } = await query;
  
      if (error: any) throw error;
    }
  
    protected hasUserColumn(): boolean {
      return true; // Override in specific services if needed
    }
  }`

    await this.writeFile('common/services/base.service.ts', content)
  }

  private async generatePermissionsGuard(): Promise<void> {
    const content = `
  import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { PermissionsService } from '../services/permissions.service';
  
  @Injectable()
  export class PermissionsGuard implements CanActivate {
    constructor(
      private reflector: Reflector,
      private permissionsService: PermissionsService
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const permissions = this.reflector.get<string[]>('permissions', context.getHandler());
      
      if (!permissions || permissions.length === 0) {
        return true;
      }
  
      const request = context.switchToHttp().getRequest();
      const user = request.user;
  
      if (!user) {
        return false;
      }
  
      const resource = request.params?.id ? 
        await this.getResource(context) : 
        undefined;
  
      return this.permissionsService.check(user, permissions, resource);
    }
  
    private async getResource(context: ExecutionContext): Promise<any> {
      const handler = context.getHandler();
      const controller = context.getClass();
      
      // Get service from controller instance
      const controllerInstance = context.switchToHttp().getRequest().__controller;
      if (!controllerInstance) return undefined;
  
      const service = Reflect.get(controllerInstance, 'service');
      if (!service || !service.findOne) return undefined;
  
      const request = context.switchToHttp().getRequest();
      try {
        return await service.findOne(request.params.id);
      } catch {
        return undefined;
      }
    }
  }`

    await this.writeFile('common/guards/permissions.guard.ts', content)

    // Also generate the permissions service
    await this.generatePermissionsService()
  }

  private async generatePermissionsService(): Promise<void> {
    const content = `
  import { Injectable } from '@nestjs/common';
  import { SupabaseClient } from '@supabase/supabase-js';
  
  @Injectable()
  export class PermissionsService {
    constructor(private readonly supabase: SupabaseClient) {}
  
    async check(user: any, permissions: string | string[], resource?: any): Promise<boolean> {
      // Admin bypass
      if (user.role === 'admin') return true;
  
      const permissionList = Array.isArray(permissions) ? permissions : [permissions];
      
      // Check user roles and permissions
      const { data: userPermissions, error } = await this.supabase
        .from('user_permissions')
        .select('permission')
        .eq('user_id', user.id);
  
      if (error: any) return false;
  
      const userPermissionList = userPermissions.map(p => p.permission);
  
      // Check if user has any of the required permissions
      const hasPermission = permissionList.some(permission => 
        userPermissionList.includes(permission)
      );
  
      if (!hasPermission) return false;
  
      // Check resource ownership if applicable
      if (resource?.user_id && resource.user_id !== user.id) {
        return false;
      }
  
      return true;
    }
  }`

    await this.writeFile('common/services/permissions.service.ts', content)
  }

  private async generateTests(schema: TableSchema, basePath: string): Promise<void> {
    const baseFileName = NamingUtils.getBaseFileName(schema.name)

    const className = this.getClassName(schema.name)
    const content = `
import { Test, TestingModule } from '@nestjs/testing';
import { ${className}Service } from './${baseFileName}.service';
import { ${className}Controller } from './${baseFileName}.controller';
import { PermissionsService } from '@/common/services/permissions.service';
import { SupabaseModule } from '@/common/supabase/supabase.module';

describe('${className}Controller', () => {
  let controller: ${className}Controller;
  let service: ${className}Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SupabaseModule],
      controllers: [${className}Controller],
      providers: [${className}Service, PermissionsService],
    }).compile();

    controller = module.get<${className}Controller>(${className}Controller);
    service = module.get<${className}Service>(${className}Service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  ${this.generateTestCases(schema)}
});`

    await this.writeFile(`${basePath}/__tests__/${baseFileName}.spec.ts`, content)
  }

  private generateTestCases(schema: TableSchema): string {
    const className = this.getClassName(schema.name)
    return `
  describe('findAll', () => {
    it('should return an array of ${schema.name}', async () => {
      const result = [];
      jest.spyOn(service, 'findAll').mockImplementation(async () => result);
      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single ${schema.name}', async () => {
      const result = {};
      jest.spyOn(service, 'findOne').mockImplementation(async () => result);
      expect(await controller.findOne('1')).toBe(result);
    });
  });`
  }

  private async writeFile(path: string, content: string): Promise<void> {
    const fullPath = join(this.options.outputDir, path)
    await mkdir(dirname(fullPath), { recursive: true })
    await writeFile(fullPath, content)
  }

  private getClassName(tableName: string): string {
    return this.toPascalCase(tableName)
  }

  private toPascalCase(str: string): string {
    return str
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')
  }
}
