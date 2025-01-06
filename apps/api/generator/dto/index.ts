// tools/generators/dto/index.ts
import path from 'path'
import { Command } from 'commander'
import { PrismaClient, Prisma } from '@prisma/client'
import { getDMMF } from '@prisma/internals'
import { DMMF } from '@prisma/generator-helper'
import { Chalk } from 'chalk'
import { ConfigurationManager } from './config'
import { BaseGenerator } from './core/base.generator'
import { FileManager } from './utils/file-manager'
import { DocumentationGenerator } from './modules/documentation'
import { ValidationGenerator } from './modules/validators'
import { TransformationGenerator } from './modules/transformers'
import { InterfaceGenerator } from './modules/interfaces'
import { SchemaGenerator } from './modules/schemas'
import { TypeGuardGenerator } from './modules/type-guard'
import { TypeMapper } from './utils/type-mapper'
import { OpenAPIMetadataGenerator } from './modules/openapi-metadata'
import type { GeneratorOptions, ModelMetadata, GeneratedFile } from './types'

const chalk = new Chalk()

/**
 * Main entry point for the DTO generator.
 * Handles CLI interface, configuration loading, and orchestrates
 * the generation process.
 */
export async function main() {
  const program = new Command()

  program
    .name('dtogen')
    .description('Generate DTOs from Prisma schema')
    .version('1.0.0')
    .option('-o, --output <path>', 'Output directory for generated files')
    .option('--no-validation', 'Disable validation decorators')
    .option('--no-documentation', 'Disable documentation generation')
    .parse(process.argv)

  const options = program.opts()
  const __dirname = new URL('.', import.meta.url).pathname

  try {
    // Load and validate configuration
    const config = await ConfigurationManager.loadConfiguration(options)
    ConfigurationManager.validateConfiguration(config)

    // Get DMMF directly from schema file
    const prisma = new PrismaClient()

    // Initialize generators
    const schemaPath = path.resolve(__dirname, '../../../../prisma/schema.prisma')
    const fileManager = new FileManager(config.outputPath)
    const dmmf: DMMF.Document = await getDMMF({
      datamodelPath: schemaPath,
    })

    const generator = new DTOGenerator(dmmf, config, prisma, fileManager)

    // Generate all artifacts
    console.log(chalk.blue('Starting DTO generation...'))
    await generator.generate()
    console.log(chalk.green('DTO generation completed successfully!'))
  } catch (error) {
    console.error(chalk.red('Error during generation:'), error)
    process.exit(1)
  }
}

class DTOGenerator extends BaseGenerator {
  private interfaceGenerator: InterfaceGenerator
  private schemaGenerator: SchemaGenerator
  private typeGuardGenerator: TypeGuardGenerator
  private documentationGenerator: DocumentationGenerator
  private validationGenerator: ValidationGenerator
  private transformationGenerator: TransformationGenerator

  constructor(
    dmmf: DMMF.Document,
    options: GeneratorOptions,
    prisma: PrismaClient,
    fileManager: FileManager,
  ) {
    super(dmmf, options)

    // Initialize type mapper first as other generators depend on it
    this.typeMapper = new TypeMapper()

    // Initialize generators that don't require processed models
    this.validationGenerator = new ValidationGenerator()
    this.transformationGenerator = new TransformationGenerator()

    // Initialize generators that work with types and documentation
    this.interfaceGenerator = new InterfaceGenerator(this.typeMapper, this.documentationParser)
    this.schemaGenerator = new SchemaGenerator(this.typeMapper, this.documentationParser)
    this.typeGuardGenerator = new TypeGuardGenerator()

    this.documentationGenerator = new DocumentationGenerator([], options, fileManager)

    this.initializeDocumentationGenerator()
  }

  /**
   * Initializes the documentation generator with processed models
   * This needs to be async because processModel is async
   */
  private async initializeDocumentationGenerator(): Promise<void> {
    const processedModels = await Promise.all(
      this.dmmf.datamodel.models.map((model) => this.processModel(model)),
    )

    // Create a new instance with the processed models
    this.documentationGenerator = new DocumentationGenerator(
      processedModels,
      this.options,
      this.fileManager,
    )
  }

  /**
   * Generates TypeScript interfaces for a model
   * These interfaces represent the shape of our data without runtime checks
   */
  protected async generateInterface(metadata: ModelMetadata): Promise<GeneratedFile> {
    const content = this.interfaceGenerator.generateInterface(metadata)
    const path = `interfaces/${metadata.name.toLowerCase()}.interface.ts`

    return {
      path,
      content,
    }
  }

  protected async generateValidatedDTO(metadata: ModelMetadata): Promise<GeneratedFile> {
    // Generate imports with all potentially needed validators
    const imports = [
      'import { ApiProperty } from "@nestjs/swagger"',
      'import { Transform } from "class-transformer"',
      'import { IsString, IsNumber, IsBoolean, IsDate, IsOptional, IsNotEmpty, IsUUID, IsInt, IsEnum, IsJSON } from "class-validator"',
    ].join('\n')

    let content = `${imports}\n\n`

    // Add class documentation if available
    if (metadata.documentation.description) {
      content += `/**\n * ${metadata.documentation.description}\n */\n`
    }

    // Add class decorators for Swagger
    content += `@ApiExcludeController()\n`
    content += `export class ${metadata.name}DTO {\n`

    // Generate properties with decorators
    for (const field of metadata.fields) {
      // Skip generated fields like updatedAt unless specifically configured
      if (field.isGenerated && !this.options.includeGeneratedFields) {
        continue
      }

      // Add property documentation
      if (field.documentation?.description) {
        content += `  /**\n   * ${field.documentation.description}\n   */\n`
      }

      // Add Swagger @ApiProperty decorator
      content += this.generateApiPropertyDecorator(field)

      // Add validation decorators based on field type and constraints
      content += this.generateValidationDecorators(field)

      // Handle transformations for dates and special types
      content += this.generateTransformDecorators(field)

      // Add the property definition
      content += `  ${field.name}${field.isRequired ? '' : '?'}: ${this.mapPrismaToTypeScriptType(field)};\n\n`
    }

    // Close the class
    content += `}\n`

    return {
      path: `dto/${metadata.name.toLowerCase()}.dto.ts`,
      content,
    }
  }

  private generateApiPropertyDecorator(field: DMMF.Field): string {
    let decorator = `  @ApiProperty({\n`
    decorator += `    description: ${JSON.stringify(field.documentation || '')},\n`
    decorator += `    type: ${OpenAPIMetadataGenerator.getSwaggerType(field)},\n`
    decorator += `    required: ${field.isRequired},\n`

    if (field.kind === 'enum') {
      decorator += `    enum: ${field.type},\n`
    }

    // Handle arrays
    if (field.isList) {
      decorator += `    isArray: true,\n`
    }

    // Add example if available
    if (field.documentation?.includes('@example')) {
      const example = this.extractExample(field.documentation)
      if (example) {
        decorator += `    example: ${JSON.stringify(example)},\n`
      }
    }

    decorator += `  })\n`
    return decorator
  }

  private generateValidationDecorators(field: DMMF.Field): string {
    const decorators: string[] = []

    // Handle required/optional
    if (field.isRequired) {
      decorators.push('@IsNotEmpty()')
    } else {
      decorators.push('@IsOptional()')
    }

    // Type-specific validation
    switch (field.type) {
      case 'String':
        decorators.push('@IsString()')
        if (field.nativeType?.[0] === 'Uuid') {
          decorators.push('@IsUUID()')
        }
        break
      case 'Int':
        decorators.push('@IsInt()')
        break
      case 'Float':
      case 'Decimal':
        decorators.push('@IsNumber()')
        break
      case 'Boolean':
        decorators.push('@IsBoolean()')
        break
      case 'DateTime':
        decorators.push('@IsDate()')
        break
      case 'Json':
        decorators.push('@IsJSON()')
        break
    }

    // Handle enums
    if (field.kind === 'enum') {
      decorators.push(`@IsEnum(${field.type})`)
    }

    return decorators.map((d) => `  ${d}\n`).join('')
  }

  private generateTransformDecorators(field: DMMF.Field): string {
    const decorators: string[] = []

    // Transform for dates
    if (field.type === 'DateTime') {
      decorators.push('  @Transform(({ value }) => value ? new Date(value) : null)\n')
    }

    // Transform for decimals
    if (field.type === 'Decimal') {
      decorators.push('  @Transform(({ value }) => new Decimal(value))\n')
    }

    return decorators.join('')
  }

  private mapPrismaToTypeScriptType(field: DMMF.Field): string {
    const baseType = this.getTypeScriptType(field)
    return field.isList ? `${baseType}[]` : baseType
  }

  private getTypeScriptType(field: DMMF.Field): string {
    const typeMap: Record<string, string> = {
      String: 'string',
      Boolean: 'boolean',
      Int: 'number',
      Float: 'number',
      DateTime: 'Date',
      Json: 'Record<string, any>',
      Decimal: 'Decimal',
      BigInt: 'bigint',
      Bytes: 'Buffer',
    }

    return field.kind === 'enum' ? field.type : typeMap[field.type] || 'any'
  }

  /**
   * Merges OpenAPI metadata with the base DTO content.
   * This ensures decorators are properly placed and imports are combined.
   */
  private mergeOpenApiMetadata(baseContent: string, openApiMetadata: string): string {
    // Extract imports from both contents
    const baseImports = this.extractImports(baseContent)
    const openApiImports = this.extractImports(openApiMetadata)

    // Combine imports without duplicates
    const combinedImports = this.combineImports(baseImports, openApiImports)

    // Extract class content without imports
    const baseClass = this.extractClassContent(baseContent)
    const openApiDecorators = this.extractClassDecorators(openApiMetadata)

    // Combine everything
    return `
      ${combinedImports}
      ${openApiDecorators}
      ${baseClass}
    `
  }

  /**
   * Extracts import statements from content
   */
  private extractImports(content: string): string[] {
    const importRegex = /import.*?;/g
    return content.match(importRegex) || []
  }

  /**
   * Combines import statements removing duplicates
   */
  private combineImports(imports1: string[], imports2: string[]): string {
    return [...new Set([...imports1, ...imports2])].join('\n')
  }

  /**
   * Extracts class content without imports
   */
  private extractClassContent(content: string): string {
    const classStart = content.indexOf('export class')
    return content.slice(classStart)
  }

  /**
   * Extracts class decorators from OpenAPI metadata
   */
  private extractClassDecorators(content: string): string {
    const classStart = content.indexOf('export class')
    const decoratorEnd = classStart
    return content.slice(0, decoratorEnd).trim()
  }

  /**
   * Generates TypeScript type guards for runtime type checking
   * These provide type safety when working with unknown data
   */
  protected async generateTypeGuard(metadata: ModelMetadata): Promise<GeneratedFile> {
    const content = this.typeGuardGenerator.generateTypeGuards(metadata)
    const path = `guards/${metadata.name.toLowerCase()}.guard.ts`

    return {
      path,
      content,
    }
  }

  /**
   * Generates Zod schemas for runtime validation
   * These provide both type information and runtime validation
   */
  protected async generateZodSchema(metadata: ModelMetadata): Promise<GeneratedFile> {
    const content = this.schemaGenerator.generateSchema(metadata)
    const path = `schemas/${metadata.name.toLowerCase()}.schema.ts`

    return {
      path,
      content,
    }
  }

  /**
   * Generates comprehensive documentation including:
   * - API documentation
   * - Type information
   * - Validation rules
   * - Examples
   */
  protected async generateDocumentation(): Promise<void> {
    if (!this.documentationGenerator) {
      await this.initializeDocumentationGenerator()
    }

    // Generate documentation using all processed models
    await this.documentationGenerator.generate()
  }

  /**
   * Generates an index file that exports all generated artifacts
   * This provides a clean public API for consuming code
   */
  protected async generateIndexFile(): Promise<void> {
    const models = this.dmmf.datamodel.models
    const indexContent = models
      .map((model) => {
        const baseName = model.name.toLowerCase()
        return [
          `export * from './interfaces/${baseName}.interface'`,
          `export * from './dto/${baseName}.dto'`,
          `export * from './schemas/${baseName}.schema'`,
          `export * from './guards/${baseName}.guard'`,
        ].join('\n')
      })
      .join('\n\n')

    await this.fileManager.writeFile('index.ts', indexContent)
  }

  /**
   * Generates utility files that are shared across generated code
   * This includes common types, helpers, and shared functionality
   */
  protected async generateUtilityFiles(): Promise<void> {
    // Generate base types
    const baseTypesContent = `
      export interface BaseDTO {
        toEntity(): Record<string, any>
      }

      export interface ValidationError {
        property: string
        constraints: Record<string, string>
      }

      export type ValidationResult<T> = {
        isValid: boolean
        data?: T
        errors?: ValidationError[]
      }
    `
    await this.fileManager.writeFile('utils/base-types.ts', baseTypesContent)

    // Generate helper functions
    const helpersContent = `
      export function createValidationError(
        property: string,
        constraint: string,
        message: string
      ): ValidationError {
        return {
          property,
          constraints: { [constraint]: message }
        }
      }

      export function isValidationError(error: unknown): error is ValidationError {
        return (
          typeof error === 'object' &&
          error !== null &&
          'property' in error &&
          'constraints' in error &&
          typeof (error as any).property === 'string' &&
          typeof (error as any).constraints === 'object'
        )
      }
    `
    await this.fileManager.writeFile('utils/helpers.ts', helpersContent)
  }

  /**
   * Main generation process that coordinates all generator modules.
   * Each step is isolated and can be enabled/disabled via options.
   */
  private extractExample(documentation: string): string | undefined {
    const exampleRegex = /@example (.*)/
    const match = documentation.match(exampleRegex)
    return match?.[1]
  }
}

// Run the generator if called directly
if (require.main === module) {
  main()
}
