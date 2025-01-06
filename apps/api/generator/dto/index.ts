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
import type { GeneratorOptions, ModelMetadata, GeneratedFile, FieldMetadata } from './types'

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
    const schemaPath = '/Users/mac/Development/astronera/astrotribe/prisma/schema.prisma'
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

    this.documentationGenerator = new DocumentationGenerator([], options, this.fileManager)

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
    if (metadata.documentation?.description) {
      content += `/**\n * ${metadata.documentation.description}\n */\n`
    }

    // Add class definition
    content += `export class ${metadata.name}DTO {\n`

    // Generate properties with decorators
    for (const field of metadata.fields) {
      // Skip generated fields unless specifically configured
      if (field.isGenerated && !this.options.includeGeneratedFields) {
        continue
      }

      // Add property documentation
      if (field.documentation) {
        content += `  /**\n   * ${field.documentation}\n   */\n`
      }

      // Add validation decorators
      if (field.isRequired) {
        content += `  @IsNotEmpty()\n`
      } else {
        content += `  @IsOptional()\n`
      }

      // Add type-specific validation
      switch (field.type) {
        case 'String':
          content += `  @IsString()\n`
          if (field.nativeType === 'Uuid') {
            content += `  @IsUUID()\n`
          }
          break
        case 'Int':
          content += `  @IsInt()\n`
          break
        case 'Float':
        case 'Decimal':
          content += `  @IsNumber()\n`
          break
        case 'Boolean':
          content += `  @IsBoolean()\n`
          break
        case 'DateTime':
          content += `  @IsDate()\n`
          content += `  @Transform(({ value }) => value ? new Date(value) : null)\n`
          break
        case 'Json':
          content += `  @IsJSON()\n`
          break
      }

      // Add Swagger documentation
      content += `  @ApiProperty({\n`
      content += `    description: ${JSON.stringify(field.documentation || '')},\n`
      content += `    type: ${this.getSwaggerType(field)},\n`
      content += `    required: ${field.isRequired},\n`
      if (field.kind === 'enum') {
        content += `    enum: ${field.type},\n`
      }
      content += `  })\n`

      // Add property definition
      content += `  ${field.name}${field.isRequired ? '' : '?'}: ${this.typeMapper.mapPrismaToTypeScript(field)};\n\n`
    }

    // Close the class
    content += `}\n`

    return {
      path: `dto/${metadata.name.toLowerCase()}.dto.ts`,
      content,
    }
  }

  private getSwaggerType(field: FieldMetadata): string {
    switch (field.type) {
      case 'String':
        return 'String'
      case 'Int':
      case 'Float':
      case 'Decimal':
        return 'Number'
      case 'Boolean':
        return 'Boolean'
      case 'DateTime':
        return 'Date'
      case 'Json':
        return 'Object'
      default:
        if (field.kind === 'enum') {
          return field.type
        }
        return 'String'
    }
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
